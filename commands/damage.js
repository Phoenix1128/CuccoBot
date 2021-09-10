const Discord = require('discord.js');
const config = require('../config');

module.exports.data = {
  name: 'damage',
  description: 'Inflict damage (infractions) on a member.',
  defaultPermission: false,
  options: [
    {
      name: 'member',
      type: 'USER',
      description: 'The member you want to inflict damage on. Accepts a user id or a mention.',
      required: true,
    },
    {
      name: 'amount',
      type: 'NUMBER',
      description: 'The amount of damage to inflict on a member.',
      required: true,
      choices: [
        {
          name: '0 Heart Damage',
          value: 0,
        },
        {
          name: '1/4 Heart Damage',
          value: 0.25,
        },
        {
          name: '1/2 Heart Damage',
          value: 0.5,
        },
        {
          name: '1 Heart Damage',
          value: 1,
        },
        {
          name: '3 Heart Damage',
          value: 3,
        },
      ],
    },
    {
      name: 'reason',
      type: 'STRING',
      description: 'The reason to inflict damage on this member.',
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
  const newDamage = interaction.options.getNumber('amount', true);
  const reason = interaction.options.getString('reason', true);

  let curDamage = 0;
  const time = Date.now();
  client.userDB.ensure(member.id, config.userDBDefaults).infractions.forEach((i) => {
    if (client.checkValidDamage(i)) {
      curDamage += i.damage;
    }
  });

  let dmMsg;
  let action;
  let mute = 0;
  let ban = false;
  if (newDamage === 0) {
    // Make a note
    action = 'Note';
  } else if (newDamage + curDamage >= 3) {
    // Ban
    dmMsg = `You have been banned from the r/Zelda server for the following reason:
**${reason}**
You have lost **${newDamage} heart${newDamage === 1 ? '' : 's'}**. You now have **0 remaining hearts**.`;
    action = 'Ban';
    ban = true;
  } else if (curDamage < 2.5 && newDamage + curDamage >= 2.5) {
    // Mute 48 hours
    dmMsg = `You have been temporarily muted for **48 hours** in the r/Zelda server for the following reason:
**${reason}**
You have lost **${newDamage} heart${newDamage === 1 ? '' : 's'}**. You now have **${3 - (newDamage + curDamage)} remaining hearts**.
For more information about your mute, please read #rules (<#431541621893627914>) and #muted (<#872554270036226098>).`;
    action = '48 Hour Mute';
    mute = 2880;
  } else if (curDamage < 2 && newDamage + curDamage >= 2) {
    // Mute 24 hours
    dmMsg = `You have been temporarily muted for **24 hours** in the r/Zelda server for the following reason:
**${reason}**
You have lost **${newDamage} heart${newDamage === 1 ? '' : 's'}**. You now have **${3 - (newDamage + curDamage)} remaining hearts**.
For more information about your mute, please read #rules (<#431541621893627914>) and #muted (<#872554270036226098>).`;
    action = '24 Hour Mute';
    mute = 1440;
  } else if (curDamage < 1.5 && newDamage + curDamage >= 1.5) {
    // Mute 12 hours
    dmMsg = `You have been temporarily muted for **12 hours** in the r/Zelda server for the following reason:
**${reason}**
You have lost **${newDamage} heart${newDamage === 1 ? '' : 's'}**. You now have **${3 - (newDamage + curDamage)} remaining hearts**.
For more information about your mute, please read #rules (<#431541621893627914>) and #muted (<#872554270036226098>).`;
    action = '12 Hour Mute';
    mute = 720;
  } else if (curDamage < 1 && newDamage + curDamage >= 1) {
    // Mute 4 hours
    dmMsg = `You have been temporarily muted for **4 hours** in the r/Zelda server for the following reason:
**${reason}**
You have lost **${newDamage} heart${newDamage === 1 ? '' : 's'}**. You now have **${3 - (newDamage + curDamage)} remaining hearts**.
For more information about your mute, please read #rules (<#431541621893627914>) and #muted (<#872554270036226098>).`;
    action = '4 Hour Mute';
    mute = 240;
  } else if (curDamage < 0.5 && newDamage + curDamage >= 0.5) {
    // Mute 20 minutes
    dmMsg = `You have been temporarily muted for **20 minutes** in the r/Zelda server for the following reason:
**${reason}**
You have lost **${newDamage} heart${newDamage === 1 ? '' : 's'}**. You now have **${3 - (newDamage + curDamage)} remaining hearts**.
For more information about your mute, please read #rules (<#431541621893627914>) and #muted (<#872554270036226098>).`;
    action = '20 Minute Mute';
    mute = 20;
  } else {
    if (client.userDB.get(member.id).infractions.length === 0) {
      dmMsg = `Hey, I'm CuccoBot and I'm just flying in to let you know you broke a server rule.

**${reason}**

Please don't break the rulesd as each time you do, it hurts me. If you hurt me again, next time I might not be so nice. Take a look at the #rules (<#431541621893627914>) to see what hurts me!`;
      action = 'Soft Warn';
    } else {
    // Give warning
    dmMsg = `You have been warned in the r/Zelda server for the following reason:
**${reason}**
You have lost **${newDamage} heart${newDamage === 1 ? '' : 's'}**. You now have **${3 - (newDamage + curDamage)} remaining hearts**.
Don't worry, 1/4 heart damage is just a warning and will expire in **1 week**.
For more information about your warn, please read #rules (<#431541621893627914>).`;
    action = 'Warn';
    }
  }

  let dmSent = false;
  if (newDamage > 0) {
    // Try to send DM
    try {
      const dmChannel = await member.createDM();
      await dmChannel.send(dmMsg);
      dmSent = true;
    } catch (e) {
      // Nothing to do here
    }
  }

  // Create infraction in the infractionDB to get case number
  const caseNum = client.infractionDB.autonum;
  client.infractionDB.set(caseNum.toString(), member.id);

  // Create infraction in the userDB to store important information
  client.userDB.push(member.id, {
    case: caseNum,
    action,
    damage: newDamage,
    reason,
    moderator: interaction.user.id,
    dmSent,
    date: time,
  }, 'infractions', true);

  // Perform the required action
  if (ban) {
    await client.guilds.cache.get(client.config.mainGuild).members.ban(member, { reason: '[Auto] Heart Damage' }).catch((err) => {
      client.error(interaction, 'Ban Failed!', `I've failed to ban this member (${member.id})! ${err}`);
    });
  } else if (mute) {
    try {
      // Update unmuteTime on userDB
      client.muteDB.set(member.id, (mute * 60000) + time);
      const guildMember = await client.guilds.cache.get(client.config.mainGuild).members.fetch(member);
      const mutedMember = await guildMember.roles.add(client.config.mutedRole, '[Auto] Heart Damage');

      // Kick member from voice
      if (guildMember.voice.channel) {
        guildMember.voice.kick();
      }

      // Schedule unmute
      setTimeout(() => {
        if ((client.muteDB.get(member.id) || 0) < Date.now()) {
          client.muteDB.delete(member.id);
          mutedMember.roles.remove(client.config.mutedRole, `Scheduled unmute after ${mute} minutes.`).catch((err) => {
            client.channels.cache.get(config.modLog).send(`${client.emoji.redX} **Unmute Failed!**\nI've failed to unmute this member! ${err}\nID: ${member.id}`);
          });
        }
      }, mute * 60000);
    } catch (err) {
      await client.error(interaction, 'Mute Failed!', `I've failed to mute this member! ${err}`);
    }
  }

  // Notify in channel
  await client.success(interaction, 'Damage Inflicted!', `**${member.user.tag || member}** has lost **${newDamage} heart${newDamage === 1 ? '' : 's'}**!`, true);

  // Send mod-log embed
  const embed = new Discord.MessageEmbed()
    .setAuthor(`Case ${caseNum} | ${action} | ${member.guild ? member.user.tag : member.tag || member}`, member.guild ? member.user.displayAvatarURL() : member.displayAvatarURL())
    .setColor((mute || ban) ? '#ff9292' : '#fada5e')
    .setDescription(`Reason: ${reason}`)
    .addField('User', `<@${member.id}>`, true)
    .addField('Moderator', `<@${interaction.user.id}>`, true)
    .addField('Damage Inflicted', `${newDamage} heart${newDamage === 1 ? '' : 's'}`, true)
    .addField('DM Sent?', dmSent ? `${client.emoji.checkMark} Yes` : `${client.emoji.redX} No`, true)
    .addField('Remaining Hearts', `${3 - (curDamage + newDamage)} hearts`, true)
    .setFooter(`ID: ${member.id}`)
    .setTimestamp();
  return client.channels.cache.get(client.config.modLog).send({ embeds: [embed] });
};
