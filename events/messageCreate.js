module.exports = async (client, message) => {
  // Ignore all bots
  if (message.author.bot) {
    return;
  }

  if (message.guild && !message.member) {
    await message.guild.members.fetch(message.author);
  }

  // if (message.guild) {
  //   // Banned Words
  //   if (level[1] < 2) {
  //     const tokens = message.content.split(/ +/g);
  //     let ban = false;
  //     let del = false;
  //     let match;

  //     for (let index = 0; index < tokens.length; index++) {
  //       if (ban) {
  //         break;
  //       }
  //       const matches = client.bannedWordsFilter.search(tokens[index]);

  //       for (let mIndex = 0; mIndex < matches.length; mIndex++) {
  //         const chkMatch = client.bannedWordsDB.find((w) => w.word === matches[mIndex].original && w.phrase.join(' ') === matches[mIndex].item.phrase.join(' '));

  //         // Only check if we're not already deleting this message, or the matched word is an autoBan
  //         if (!del || chkMatch.autoBan) {
  //           let chkDel = false;
  //           let matchedPhrase = true;
  //           if (chkMatch.phrase.length !== 0) {
  //             if (chkMatch.phrase.length < (tokens.length - index)) {
  //               for (let i = 0; i < chkMatch.phrase.length; i++) {
  //                 if (tokens[index + (i + 1)].toLowerCase() !== chkMatch.phrase[i].toLowerCase()) {
  //                   matchedPhrase = false;
  //                   break;
  //                 }
  //               }
  //             } else {
  //               matchedPhrase = false;
  //             }
  //           }

  //           if (matchedPhrase) {
  //             if (chkMatch.blockedChannels && chkMatch.blockedChannels.length !== 0) {
  //               if (chkMatch.blockedChannels.includes(message.channel.id)) {
  //                 chkDel = true;
  //               }
  //             } else {
  //               chkDel = true;
  //             }
  //           }

  //           if (!del && chkDel) {
  //             // This is to save the first match that caused the message to get deleted or banned
  //             match = chkMatch;
  //             del = chkDel;
  //           }

  //           if (chkDel && chkMatch.autoBan) {
  //             match = chkMatch;
  //             ban = true;
  //             break; // Break on autoBan because we don't need to check for any other banned words.
  //           }
  //         }
  //       }
  //     }

  //     if (ban || del) {
  //       const embed = new Discord.MessageEmbed()
  //         .setAuthor(message.author.tag, message.author.displayAvatarURL())
  //         .setColor('#ff9292')
  //         .setFooter(`ID: ${message.author.id}`)
  //         .setTimestamp()
  //         .setDescription(`**Banned word sent by ${message.author} in ${message.channel}**\n${message.content.slice(0, 1800)}`);

  //       const modLogCh = client.channels.cache.get(client.config.modLog);

  //       message.delete()
  //         .catch((err) => client.error(modLogCh, 'Message Delete Failed!', `I've failed to delete a message containing a banned word from ${message.author}! ${err}`));

  //       if (ban) {
  //         message.guild.members.ban(message.author, { reason: '[Auto] Banned Word', days: 1 })
  //           .catch((err) => client.error(modLogCh, 'Ban Failed!', `I've failed to ban ${message.author}! ${err}`));
  //       }

  //       embed.addField('Match', match.phrase.length === 0 ? match.word : `${match.word} ${match.phrase.join(' ')}`, true)
  //         .addField('Action', ban ? 'Banned' : 'Deleted', true);

  //       modLogCh.send(embed);
  //       return;
  //     }
  //   }
};
