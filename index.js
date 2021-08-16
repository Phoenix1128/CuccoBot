/* eslint-disable consistent-return */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const { Searcher } = require('fast-fuzzy');
const config = require('./config');
const emoji = require('./src/emoji');

const client = new Discord.Client({
  makeCache: Discord.Options.cacheWithLimits({
    MessageManager: 100,
  }),
  allowedMentions: {
    parse: ['users', 'roles'],
    repliedUser: true,
  },
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
  ],
});
client.config = config;
client.emoji = emoji;

fs.readdir('./src/modules/', (err, files) => {
  if (err) {
    return console.error(err);
  }

  files.forEach((file) => {
    require(`./src/modules/${file}`)(client);
  });
});

fs.readdir('./events/', (err, files) => {
  if (err) {
    return console.error(err);
  }
  return files.forEach((file) => {
    const event = require(`./events/${file}`);
    client.on(file.split('.')[0], event.bind(null, client));
  });
});

client.slashCommands = new Enmap();

fs.readdir('./commands/', (err, files) => {
  if (err) {
    return console.error(err);
  }

  // Looping over all files to load all commands
  files.forEach((file) => {
    if (!file.endsWith('.js')) {
      return;
    }

    const props = require(`./commands/${file}`);
    const commandName = file.split('.')[0];

    console.log(`Reading command: ${commandName}`);
    client.slashCommands.set(commandName, props);
  });
});

Object.assign(client, Enmap.multi(['muteDB', 'bannedWordsDB'], { ensureProps: true }));
Object.assign(client, Enmap.multi(['userDB', 'infractionDB'], { fetchAll: false, ensureProps: true }));

// Banned words array and Searcher
const bannedWordsArray = client.bannedWordsDB.array();
client.bannedWordsFilter = new Searcher(bannedWordsArray, {
  keySelector: (s) => s.word, threshold: 1, returnMatchData: true, useSellers: false, ignoreSymbols: false,
});

client.login(config.token).then(() => {
  console.log('Bot successfully logged in.');
}).catch(() => {
  console.log('Retrying client.login()...');
  let counter = 1;
  const interval = setInterval(() => {
    console.log(`  Retrying attempt ${counter}`);
    counter += 1;
    client.login(config.token).then(() => {
      console.log('  Bot successfully logged in.');
      clearInterval(interval);
    });
  }, 30000);
});
