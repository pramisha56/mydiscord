const discord = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const { request } = require("undici");

require("dotenv").config();
module.exports = (client) => {
  client.on("guildMemberAdd", async (member) => {
    const welcomechannel = client.channels.cache.get(process.env.WelcomeID);
    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext("2d");
    const background = await Canvas.loadImage(
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTibfc2lUi2N9lHZsnKZMVDIB_38hlwvRzsuQ&s"//Image URL for the Banner Goes Here
    );

    context.drawImage(background, 0, 0, canvas.width, canvas.height);

   
    var text = `${member.user.tag}!`;

    // Select the font size and type from one of the natively available fonts
    context.font = "bold 40px Arial";

    // Select the style that will be used to fill the text in
    context.fillStyle = "#ffffff";

    // Actually fill the text with a solid color
    // Calculate the width of the text
    const textWidth = context.measureText(text).width;

    // Calculate the x-coordinate to center the text horizontally
    const textX = (canvas.width - textWidth) / 2;

   

    context.fillText(text, canvas.width / 2.5, canvas.height / 1.8);
    // context.fillText("Welcome", canvas.width / 2.5, canvas.height / 1.8);
    context.beginPath();
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    context.strokeStyle = "#0099ff";
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // Using undici to make HTTP requests for better performance
    const { body } = await request(
      member.user.displayAvatarURL({ extension: "jpg" })
    );
    const avatar = await Canvas.loadImage(await body.arrayBuffer());
    context.drawImage(avatar, 25, 25, 200, 200);

    // Create the attachment and send it
    const attachment = new discord.AttachmentBuilder(
      await canvas.encode("png"),
      { name: "profile-image.png" }
    );

    //embed
    const embed =new discord.EmbedBuilder()
    .setTitle("PlaceHolder ")
    .setDescription(`${member} \n\n Welcome to the Discord Server of PlaceHolder.` );//This is the Welcome Message Edit Accourdingly
    welcomechannel.send({ files: [attachment] });

    // Send the welcome message to the channel and user's DM
    welcomechannel.send({embeds:[embed]}
    );
   

    const dmMessage = `Welcome to ${member.guild.name}, ${member}!\n\nWe're thrilled to have you join the official Discord channel for PlaceHolder..`;//This Message Goes to the User Direct Messages

    member.send(dmMessage).catch((err) => {
      console.error(err);
    });
  });
};