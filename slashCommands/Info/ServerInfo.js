const {
    EmbedBuilder,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    ButtonBuilder,
  } = require("discord.js");
  

module.exports = {
	name: 'serverinfo',
	usage: `/serverinfo`,
	category: `Info`,
	description: "Check bot's serverinfo.",
	type: ApplicationCommandType.ChatInput,
	cooldown: 3000,
	run: async (client, interaction) => {
	
	}
};