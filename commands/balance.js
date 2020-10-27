const db = require("../db.js");

module.exports = {
	name: 'balance',
	description: 'See your ruby balance.',
  cooldown: 5,
	execute(message, args) {

      try {
        const balance = db.get(`bal457729362750472192`).then(bal => {
            message.channel.send(`Your current balance is ${bal}`);
        });
      } catch(e) {
        db.set(`bal457729362750472192`, 0);
        message.channel.send(`Your current balance is 0`);
      }

	}
};