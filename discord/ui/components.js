const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const buildDashboardControls = (trackers = []) => {
    const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('add_tracker')
                .setLabel('➕ Add New Tracker')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('refresh_dashboard')
                .setLabel('🔄 Refresh')
                .setStyle(ButtonStyle.Secondary)
        );

    if (trackers.length === 0) {
        return [buttonRow];
    }

    const selectMenuRow = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('manage_trackers')
                .setPlaceholder('Manage active trackers...')
                .addOptions(trackers.map(t => 
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`${t.marketplace === 'vinted' ? '👕' : '📦'} ${t.url.substring(0, 50)}`)
                        .setDescription(`Max: ${t.maxPrice || 'Any'} | Status: ${t.status}`)
                        .setValue(t.id.toString())
                ))
        );

    return [selectMenuRow, buttonRow];
};

const buildAlertButtons = (itemUrl) => {
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('make_offer')
                .setLabel('💰 Make Offer')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('send_message')
                .setLabel('✉️ Send Message')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setLabel('🔗 View Listing')
                .setURL(itemUrl)
                .setStyle(ButtonStyle.Link)
        );
};

const buildTrackerModal = () => {
    const modal = new ModalBuilder()
        .setCustomId('add_tracker_modal')
        .setTitle('Add New Tracker');

    const urlInput = new TextInputBuilder()
        .setCustomId('tracker_url')
        .setLabel("Search URL (Vinted or Leboncoin)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const keywordsInput = new TextInputBuilder()
        .setCustomId('tracker_keywords')
        .setLabel("Keywords (comma separated, optional)")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const maxPriceInput = new TextInputBuilder()
        .setCustomId('tracker_max_price')
        .setLabel("Max Price (optional)")
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    modal.addComponents(
        new ActionRowBuilder().addComponents(urlInput),
        new ActionRowBuilder().addComponents(keywordsInput),
        new ActionRowBuilder().addComponents(maxPriceInput)
    );

    return modal;
};

const buildAuthModal = () => {
    const modal = new ModalBuilder()
        .setCustomId('auth_modal')
        .setTitle('Update Authentication Cookies');

    const vintedInput = new TextInputBuilder()
        .setCustomId('vinted_cookie')
        .setLabel("Vinted Session Cookie (Optional)")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

    const leboncoinInput = new TextInputBuilder()
        .setCustomId('leboncoin_cookie')
        .setLabel("Leboncoin Session Cookie (Optional)")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

    modal.addComponents(
        new ActionRowBuilder().addComponents(vintedInput),
        new ActionRowBuilder().addComponents(leboncoinInput)
    );

    return modal;
};

module.exports = {
    buildDashboardControls,
    buildAlertButtons,
    buildTrackerModal,
    buildAuthModal
};
