module.exports = async function(message) {
    const { content, guild, author, channel } = message;

    const filters = await guild.filters();
    if (filters.length < 0) return;

    
}