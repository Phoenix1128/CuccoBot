/* eslint-disable eqeqeq */
const config = require('../config');

module.exports.data = {
  name: 'heal',
  description: 'Heal a member of heart damage (remove infraction).',
  defaultPermission: false,
  options: [
    {
      name: 'case',
      type: 'INTEGER',
      description: 'The case to heal.',
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
  const healCase = (caseNum) => {
    const userID = client.infractionDB.get(caseNum);
    // Remove the caseNum => userID entry in infractionDB
    client.infractionDB.delete(caseNum);
    // Remove the infraction from the user
    const infs = client.userDB.get(userID, 'infractions');
    const infRemoved = infs.filter((inf) => inf.case == caseNum)[0];
    client.userDB.set(userID, infs.filter((inf) => inf.case != caseNum), 'infractions');
    return { infRemoved, userID };
  };

  const num = interaction.options.getInteger('case').toString();

  if (!client.infractionDB.has(num)) {
    return client.error(interaction, 'Invalid Case Number!', 'Please provide a valid case number to heal!', true);
  }

  // Med the case
  const meddedCase = healCase(num);

  // Notify that the infraction was removed
  const user = await client.users.fetch(meddedCase.userID);
  return client.success(interaction, 'Damage Healed!', `**${user.tag}** was healed of **${meddedCase.infRemoved.damage} heart damage** from case number **${num}**!`);
};
