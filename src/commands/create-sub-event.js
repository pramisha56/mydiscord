require("dotenv").config();
const fs = require('fs');
const path = require('path');
const { PermissionsBitField } = require('discord.js');

const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");


module.exports = {
  handelinteraction: async (interaction) => {
      try {
          if (!interaction.isChatInputCommand()) return;
          if (interaction.commandName === 'create-sub-event-channel') {
              const categoryName = interaction.options.getString('category-name');
              await interaction.deferReply();

              // Check bot permissions
              if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                  return interaction.editReply('I need permission to manage channels to use this command.');
              }

              // Find moderator role
              const role = interaction.guild.roles.cache.find(r => r.name === "moderators");
              if (!role) {
                  return interaction.editReply('Specified role not found.');
              }

              try {
                  // Create category
                  const category = await interaction.guild.channels.create({
                      name: categoryName,
                      type: 4,
                      permissionOverwrites: [
                          {
                              id: interaction.guild.roles.everyone.id,
                              deny: [PermissionsBitField.Flags.ViewChannel],
                          },
                          {
                              id: role.id,
                              allow: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.SendMessages
                              ],
                          }
                      ]
                  });

                  // Create Test channel
                  const channel1 = await interaction.guild.channels.create({
                      name: "Test",
                      type: 0,
                      parent: category.id,
                      permissionOverwrites: [
                          {
                              id: interaction.guild.roles.everyone.id,
                              deny: [PermissionsBitField.Flags.ViewChannel],
                          },
                          {
                              id: role.id,
                              allow: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.SendMessages
                              ],
                          }
                      ]
                  });

                  await interaction.editReply(
                      `Category **${category.name}** and channel **${channel1.name}** created successfully!`
                  );

                  // Create General channel
                  const channel2 = await interaction.guild.channels.create({
                      name: "General",
                      type: 0,
                      parent: category.id,
                      permissionOverwrites: [
                          {
                              id: interaction.guild.roles.everyone.id,
                              deny: [PermissionsBitField.Flags.ViewChannel],
                          },
                          {
                              id: role.id,
                              allow: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.SendMessages
                              ],
                          }
                      ]
                  });

                  await interaction.editReply(
                      `Category **${category.name}** and channels **${channel1.name}**, **${channel2.name}** created successfully!`
                  );
              } catch (error) {
                  console.error(error);
                  await interaction.editReply('There was an error creating the category and channels.');
              }
          }
      } catch (error) {
          console.error('Error in create-sub-event-channel command:', error);
          if (!interaction.replied) {
              await interaction.reply({
                  content: 'There was an error processing your request.',
                  ephemeral: true
              });
          }
      }
  }
};