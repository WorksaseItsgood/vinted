const { SlashCommandBuilder } = require('discord.js');
const { buildDashboardEmbed } = require('../ui/embeds');
const { buildDashboardControls } = require('../ui/components');

module.exports = {
    data: new SlashCommandBuilder()
        .name('dashboard')
        .setDescription('Opens the scraper control panel'),
    async execute(interaction) {
        const embed = buildDashboardEmbed();
        
        // Fetch trackers from DB for this user here. Passing empty array for now.
        const trackers = []; 
        const components = buildDashboardControls(trackers);

        await interaction.reply({
            embeds: [embed],
            components: components,
            ephemeral: true // Dashboard is private to the user executing it
        });
    },
};
