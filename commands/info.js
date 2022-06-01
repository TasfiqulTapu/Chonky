const {MessageEmbed} = require("discord.js");


module.exports = {
	name: 'info',
  aliases:['ping'],
	async execute(message, args, client) {
    let embed = new MessageEmbed()
    .setColor("#2C2F33")
    .setTitle(`${client.user.username} bot`)
    .addField(
            "Process",
            `Message latency: ${Math.round(
              Date.now() - message.createdTimestamp
            )}ms \nAPI latency: ${
              client.ws.ping
            }ms\nOnline since: <t:${Math.round(
              Date.now()/1000 - process.uptime())}:R>`
          )
  .addField("Application", `Servers: ${
    client.guilds.cache.size
  }\nUsers: ${
    client.users.cache.size
  }`
        )
	.setFooter("hello :)");
 message.channel.send({ embeds: [embed] });
  }}