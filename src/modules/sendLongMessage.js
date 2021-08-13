const { Util } = require('discord.js');

module.exports = (client) => {
  client.sendLongMessage = (interaction, message) => {
    const splitMsg = Util.splitMessage(message);
    client.asyncForEach(splitMsg, async (msgToSend, index) => {
      if (index === 0) {
        await interaction.reply(msgToSend);
      } else {
        await interaction.followUp(msgToSend);
      }
    });
  };
};
