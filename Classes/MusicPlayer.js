const { LAVALINK_NODES, LAVALINK } = require("../config");
const { PlayerManager, Player } = require("discord.js-lavalink");
const { shuffleArray, pullProps } = require("./util");
const Paginator = require("./Paginator");
const snekfetch = require("snekfetch");
const Duration = require("duration-js");

class MusicPlayer {
    manager; // PlayerManager

    guilds = {}; // Array<GuildPlayers>

    async get(channel) {
        const { guild, id } = channel;
        let player = this.guilds[guild.id];
        if (player) return player;

        player = new GuildPlayer(await this.createPlayer(channel), channel)
        return this.guilds[guild.id] = player;
    }

    check(channel) {
        let player = this.guilds[channel.guild.id];
        if (player) return player;
        else return false;
    }

    kill(guild) {
        const player = this.guilds[guild.id];
        if (!player) return;
        this.manager.leave(guild.id);
        this.guilds[guild.id] = undefined;
    }

    async createPlayer(channel) {
        return this.manager.join({
            channel: channel.id,
            guild: channel.guild.id,
            host: "localhost"
        }, { selfmute: true });
    }

    constructor(bot) {
        this.bot = bot;
        this.manager = new PlayerManager(bot, LAVALINK_NODES, {
            user: bot.user.id,
            shards: 1
        })
    }
}

class GuildPlayer {
    player;
    guild; // The guild this player is attached to.
    channel;
    client;
    _broadcastChannel;

    playlist = [];

    isPlaying = false;
    currentTrack;
    loopPlaylist = false;

    dj;
    // Commands

    async playLink(query) {
        let tracks = await loadTracks(query);
        for (let i = 0; i < tracks.length; i++) {
            tracks[i] = this.formatTrack(tracks[i]);
            this.queueTrack(tracks[i]);
        }
        return tracks;
    }

    async playSearch(query) {
        let track = await loadTracks(query, true);
        track = this.formatTrack(track);
        this.queueTrack(track);
        return track;
    }

    async search(query) {
        const tracks = await loadTracks(query);
        for (let i = 0; i < tracks.length; i++) {
            tracks[i] = this.formatTrack(tracks[i]);
        }
        return tracks;
    }

    skip() {
        if (!this.isPlaying) return;
        this.playNext();
    }

    skipto(to) {
        if (!this.isPlaying) return;
        for (let i = 0; i < to - 1; i++) {
            let sk = this.playlist.shift();
            if (!sk) return this.kill();
            if (this.loopPlaylist) this.playlist.push(sk);
        }
        this.playNext();
    }

    pause() {
        if (!this.isPlaying) return;
        this.player.pause();
    }

    unpause() {
        if (!this.isPlaying) return;
        this.player.pause(false);
    }

    seek(to) {
        if (!this.isPlaying) return;
        if (this.playlist[0].seekable) return;
        this.player.seek(to);
    }

    volume(vol) {
        if (!this.isPlaying) return;
        this.player.volume(vol);
    }

    loop() {
        this.loopPlaylist = !this.loadPlaylist;
    }

    // Track playing

    playNext() {
        const next = this.playlist.shift();
        if (!next) return this.kill();

        if (this.loopPlaylist) this.playlist.push(next);

        this.isPlaying = true;
        this.currentTrack = next;
        this.player.play(next.code);

        const { author, title } = next;
        this.broadcast(`Now playing ${title} uploaded by ${author}`);
    }

    queueTrack(track) {
        if (this.playlist.length < 600)
            this.playlist.push(track);

        if (!this.isPlaying) this.playNext();
    }

    formatTrack(track) {
        const { info } = track;
        return {
            code: track.track,
            title: info.title,
            author: info.author,
            length: info.length,
            seekable: info.isSeekable,
            url: info.uri
        }
    }

    onPlayerEnd(data) {
        if (data.reason === "REPLACED") return;
        if (this.playlist.length < 1) {
            this.broadcast("You've run out of tunes, queue up some more!");
            this.kill();
        }
        this.playNext();
    }

    onPlayerError(error) {
        this.kill();
        console.log(error);
    }

    setBroadcast(channel) {
        this._broadcastChannel = channel;
    }

    broadcast(msg) {
        if (!this._broadcastChannel) return;
        this._broadcastChannel.send(`**:musical_note: | ${msg}**`);
    }

    setDJ(id) {
        this.dj = id;
    }

    isDJ(id, channel) {
        if (id === this.dj) return true;
        const perms = channel.permissionsFor(id);
        if (perms.has("MANAGE_MESSAGES") || perms.has("MANAGE_GUILD")) return true;
        return false;
    }

    kill() {
        this.isPlaying = false;
        this.playlist = [];

        this.player.stop();

        this.client.player.kill(this.guild);
    }

    // Playlist handling

    playlistInfo(page = 1) {
        if (!this.isPlaying) return;
        if (!this.currentTrack) return;

        let tracks = [];
        const pages = new Paginator(this.playlist, 20);
        pages.loopPage(page, (item, i) => {
            tracks.push({
                title: item.title,
                author: item.author,
                url: item.url,
                length: new Duration(item.length),
                index: i
            });
        })
        const pageCount = pages.pageCount;
        let totalLength = this.playlist.reduce((a, b) => ({ length: a.length + b.length })).length;
        totalLength = new Duration(totalLength);
        const nowPlaying = pullProps(this.currentTrack, ["title", "author", "length", "url"]);
        nowPlaying.length = new Duration(nowPlaying.length);

        return { tracks, totalLength, nowPlaying, pageCount };
    }

    shufflePlaylist() {
        if (!this.isPlaying) return;
        this.playlist = shuffleArray(this.playlist);
    }

    async loadPlaylist(urls) {
        let playlist = [];
        for (let i = 0; i < urls.length; i++) {
            let track = await loadTracks(urls[i]);
            track = this.formatTrack(track);
            playlist.push(track);
        }
        this.playlist = playlist;
        this.playNext();
    }

    savePlaylist() {
        let saved = [];
        for (let i = 0; i < this.playlist.length; i++) {
            saved.push(this.playlist[i].url);
        }
        return saved;
    }

    constructor(player, channel, _broadcastChannel) {
        this.guild = channel.guild;
        this.channel = channel;
        this.client = channel.client;
        this.player = player;
        this._broadcastChannel = _broadcastChannel;

        player.on("error", this.onPlayerError.bind(this));
        player.on("end", this.onPlayerEnd.bind(this));
    }
}

async function loadTracks(query, firstResultOnly = false) {
    const res = await snekfetch.get(`http://localhost:2334/loadtracks?identifier=${query}`)
        .set("Authorization", LAVALINK);
    if (!res || !res.body || !res.body.length) throw "No tracks found."
    return firstResultOnly ? res.body[0] : res.body;
}

module.exports = MusicPlayer;