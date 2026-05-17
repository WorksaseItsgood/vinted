const { EmbedBuilder } = require('discord.js');

const buildDashboardEmbed = () => {
    return new EmbedBuilder()
        .setTitle('🎯 Scraper Control Panel')
        .setDescription('Manage your active trackers, view statistics, and configure alerts.')
        .setColor('#2b2d31')
        .addFields(
            { name: '🟢 Active Trackers', value: '0', inline: true },
            { name: '⏸️ Paused', value: '0', inline: true },
            { name: '🔔 Total Alerts Sent', value: '0', inline: true }
        )
        .setFooter({ text: 'Vinted & Leboncoin Monitor' })
        .setTimestamp();
};

const buildAlertEmbed = (item) => {
    const isVinted = item.marketplace === 'vinted';
    return new EmbedBuilder()
        .setTitle(item.title)
        .setURL(item.url)
        .setColor(isVinted ? '#09B1BA' : '#FF6E14') // Vinted Cyan, LBC Orange
        .setThumbnail(item.imageUrl || null)
        .addFields(
            { name: '💰 Price', value: `**${item.price}**`, inline: true },
            { name: '🏷️ Condition', value: item.condition || 'N/A', inline: true },
            { name: '👤 Seller', value: item.sellerName || 'N/A', inline: true },
            { name: '⏱️ Uploaded', value: item.uploadTime || 'Just now', inline: true }
        )
        .setFooter({ text: `${isVinted ? 'Vinted' : 'Leboncoin'} Alert` })
        .setTimestamp();
};

module.exports = {
    buildDashboardEmbed,
    buildAlertEmbed
};
