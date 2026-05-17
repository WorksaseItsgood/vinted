const { Events } = require('discord.js');
const logger = require('../../utils/logger');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                logger.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                logger.error(`Error executing ${interaction.commandName}:`, error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } else if (interaction.isButton()) {
            // Placeholder for button handling (Make Offer, Send Message, View Listing, Add Tracker)
            logger.info(`Button clicked: ${interaction.customId} by ${interaction.user.tag}`);
            
            if (interaction.customId === 'add_tracker') {
                const { buildTrackerModal } = require('../ui/components');
                await interaction.showModal(buildTrackerModal());
            } else if (interaction.customId === 'refresh_dashboard') {
                const { buildDashboardEmbed } = require('../ui/embeds');
                const { buildDashboardControls } = require('../ui/components');
                const trackers = []; // Fetch from DB in real implementation
                
                await interaction.update({
                    embeds: [buildDashboardEmbed()],
                    components: buildDashboardControls(trackers)
                });
            }
            // Add other button handlers here
        } else if (interaction.isStringSelectMenu()) {
            // Placeholder for select menu handling (Pause, Edit, Delete Tracker)
             logger.info(`Select menu used: ${interaction.customId} by ${interaction.user.tag}`);
             await interaction.reply({ content: `Action executed for tracker ID: ${interaction.values[0]}`, ephemeral: true });
        } else if (interaction.isModalSubmit()) {
            // Placeholder for modal submit handling
            logger.info(`Modal submitted: ${interaction.customId} by ${interaction.user.tag}`);
            
            if (interaction.customId === 'add_tracker_modal') {
                const url = interaction.fields.getTextInputValue('tracker_url');
                const keywords = interaction.fields.getTextInputValue('tracker_keywords');
                const maxPrice = interaction.fields.getTextInputValue('tracker_max_price');
                
                // Here we would insert into DB
                await interaction.reply({ content: `Tracker added for ${url}!\nKeywords: ${keywords || 'None'}\nMax Price: ${maxPrice || 'None'}`, ephemeral: true });
            } else if (interaction.customId === 'auth_modal') {
                const vintedCookie = interaction.fields.getTextInputValue('vinted_cookie');
                const leboncoinCookie = interaction.fields.getTextInputValue('leboncoin_cookie');
                
                // Here we would encrypt and save to DB
                await interaction.reply({ content: 'Authentication details saved securely.', ephemeral: true });
            }
        }
    },
};
