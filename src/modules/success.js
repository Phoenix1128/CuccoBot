const { checkMark } = require('../emoji');

module.exports = (client) => {
  client.success = (interaction, suc, msg, ephemeral = false) => {
    if (interaction.replied) {
      interaction.editReply({ content: `${checkMark} **${suc}**\n${msg}`, ephemeral });
    } else {
      interaction.reply({ content: `${checkMark} **${suc}**\n${msg}`, ephemeral });
    }
  };
};
