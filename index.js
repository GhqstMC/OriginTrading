const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const prefix = '!';


client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

client.once('ready', () => {
	console.log('Ready!');
  setInterval(function(){
    const random = Math.round(getRandomArbitrary(0, 3));
    switch(random) {
      case 0:
        client.user.setActivity('people play cards!', { type: 'WATCHING' });
        console.log("Switching activity to watching!");
      break;
      case 1:
        client.user.setActivity('Spotify!', { type: 'LISTENING' });
        console.log("Switching activity to listening!");
      break;
      case 2:
        client.user.setActivity('Dev Duels!', { type: 'COMPETING' });
        console.log("Switching activity to competing!");
      break;
      case 3:
        client.user.setActivity('Dev Duels!', { type: 'PLAYING' });
        console.log("Switching activity to playing!");
    }
  }, 20000);
});




client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

  if (command.guildOnly && message.channel.type === 'dm') {
	  return message.reply('I can\'t execute that command inside DMs!');
  }

  if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

  if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }

  
});
client.login(process.env.TOKEN);