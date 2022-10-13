const {
  EmbedBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

module.exports = {
  name: "info",
  category: `Info`,
  description: "Replies with info menu of a command",
  imageTut: "https://i.imgur.com/JwLQTnM.gif",
  usage: "/info <cmd-name>",
  cooldown: 3000,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "name",
      description: "Write down a existing command for detailed information!",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    const commandName = interaction.options.get("name").value;

    const slashCommand = client.slashCommands.get(commandName.toLowerCase());

    if (!slashCommand) {
      return interaction.reply({
        content: `I couldn't find this command`,
        ephemeral: true,
      });
    }

    var cmdDescription = slashCommand.description;
    var imageTut = slashCommand.imageTut;
    var cmdUsage = slashCommand.usage;
    var cmdUserPerms = slashCommand.userPerms;
    var cmdBotPerms = slashCommand.botPerms;
    var cmdCoolown = slashCommand.cooldown;
    var cmdOptions = slashCommand.options ? slashCommand.options : null

    if (!cmdOptions) {
      cmdOptions = "None"
    }

    if (!imageTut) {
      imageTut =
        "https://cdn.discordapp.com/attachments/1021876825246404608/1026250411755196507/NOTUTFOUND.png";
    }

    if (!cmdDescription) {
      cmdDescription = "None provided";
    }

    if (!cmdUsage) {
      cmdUsage = "None provided";
    }

    if (!cmdUserPerms) {
      cmdUserPerms = "None provided";
    } else if (cmdUserPerms === "") {
      cmdUserPerms = "None provided";
    }

    if (!cmdBotPerms) {
      cmdBotPerms = "None provided";
    } else if (cmdBotPerms === "") {
      cmdBotPerms = "None provided";
    }

    if (!cmdCoolown) {
      cmdCoolown = "None Provided";
    }

    if (slashCommand.cooldown) {
      cmdCoolown = slashCommand.cooldown / 1000
    }

    var cmdType = "Slash"

    if (slashCommand.type === 1) {
      cmdType = "Slash"
    } else {
      cmdType = "Message"
    }

    const infoMenu = new EmbedBuilder()
      .setTitle(`${slashCommand.name} info menu`)
      .addFields(
        { name: `Category`, value: `\`\`\`${slashCommand.category}\`\`\`` },
        { name: "Description", value: `\`\`\`${cmdDescription}\`\`\`` },
        { name: `Usage`, value: `\`\`\`${cmdUsage}\`\`\`` },
        {
          name: `UserPerms`,
          value: `\`\`\`${cmdUserPerms}\`\`\``,
        },
        {
          name: `BotPerms`,
          value: `\`\`\`${cmdBotPerms}\`\`\``,
        },
        {
          name: `Owner Only`,
          value: `\`\`\`${slashCommand.ownerOnly}\`\`\``,
        },
        {
          name: `Cooldown`,
          value: `\`\`\`${cmdCoolown} Seconds\`\`\``,
        }
      )
      .setDescription(
        `Fun Commands: **Rate**\nInfo Commands: **Help, Ping**\nModeration Commands: **Ban, Kick, Role, Loggings, Nickname**`
      )
      .setImage(imageTut)
      .setThumbnail(client.user.displayAvatarURL({dynamic: true}))
      .setFooter({text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({dynamic: true})})
      .setColor(`White`);

    return interaction.reply({ embeds: [infoMenu] });
  },
};
