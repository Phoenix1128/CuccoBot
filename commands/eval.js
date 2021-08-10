const config = require('../config');

module.exports.data = {
  name: 'eval',
  description: 'Executes the given JavaScript code.',
  defaultPermission: false,
  options: [
    {
      name: 'code',
      type: 'STRING',
      description: 'The code to execute.',
      required: true,
    },
  ],
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
  const code = interaction.options.getString('code', true);

  try {
    // eslint-disable-next-line no-eval
    const evaled = await eval(`(async () => {${code}})()`);
    const clean = await client.clean(client, evaled);

    client.success(interaction, 'Eval', `\`\`\`js\n${clean}\`\`\``);
  } catch (err) {
    const error = await client.clean(client, err);

    client.error(interaction, 'Eval', `\`\`\`xl\n${error.split('at', 3).join(' ')}\`\`\``);
  }
};
