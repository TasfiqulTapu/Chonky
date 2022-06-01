const fetch = require("node-fetch");

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "npm",
  aliases: ["package", "search"],
  rateLimit: 12000,
  async execute(message, args, client) {
    // command ratelimit
    let timeout = client.userNPMRatelimits.get(message.author.id);
    if (timeout - Date.now() > this.rateLimit * 2) return;
    if (timeout && timeout > Date.now()) {
      client.userNPMRatelimits.set(
        message.author.id,
        timeout + this.rateLimit * 0.25
      );
      return message.channel.send(
        `Please wait another ${Math.ceil((timeout - Date.now()) / 1000)}s`
      );
    }
    client.userNPMRatelimits.set(
      message.author.id,
      Date.now() + this.rateLimit
    );
    
    // check for invalid arguments, only first argument is used to search
    if (!args[0]) {
      let embed = new MessageEmbed()
        .setColor("#fab1b1")
        .setTitle(`Please provide a package name`)
        .addField(
          "Example",
          `${process.env.PREFIX}npm [nextjs]\n${process.env.PREFIX}npm [discord.js@13.1.0]`
        );
      message.channel.send({ embeds: [embed] });
      return;
    }
    // uses packagephobia.com Api
    // link : https://github.com/styfle/packagephobia/blob/main/API.md
    let data = await fetch(
      `https://packagephobia.com/v2/api.json?p=${args[0]}`
    );
    try {
      data = JSON.parse(await data.text());
      if (data["version"] != "unknown") {
        let embed = new MessageEmbed()
          .setColor(data["install"]["color"])
          .setTitle(`${data["name"]}@${data["version"]}`)
          .setURL(
            `https://npmjs.org/package/${data["name"]}/v/${data["version"]}`
          )
          .addFields(
            { name: "Source", value: data["publish"]["pretty"] },
            { name: "Install", value: data["install"]["pretty"] }
          )
          .setFooter("Data from packagephobia.com");
        message.channel.send({ embeds: [embed] });
      } else {
        message.channel.send("Unknown version");
      }
    } catch (err) {
      message.channel.send("Couldn't find that package :(");
      console.error(err);
    }
  },
};
