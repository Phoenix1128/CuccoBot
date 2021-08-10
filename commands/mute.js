const config = require('../config');

module.exports.data = {
  name: 'mute',
  description: 'Mute a user.',
  defaultPermission: false,
  options: [
    {
      name: 'member',
      type: 'USER',
      description: 'The member you want to mute. Accepts a user id or a mention.',
      required: true,
    },
  ],
};

module.exports.conf = {
  permissions: [
    {
      id: config.modRole,
      type: 'ROLE',
      permission: true,
    },
    {
      id: config.modTraineeRole,
      type: 'ROLE',
      permission: true,
    },
    {
      id: config.adminRole,
      type: 'ROLE',
      permission: true,
    },
  ],
};

module.exports.run = async (client, interaction) => {
  // Sets the member to the user mentioned
  const member = interaction.options.getMember('member', true);

  // Kick member if in voice
  if (member.voice.channel) {
    member.voice.kick();
  }

  try {
  // Adds the muted role to the member
    await member.roles.add(config.mutedRole);
  } catch (e) {
    return client.error(interaction, 'Error!', `Failed to mute member! Error: ${e}`);
  }

  return client.success(interaction, 'Success!', `${interaction.author.toString()}, I've successfully muted ${member.toString()}!`);
};
