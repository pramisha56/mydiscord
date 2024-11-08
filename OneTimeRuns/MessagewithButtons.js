require('dotenv').config();
const {
  Client,
  IntentsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  
} = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
const Channels=[``,``]//The Channels where these Messages Should Go 

const buttons = [
  {
    id: 'Bugreport',//The Name The Bot Recognizes the Button By
    label: 'Report Bug',//The Name Shown to the End User
  }
  
  
];

client.on('ready', async (c) => {
  try {
    for( const cnl of Channels){
    const channel = await client.channels.cache.get(cnl);
    if (!channel) return;
    

    const row = new ActionRowBuilder();

    buttons.forEach((button) => {
      row.components.push(
        new ButtonBuilder()
          .setCustomId(button.id)
          .setLabel(button.label)
          .setStyle(ButtonStyle.Primary)
      );
    });

    await channel.send({
      content: 'Use the button below to submit an Official Bug report. Please make the report as clear as possible with proper recreation steps.',//The Message Shown to the User Before The Button
      components: [row],
    });
}
    process.exit();
  } catch (error) {
    console.log(error);
  }
  
});

client.login(process.env.TOKEN);