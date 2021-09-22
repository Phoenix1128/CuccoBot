module.exports = (client) => {
  client.createHeartLog = (member) => {
    const { infractions } = client.userDB.ensure(member.id, client.config.userDBDefaults);
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
      return msg;
    }

    // No infractions
    return null;
  };
};
