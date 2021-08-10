const config = require('../config');

module.exports.data = {
  name: 'reboot',
  description: 'Reboots the bot.',
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
  await interaction.reply('Rebooting bot! Please allow at least 10 seconds for the bot to fully reboot!');
  console.log('Bot rebooting...');
  process.exit(0);
};
