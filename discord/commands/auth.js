const { SlashCommandBuilder } = require('discord.js');
const { buildAuthModal } = require('../ui/components');

module.exports = {
    data: new SlashCommandBuilder()
        .name('auth')
        .setDescription('Securely update your session cookies for automation'),
    async execute(interaction) {
        const modal = buildAuthModal();
        await interaction.showModal(modal);
    },
};
