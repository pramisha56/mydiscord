require('dotenv').config();
const { REST, Routes,ApplicationCommandOptionType } = require('discord.js');


//The Below Snippets Shows How to Create a Slash Command( generally for Moderator and Higher Level Use (Make the Command Name and Conditions Discriptive ))
 const commands = [ 
  {
    name: "create-sub-event-channel",
    description: "Creates a category and text channel within it",
    options: [
      {
        type : ApplicationCommandOptionType.String,
        name: 'category-name',
        description: 'The name of the text channel category',
        required: true,
      },
    ],
  },

  // {
  //   name: "create-voice-channel",
  //   description: "Creates a category and text channel within it",
  //   options: [
  //     {
  //       type : ApplicationCommandOptionType.Channel,
  //       name: 'category-name',
  //       description: 'The name of the text channel category',
  //       required: true,
  //     },
  //   ],
  // },
  {
    "name": "create-voice-channel",
    "description": "Creates a new voice channel",
    "options": [
        {
            "name": "name",
            "description": "The name for the new voice channel",
            "type": 3,  // 3 represents STRING type
            "required": true,
            "min_length": 1,
            "max_length": 100
        }
    ]
},
{
    "name": "voice",
    "description": "Manage voice channels",
    "options": [
        {
            "name": "create",
            "description": "Create a personal voice channel",
            "type": 1,
            "options": [
                {
                    "name": "name",
                    "description": "The name for your voice channel",
                    "type": 3,
                    "required": true,
                    "min_length": 1,
                    "max_length": 100
                },
                {
                    "name": "limit",
                    "description": "Set a user limit for the channel (0 for unlimited)",
                    "type": 4,
                    "required": false,
                    "min_value": 0,
                    "max_value": 99
                }
            ]
        },
        {
            "name": "limit",
            "description": "Set the user limit for your voice channel",
            "type": 1,
            "options": [
                {
                    "name": "amount",
                    "description": "The maximum number of users (0 for unlimited)",
                    "type": 4,
                    "required": true,
                    "min_value": 0,
                    "max_value": 99
                }
            ]
        },
        {
            "name": "lock",
            "description": "Lock your voice channel",
            "type": 1
        },
        {
            "name": "unlock",
            "description": "Unlock your voice channel",
            "type": 1
        }
    ]
}
//   {
//     name: 'createrole',
//     description: 'create a new role along with the needed channel(Admin Level Only)',
//     options:[
//       {
//         name:'role_name',
//         description:'name of the role',
//         type: ApplicationCommandOptionType.String,
//         required: true,
//       },
//       {
//         name: 'role_emoji',
//         description: 'emoji for the role',
//         type: ApplicationCommandOptionType.String,
//         required: true,
//       },
     
     
//     ]
//   },
//   {
//     name: 'createproject',
//     description: 'create a new role project with the needed channel(Admin Level Only)',
//     options:[
//       {
//         name:'project_name',
//         description:'name of the project',
//         type: ApplicationCommandOptionType.String,
//         required: true,
//       },
//       {
//         name: 'project_emoji',
//         description: 'emoji for the project',
//         type: ApplicationCommandOptionType.String,
//         required: true,
//       },
     
     
//     ]
//   },
//   {
//     name: 'deletechannel',
//     description: 'create a new role project with the needed channel(Admin Level Only)',
    
//   },
  


 
 ];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();