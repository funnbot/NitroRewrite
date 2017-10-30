module.exports = Regex = {
    user: {
        name: /^.{2,32}(#[0-9]{0,4})?$/,
        mention: /^<@!?[0-9]{17,19}>$/
    },
    channel: {
        name: /^[a-z_-]{2,100}$/,
        mention: /^<#[0-9]{17,19}>$/
    },
    role: {
        name: /^.{1,100}$/,
        mention: /^<@&[0-9]{17,19}>$/
    },
    id: /^[0-9]{17,19}$/
}
