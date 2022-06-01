const { MessageEmbed } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  name: "help",
  aliases: [""],
  async execute(message, args, client) {
    let embed = new MessageEmbed()
      .setColor("#2C2F33")
      .setTitle(`${client.user.username} bot`)
      .setURL(
        `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=0`
      )
      .setDescription(
        `**Prefix**: ${
          process.env.PREFIX
        } , ${`<@${client.user.id}>`}\n[Invite](https://discord.com/oauth2/authorize?client_id=${
          client.user.id
        }&scope=bot&permissions=0)`
      )
      .addFields(
        { name: "npm", value: "Find download size of an npm package." },
        { name: "compare", value: "Compare 2 npm packages" },
        { name: "info", value: "Bot info." }
      )
      .setFooter("hello :)");
    message.channel.send({ embeds: [embed] });
  },
};
