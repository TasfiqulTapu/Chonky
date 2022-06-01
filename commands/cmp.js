const fetch = require("node-fetch");

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "cmp",
  aliases: ["compare"],
  rateLimit: 15000,
  async execute(message, args, client) {
    // command rate limit
    let timeout = client.userCMPRatelimits.get(message.author.id);
    if (timeout - Date.now() > this.rateLimit * 2) return;
    if (timeout && timeout > Date.now()) {
      client.userCMPRatelimits.set(
        message.author.id,
        timeout + this.rateLimit * 0.25
      );
      return message.channel.send(
        `Please wait another ${Math.ceil((timeout - Date.now()) / 1000)}s`
      );
    }
    client.userCMPRatelimits.set(
      message.author.id,
      Date.now() + this.rateLimit
    );
    
    
    //this takes 2 arguments
    
    if (args.length < 2) {
      let embed = new MessageEmbed()
        .setColor("#fab1b1")
        .setTitle(`Please provide 2 package names`)
        .addField(
          "Example",
          `${process.env.PREFIX}cmp [nextjs react]\n${process.env.PREFIX}cmp [discord.js@13.1.0 discord.js@13.7.0]`
        );
      message.channel.send({ embeds: [embed] });
      return;
    }

    // uses packagephobia.com Api
    // link : https://github.com/styfle/packagephobia/blob/main/API.md

    let data1 = await fetch(
      `https://packagephobia.com/v2/api.json?p=${args[0]}`
    );
    let data2 = await fetch(
      `https://packagephobia.com/v2/api.json?p=${args[1]}`
    );
    try {
      data1 = JSON.parse(await data1.text());
      data2 = JSON.parse(await data2.text());
      if (data1["version"] != "unknown" && data2["version"] != "unknown") {
        let embed = new MessageEmbed()
          .setColor(data1["install"]["color"])
          .setTitle(
            `${data1["name"]}@${data1["version"]} vs ${data2["name"]}@${data2["version"]}`
          )
          .addFields(
            {
              name: "Source",
              value: `${data1["publish"]["pretty"]} vs ${data2["publish"]["pretty"]}`,
            },
            {
              name: "Install",
              value: `${data1["install"]["pretty"]} vs ${data2["install"]["pretty"]}`,
            }
          )
          .setFooter({ text: "Data from packagephobia.com" });

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
