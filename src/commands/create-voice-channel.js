const { PermissionsBitField, ChannelType } = require('discord.js');

// Store temporary voice channels
const temporaryVoiceChannels = new Map();

module.exports = {
    handelinteraction: async (interaction) => {
        try {
            if (!interaction.isChatInputCommand()) return;

            // Handle create-voice-channel command
            if (interaction.commandName === 'create-voice-channel') {
                await createBasicVoiceChannel(interaction);
                return;
            }

            // Handle voice management commands
            if (interaction.commandName === 'voice') {
                const subcommand = interaction.options.getSubcommand();
                switch (subcommand) {
                    case 'create':
                        await createPersonalChannel(interaction);
                        break;
                    case 'limit':
                        await setUserLimit(interaction);
                        break;
                    case 'lock':
                        await lockChannel(interaction);
                        break;
                    case 'unlock':
                        await unlockChannel(interaction);
                        break;
                }
            }
        } catch (error) {
            console.error('Error in voice command:', error);
            if (!interaction.replied) {
                await interaction.editReply('There was an error processing your request.');
            }
        }
    }
};

// Basic voice channel creation
async function createBasicVoiceChannel(interaction) {
    await interaction.deferReply();
    const channelName = interaction.options.getString('name');
    
    if (!channelName) {
        return await interaction.editReply('Please provide a name for the voice channel!');
    }

    // Check bot permissions
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return await interaction.editReply('I need permission to manage channels to use this command.');
    }

    try {
        const voiceChannel = await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildVoice,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.Connect,
                        PermissionsBitField.Flags.Speak
                    ]
                }
            ]
        });

        await interaction.editReply(
            `Voice channel **${voiceChannel.name}** has been created successfully!`
        );
    } catch (error) {
        console.error('Error creating voice channel:', error);
        await interaction.editReply('There was an error creating the voice channel.');
    }
}

// Personal voice channel creation with advanced features
async function createPersonalChannel(interaction) {
    await interaction.deferReply();
    const channelName = interaction.options.getString('name');
    const userLimit = interaction.options.getInteger('limit') || 0;

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
        return await interaction.editReply('I need permission to manage channels to use this command.');
    }

    try {
        const voiceChannel = await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildVoice,
            userLimit: userLimit,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.Connect,
                        PermissionsBitField.Flags.Speak
                    ]
                },
                {
                    id: interaction.user.id,
                    allow: [
                        PermissionsBitField.Flags.ManageChannels,
                        PermissionsBitField.Flags.ManageRoles,
                        PermissionsBitField.Flags.MoveMembers
                    ]
                }
            ]
        });

        // Store channel info for management commands
        temporaryVoiceChannels.set(voiceChannel.id, {
            ownerId: interaction.user.id,
            createdAt: Date.now()
        });

        await interaction.editReply(
            `Personal voice channel **${voiceChannel.name}** has been created successfully!`
        );
    } catch (error) {
        console.error('Error creating voice channel:', error);
        await interaction.editReply('There was an error creating the voice channel.');
    }
}

async function setUserLimit(interaction) {
    const limit = interaction.options.getInteger('amount');
    const channel = interaction.member.voice.channel;

    if (!channel) {
        return await interaction.reply('You must be in a voice channel to use this command.');
    }

    const channelInfo = temporaryVoiceChannels.get(channel.id);
    if (!channelInfo || channelInfo.ownerId !== interaction.user.id) {
        return await interaction.reply('You can only modify channels you created.');
    }

    try {
        await channel.setUserLimit(limit);
        await interaction.reply(`User limit for **${channel.name}** has been set to ${limit || 'unlimited'}.`);
    } catch (error) {
        console.error('Error setting user limit:', error);
        await interaction.reply('There was an error setting the user limit.');
    }
}

async function lockChannel(interaction) {
    const channel = interaction.member.voice.channel;

    if (!channel) {
        return await interaction.reply('You must be in a voice channel to use this command.');
    }

    const channelInfo = temporaryVoiceChannels.get(channel.id);
    if (!channelInfo || channelInfo.ownerId !== interaction.user.id) {
        return await interaction.reply('You can only modify channels you created.');
    }

    try {
        await channel.permissionOverwrites.edit(interaction.guild.id, {
            Connect: false
        });
        await interaction.reply(`Voice channel **${channel.name}** has been locked.`);
    } catch (error) {
        console.error('Error locking channel:', error);
        await interaction.reply('There was an error locking the channel.');
    }
}

async function unlockChannel(interaction) {
    const channel = interaction.member.voice.channel;

    if (!channel) {
        return await interaction.reply('You must be in a voice channel to use this command.');
    }

    const channelInfo = temporaryVoiceChannels.get(channel.id);
    if (!channelInfo || channelInfo.ownerId !== interaction.user.id) {
        return await interaction.reply('You can only modify channels you created.');
    }

    try {
        await channel.permissionOverwrites.edit(interaction.guild.id, {
            Connect: null
        });
        await interaction.reply(`Voice channel **${channel.name}** has been unlocked.`);
    } catch (error) {
        console.error('Error unlocking channel:', error);
        await interaction.reply('There was an error unlocking the channel.');
    }
}
