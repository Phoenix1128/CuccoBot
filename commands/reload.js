const config = require('../config');

module.exports.data = {
  name: 'reload',
  description: 'Reloads a command.',
  defaultPermission: false,
  options: [
    {
      name: 'command',
      type: 'STRING',
      description: 'The command to reload.',
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

/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
module.exports.run = async (client, interaction) => {
  const command = client.slashCommands.get(interaction.options.getString('command'));

  delete require.cache[require.resolve(`./${command.data.name}.js`)];

  const props = require(`./${command.data.name}`);
  client.slashCommands.set(command.data.name, props);

  const slashCommand = await client.guilds.cache.get(config.mainGuild).commands.create(props.data);
  await slashCommand.permissions.add(props.conf);

  console.log(`${command.data.name} command was reloaded!`);
  return client.success(interaction, 'Success!', `Successfully reloaded command \`${command.data.name}\`!`);
};
