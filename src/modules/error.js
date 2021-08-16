module.exports = (client) => {
  client.error = async (interaction, err, msg, followUp = false, ephemeral = false) => {
    const options = { content: `${client.emoji.redX} **${err}**\n${msg}`, ephemeral };
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
