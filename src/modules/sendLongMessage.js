const { Util } = require('discord.js');

module.exports = (client) => {
  client.sendLongMessage = (channel, message, options = {}) => {
    const splitMsg = Util.splitMessage(message);
    client.asyncForEach(splitMsg, async (msgToSend) => {
      await channel.send(msgToSend, options);
    });
  };
};
