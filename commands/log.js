const config = require('../config');

module.exports.data = {
  name: 'log',
  description: "Pull a user's heart log.",
  defaultPermission: false,
  options: [
    {
      name: 'member',
      type: 'USER',
      description: 'The member you want to pull data for. Accepts a user id or a mention.',
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
  const member = interaction.options.getMember('member', true);
  const { infractions } = client.userDB.ensure(member.id, config.userDBDefaults);
  let msg = `__**${member.user.tag}'s Heart Log**__`;
  let expDamage = 0;
  let expMsg = '';
  let curDamage = 0;
  let curMsg = '';

  infractions.forEach((i) => {
    const moderator = client.users.cache.get(i.moderator);
    const caseStr = `\n• Case ${i.case} - ${moderator ? `Mod: ${moderator.tag}` : `Unknown Mod ID: ${i.moderator || 'No ID Stored'}`} - **${i.damage} heart damage** (<t:${Math.floor(new Date(i.date).getTime() / 1000)}>)\n> Reason: ${i.reason}`;
    if (client.checkValidDamage(i)) {
      curDamage += i.damage;
      curMsg += caseStr;
    } else {
      expDamage += i.damage;
      expMsg += caseStr;
    }
  });

  msg += `\nRemaining Hearts: **${3 - curDamage} hearts**\n`;

  if (curMsg) {
    msg += `\n**Current Damage (${curDamage} total):**${curMsg}`;
  }
  if (expMsg) {
    msg += `\n**Expired Damage (${expDamage} total):**${expMsg}`;
  }

  if (curMsg || expMsg) {
    client.sendLongMessage(interaction, msg);
  } else {
    // No infractions
    client.error(interaction, 'No Heart Damage Found!', `**${member.user.tag}** hasn't been inflicted with any damage! They have **3 hearts**!`);
  }
};
