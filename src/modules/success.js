module.exports = (client) => {
  client.success = async (interaction, suc, msg, followUp = false, ephemeral = false) => {
    const options = { content: `${client.emoji.checkMark} **${suc}**\n${msg}`, ephemeral };
    if (interaction.replied) {
      if (followUp) {
        await interaction.followUp(options);
      } else {
        await interaction.editReply(options);
      }
    } else {
      await interaction.reply(options);
    }
  };
};
