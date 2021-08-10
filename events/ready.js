module.exports = async (client) => {
  const mainGuild = client.guilds.cache.get(client.config.mainGuild);

  if (!client.application.owner) {
    await client.application.fetch();
  }

  const slashCommandsArr = client.slashCommands.keyArray();
  client.asyncForEach(slashCommandsArr, async (command) => {
    const cmd = client.slashCommands.get(command);
    console.log(`Loading command: ${cmd.data.name}`);
    const slashCommand = await mainGuild.commands.create(cmd.data);
    await slashCommand.permissions.add(cmd.conf);
  });

  setInterval(() => {
    try {
      client.user.setActivity(`BOTW2 with ${mainGuild.memberCount} users!`);
    } catch (e) {
      // Don't need any handling
    }
  }, 30000);

  // Reschedule any unmutes from muteDB
  const now = Date.now();
  client.muteDB.keyArray().forEach((memID) => {
    const unmuteTime = client.muteDB.get(memID);
    mainGuild.members.fetch(memID).then((member) => {
      if (unmuteTime < now) {
        // Immediately unmute
        client.muteDB.delete(memID);
        member.roles.remove(client.config.mutedRole, 'Scheduled unmute through reboot.');
      } else {
        // Schedule unmute
        setTimeout(() => {
          if ((client.muteDB.get(memID) || 0) < Date.now()) {
            client.muteDB.delete(memID);
            member.roles.remove(client.config.mutedRole, 'Scheduled unmute through reboot.');
          }
        }, unmuteTime - now);
      }
    }).catch(() => {
      // Probably no longer a member, don't schedule their unmute and remove entry from DB.
      client.muteDB.delete(memID);
    });
  });

  // Logging a ready message on first boot
  console.log(`Ready sequence finished, with ${mainGuild.memberCount} user(s), in ${mainGuild.channels.cache.size} channel(s) of ${client.guilds.cache.size} guild(s).`);
};
