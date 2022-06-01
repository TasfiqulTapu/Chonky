const fs = require("fs");
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const prefix = process.env.PREFIX;

// command handler
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// rate limit collections for search and compare commands
client.userNPMRatelimits = new Collection();
client.userCMPRatelimits = new Collection();

// static hosting for website
const express = require("express");
const app = express();
app.use(express.static("public"));
app.get("/", (request, response) => {
  response.redirect("/index.html");
});
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// message recieve event.
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content) return;
  if (message.content.startsWith(`<@${client.user.id}>`)) {
    message.content = message.content.slice(`<@${client.user.id}`.length);
  }
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(" ");
  const commandName = args.shift().toLowerCase();
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return;
  try {
    command.execute(message, args, client);
  } catch (error) {
    console.error(error);
  }
});

// this runs once
client.on("ready", () => {
  console.log("Running bot");
  const activities = [
    ["you from the closet", "WATCHING"],
    ["to your cries", "LISTENING"],
  ];
  setInterval(() => {
    const index = Math.floor(Math.random() * (activities.length - 1));
    client.user.setActivity(activities[index][0], {
      type: activities[index][1],
    });
  }, 30000);
});

client.login(process.env.TOKEN);
