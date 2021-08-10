const { redX } = require('../emoji');

module.exports = (client) => {
  client.error = (interaction, err, msg, ephemeral = false) => {
    if (interaction.replied) {
      interaction.editReply({ content: `${redX} **${err}**\n${msg}`, ephemeral });
    } else {
      interaction.reply({ content: `${redX} **${err}**\n${msg}`, ephemeral });
    }
  };
};
