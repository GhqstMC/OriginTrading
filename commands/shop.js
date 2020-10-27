const Discord = require('discord.js');

const shopEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Today\'s shop')
  .setDescription('React with the type of pack you would like to buy. This message will expire in 30 seconds.')
	.addFields(
		{ name: '<:iron:770301559422582834> Silver 5-pack', value: '$25', inline: true },
    { name: '<:iron2:770303397970575371> Silver 10-pack', value: '$45', inline: true },
    { name: '<:iron3:770303398083035147> Silver 25-pack', value: '$115', inline: true },
    { name: '<:gold:770301559183376397> Gold 5-pack', value: '$75', inline: true },
    { name: '<:gold2:770303817060712498> Gold 10-pack', value: '$145', inline: true },
    { name: '<:gold3:770303817098461214> Gold 25-pack', value: '$360', inline: true }
	);
const shopEmbedExpired = new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle('Today\'s shop')
  .setDescription('This message has expired. Please re-enter !shop.');

module.exports = {
	name: 'shop',
	description: 'Opens the shop where you can buy packs!',
  aliases: ['store'],
  guildOnly: true,
	execute(message, args) {
		message.channel.send(shopEmbed).then(msg => {
      msg.react('770301559422582834')
        .then(() => msg.react('770303397970575371'))
        .then(() => msg.react('770303398083035147'))
        .then(() => msg.react('770301559183376397'))
        .then(() => msg.react('770303817060712498'))
			  .then(() => msg.react('770303817098461214'))
        .then(() => {
          const filter = (reaction, user) => {
            return reaction.emoji.name.startsWith('iron') || reaction.emoji.name.startsWith('gold');
          };

          const collector = msg.createReactionCollector(filter, { time: 30000 });

          collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
            try {
              for (const reaction of userReactions.values()) {
                reaction.users.remove(user.id);
              }
            } catch (error) {
              console.error('Failed to remove reactions.');
            }
          });

          collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
            msg.edit(shopEmbedExpired)
          });
        })
        .catch(() => console.error('One of the emojis failed to react.'));
    });
	}
};

