var Discord = require('discord.io');
var logger = require('winston');
var auth = require('../json/auth.json');

//configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});
logger.level = 'debug';

// Initialize discord bot
var bot = new Discord.Client({
	token: auth.token,
	autorun: true
});

bot.on('disconnect', function(errMsg, errCode) {
	logger.info(errMsg + ' - ' + errCode);
});

bot.on('ready', function(evnt) {
	logger.info('Connected');
	logger.info('Logged in as: ');
	logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function(user, userId, channelId, message, evnt) {
	//Listen for messages that start with $
	if (message.substring(0,1) == '$') {
		var args = message.substring(1).split(' ');
		var cmd = args[0];
		
		args = args.splice(1);
		
		//Do the fancy stuff here
		switch(cmd) {
			//$ping
			case 'ping':
				logger.info('Channel ID: ' + channelId);
				bot.sendMessage({
					to: channelId,
					message: 'Pong!'
				});
			break;
			
			case 'echo': 
				bot.sendMessage({
					to: channelId,
					message: args
				});
			break;
		}
	}
});