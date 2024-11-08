
require("dotenv").config();
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
} = require("discord.js");


//This is Where you Import Any Other files You may need ( Reccomended to Connect Functions within Interaction Handler rather than In Main)
const interactionshandler=require("../Modules/Interactionhandler.js");
const registerCommands = require("../OneTimeRuns/RegisterSlashCommands.js");
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildEmojisAndStickers,
    
  ],
 
});



client.on("ready", (c) => {
  console.log(`✅ ${c.user.tag} is online.`);
  // welcome(client);

});


client.on("interactionCreate", async (interaction) => {
    try {
      interactionshandler(interaction)


      
     
      
     
      
    } catch (error) {
      console.log(error);
    }
  });
client.login(process.env.TOKEN);
