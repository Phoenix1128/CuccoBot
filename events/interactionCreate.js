/* eslint-disable consistent-return */
module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  if (!interaction.member) {
    await client.guilds.cache.get(interaction.guildId).members.fetch(interaction.user.id);
  }

  await client.slashCommands.get(interaction.commandName).run(client, interaction);
};
