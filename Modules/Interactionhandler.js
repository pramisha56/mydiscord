const fs = require('fs');
const csv = require('csv-parser');
const {
    Client,
    IntentsBitField,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ChannelType,
    PermissionFlagsBits,
} = require("discord.js");

// All Sub-Modules Imports Goes Here
const subEventManager = require("../src/commands/create-sub-event.js");
const voiceManager = require("../src/commands/create-voice-channel.js");
require("dotenv").config();

module.exports = async (interaction) => {
    try {
        // Handle Button Interactions
        if (interaction.isButton()) {
            console.log("Button interaction received:", interaction.customId);
            // Add your button handling logic here
            return;
        }

        // Handle Slash Commands
        if (interaction.isChatInputCommand()) {
            let commandHandled = false;

            switch (interaction.commandName) {
                case 'create-sub-event-channel':
                    await subEventManager.handelinteraction(interaction);
                    commandHandled = true;
                    break;
                    
                    case 'create-voice-channel':
                    case 'voice':
                        await voiceManager.handelinteraction(interaction);
                    commandHandled = true;
                    break;

                // Add more command cases here
            }

            // Only send unknown command message if command wasn't handled
            if (!commandHandled && !interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'Unknown command.',
                    ephemeral: true
                });
            }
        }
    } catch (error) {
        console.error('Error in interaction handler:', error);

        try {
            const errorMessage = {
                content: 'There was an error processing your request.',
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        } catch (e) {
            console.error('Error sending error message:', e);
        }
    }
};