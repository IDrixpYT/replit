const User = require("../../schemas/user");
const {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const mongoose = require("mongoose");
module.exports = {
  name: "balance",
  usage: `/balance`,
  category: `Info`,
  ownerOnly: true,
  description: "Check current balance.",
  type: ApplicationCommandType.ChatInput,
  cooldown: 3000,
  options: [
    {
      name: "user",
      description: "User's balance",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
  run: async (client, interaction) => {
    const member = interaction.options.get("user")?.user || interaction.user;
    let userProfile = await User.findOne({ userId: member.id });
    if (member.bot) {
      return interaction.reply({
        content: `Bot's dont't got that privilege, and so do black people.`,
      });
    }
    if (!userProfile && interaction.user.id != member.id) {
      return interaction.reply({
        content: `This user hasn't created a balance yet..`,
      });
    } else if (!userProfile) {
      userProfile = await new User({
        _id: mongoose.Types.ObjectId(),
        userId: member.id,
        bank: 0,
        wallet: 0,
      });
      await userProfile.save().catch(console.error);
      const newBalance = new EmbedBuilder()
        .setTitle(`${member.tag}'s Balance`)
        .setDescription(
          `Wallet: **${userProfile.wallet} SbCoins**\nBank: **${
            userProfile.bank
          } SbCoins**\nTotal: **${
            userProfile.wallet + userProfile.bank
          } SbCoins**`
        )
        .setTimestamp()
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setColor(`Green`);
      await interaction.reply({
        content: `I have created you a balance! Welcome to SB Currency!`,
        embeds: [newBalance],
      });
      console.log(userProfile);
    } else {
      const balanceEmbed = new EmbedBuilder()
        .setTitle(`${member.tag}'s Balance`)
        .setDescription(
          `**Wallet**: **${userProfile.wallet} SbCoins**\n**Bank**: **${
            userProfile.bank
          } SbCoins**\n**Total**: **${
            userProfile.wallet + userProfile.bank
          } SbCoins**`
        )
        .setTimestamp()
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setColor(`Green`);
      await interaction.reply({
        embeds: [balanceEmbed],
      });
      console.log(userProfile);
    }
  },
};
