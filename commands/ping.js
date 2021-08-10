const config = require('../config');

module.exports.data = {
  name: 'ping',
  description: 'Pings the client.',
  defaultPermission: false,
};

module.exports.conf = {
  permissions: [
    {
      id: config.ownerID,
      type: 'USER',
      permission: true,
    },
  ],
};

module.exports.run = async (client, interaction) => {
  // Pings client... noting else I can say here
  const m = await interaction.reply('Pinging the Client...');
  interaction.editReply(`Pong! Latency: **${m.createdTimestamp - interaction.createdTimestamp}ms** \nAPI Latency: **${Math.round(client.ws.ping)}ms**`);
};
