const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
module.exports = {
  name: "help",
  usage: `/help`,
  category: `Info`,
  description: "Replies with all commands & categories!",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  run: async (client, interaction) => {
    const commands = client.slashCommands.map(({ name }) => name);
    const getDirs = (path) =>
  fs.readdirSync(path).filter((file) =>
    fs.statSync(`${path}/${file}`).isDirectory()
  );

  const folders = getDirs('./slashCommands/');
    const helpMenu = new EmbedBuilder()
      .setTitle(`Help Menu`)
      .setDescription(`All Categories: **${folders.join("**, **")}**\nAll Commands: **${commands.join("**, **")}**`)
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({
        text: `Requested by: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor(`White`);
    interaction.reply({embeds: [helpMenu] });
  },
};
