const sharp = require("sharp");
const { createCanvas, loadImage } = require("canvas");
const snekfetch = require("snekfetch");
const { Image } = require("../Nitro.js");
const bot = require("../bot.js");

const embedReg = /{embed=?#?([0-9a-f]{0,6})}/gi;
const imageReg = /{image}/gi;

//Member Join
bot.on("guildMemberAdd", (member) => {
    guildMember(member, true)
})

//Member Leave
bot.on("guildMemberRemove", (member) => {
    guildMember(member, false)
})

let guildMember = (member, type) => {
    const guild = member.guild;
    if (!guild) return;
    const user = member.user;
    if (!user) return;

    const mlchannel = guild.mlchannel;
    const mljoin = guild.mljoin;
    const mlleave = guild.mlleave;
    const mljoindm = guild.mljoindm;

    if (mljoindm && type) joinDM(user, mljoindm);

    if (!mlchannel) return;
    let msg = type ? mljoin : mlleave;
    if (!msg) return;

    const channel = guild.channels.get(mlchannel);
    if (!channel ||
        channel.type !== "text" ||
        !channel.permissionsFor(bot.user).has("SEND_MESSAGES")) return;

    if (imageReg.text(msg)) handleImage(user, channel, msg, type);
    msg = replace(msg, user, channel);
    if (embedReg.test(msg)) return handleEmbed(user, channel, msg, type);
    return handleText(channel, msg);
}

function replace(str, user, channel) {
    let rep = {
        "{user}": user.toString(),
        "{name}": user.username,
        "{tag}": user.tag,
        "{total}": channel.guild.memberCount
    };
    const keys = Object.keys(rep).join("|");
    const rex = new RegExp(keys, "g");
    return str.replace(rex, t => rep[t]);
}

function joinDM(user, joindm) {
    user.send(joindm)
        .catch(logger.debug);
}

function handleText(channel, msg) {
    msg = msg.replace(imageReg, "");
    channel.send(msg).catch(console.error);
}

function handleEmbed(user, channel, msg, type) {
    const embedExec = embedReg.exec(msg);
    const color = parseInt(embedExec, 16) ||
        type ? "#33AF1A" : "#D22419";

    msg = msg.replace(embedReg, "");
    msg = msg.replace(imageReg, "");

    const embed = new bot.Embed()
        .setColor(color)
        .setDescription(msg)
        .setFooter("User " + (type ? "joined" : "left"))
        .setTimestamp(new Date())
        .setAuthor(user.tag, user.displayAvatarURL())

    channel.send({ embed }).catch(console.error)
}

async function handleImage(user, channel, msg, type) {
    if (!channel.permissionsFor(bot.user).has("ATTACH_FILES")) return;
    const avatar = user.displayAvatarURL({ format: "png" });
    const tag = user.tag;
    const count = channel.guild.members.size;

    const buffer = await drawImage(tag, avatar, count, type);
    const files = [{ attachment: buffer, filename: `${user.id}.png` }]
    if (buffer) channel.send({ files }).catch(console.error);
}

function drawImage(tag, AVATAR, count, type) {
    return new Promise(async(resolve, reject) => {
        let avatar = await clipAvatar(AVATAR);
        sharp(welcomeSvg(tag, count, type))
            .overlayWith(avatar, { left: 22, top: 22 })
            .toBuffer().then(resolve);
    })
}

function clipAvatar(AVATAR) {
    return new Promise(async(resolve, reject) => {
        const canvas = createCanvas(256, 256);
        const ctx = canvas.getContext("2d");

        loadImage(await Image.readUrl(AVATAR + "?size=2048")).then(avatar => {
            ctx.drawImage(avatar, 0, 0, 256, 256);
            ctx.globalCompositeOperation = "destination-in";
            ctx.beginPath();
            ctx.arc(256 / 2, 256 / 2, 256 / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            canvas.toBuffer((err, buffer) => {
                if (err) reject(err);
                return resolve(buffer);
            })
        })
    })
}

function welcomeSvg(name, count, type) {
    type = type ? "Welcome" : "Farewell"
    name = name.replace(/<.*script.*>/gi, "");
    const font = name.length <= 12 ? 44 : 44 - ((name.length - 12) * 1.1)
    const svg =
        `<?xml version="1.0"?>
    <svg width="800" height="300" xmlns="http://www.w3.org/2000/svg">
    
     <g>
      <title>Layer 1</title>
      <ellipse fill="#2c2f33" stroke-width="0" cx="649" cy="151" id="svg_7" rx="134" ry="134"/>
      <rect id="svg_6" height="268" width="470" y="17" x="194.5" stroke-width="0" fill="#2c2f33"/>
      <ellipse fill="none" stroke-width="11" cx="150" cy="150" id="svg_1" rx="134" ry="134" stroke="#ffffff"/>
      <line stroke="#ffffff" fill="none" stroke-width="11" stroke-opacity="null" fill-opacity="null" x1="149.5" y1="16" x2="657.82323" y2="16" id="svg_12"/>
      <line stroke="#ffffff" fill="none" stroke-width="11" stroke-opacity="null" fill-opacity="null" x1="149.5" y1="284.04663" x2="655.82327" y2="284.04663" id="svg_13"/>
      <path fill="none" stroke-width="11" stroke-opacity="null" fill-opacity="null" d="m654,16c84,0 130,71 130,134c0,62 -48,133 -130,134" id="svg_14" stroke="#ffffff"/>
      <text fill="#ffffff" stroke="#000" stroke-width="0" stroke-opacity="null" x="310" y="130" id="svg_2" font-size="94" font-family="Helvetica, Arial, sans-serif" text-anchor="start" xml:space="preserve" font-weight="bold" font-style="italic">${type}</text>
      <text stroke="#000" fill="#ffffff" stroke-width="0" stroke-opacity="null" x="520" y="210" id="svg_10" font-size="${font}" font-family="Helvetica, Arial, sans-serif" text-anchor="middle" xml:space="preserve" font-weight="normal" font-style="normal">${name}</text>
     </g>
    </svg>
    `
    return new Buffer(svg);
}