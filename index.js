const Discord = require('discord.js');
const client = new Discord.Client();
const creds = require('./credentials.json');

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
  command = message.content.split(' ');
  if (!message.content.startsWith('!')) return;
  try {
    switch (command[0]) {
      case '!help':
        message.channel.send('Rien d\'intéressant ici pour l\'instant.');
        break;
      case '!activity':
        activity(message, command);
        break;
      case '!note':
        note(message, command);
        break;
      case '!clear':
        clear(message, command);
        break;
    }
  } catch(error) {
    console.error(error);
  }
});

function activity(message, command) {
  if (message.author.id === creds.ownerid) {
    var text = message.content.substring(command[0].length + 1);
    client.user.setActivity(text, { type: 'PLAYING' })
      .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
      .catch(console.error);
  }
}

function note(message, command) {
  var mention = message.mentions.members.first();
  var name = '';
  if (mention !== undefined) {
    name = (mention.nickname)
      ? mention.nickname
      : mention.user.username;
  } else {
    name = (message.member.nickname)
      ? message.member.nickname
      : message.member.user.username;
  }

  if (message.author.id === creds.ownerid && mention === undefined) {
    message.channel.send('TheOct0 est tout simplement l\'homme le plus beau du monde.');
  } else {
    var hash = 0, i, chr;
    for (i = 0; i < name.length; i++) {
      chr   = name.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    var percentage = hash % 100;
    message.channel.send(name + ' me plaît à ' + percentage + '%.');
  }
}

async function clear(message, command) {
  if (command[1] === 'vrai' || command[1] === 'faux') {
    command[2] = command[1];
  }
  try {
    if (command[1] === null) {
      const msgs = await message.channel.messages.fetch();
      message.channel.bulkDelete(msgs, command[2]);
    } else {
      const msgs = await message.channel.messages.fetch({ limit: command[1] });
      message.channel.bulkDelete(msgs, command[2]);
    }
  } catch (error) {
    if (error.code == 50035) {
      message.channel.send('Cette commande s\'utilise de cette manière:\n' +
        '`!clear [nombre] [ancienneté]`\n' +
        '- `nombre` est un entier positif inférieur à 100, qui indique combien de messages supprimer. Par défaut, cette valeur est 50.\n' +
        '- `ancienneté` est `vrai` ou `faux`, et indique si les messages de plus de deux semaines doivent être supprimés.');
    }
  }
}

client.login(creds.token);
