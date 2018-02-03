var Discord = require('discord.io');
var logger = require('winston');
var auth = require('../json/auth.json');
var idk = "I don't know what you're trying to do, but use $help to see what I am capable of.";
var helpMessage = "```Commands\n" 
				+ "$help          | Displays a list of commands.\n" 
				+ "$echo [string] | Will message back what ever string you provided.\n" 
				+ "$roll [XdY]    | Roll a dice where X is the number of times you want to roll the dice " 
				+ "and Y is the number of sides the dice has.```";

				
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
	bot.setPresence( { "game" : { "name": "$help"} } );
});

bot.on('message', function(user, userId, channelId, message, evnt) {
	//Listen for messages that start with $
	if (message.substring(0,1) == '$' && ((channelId == "406231410047975424") || (channelId == "345347162420281357"))) {
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
			
			case 'help':
				bot.sendMessage({
					to: channelId,
					message: helpMessage
				});
			break;
			
			case 'echo': 
				var message = args[0];
				if (args.length > 1) {
					for (i = 1; i < args.length; i++) {
						message += ' ' + args[i];
					}
				}
				bot.sendMessage({
					to: channelId,
					message: message
				});
			break;
			
			case 'roll': 
				var incomplete  = "The command passed was incorrect. Needs to be $roll [XdY].";
				var rollMessage = "Please pick a integer less than 21";
				var diceMessage = "Please choose either a 4, 6, 8, 10, 12, or 20 sided die.";
				var diceArgs = args[0].substring(0).split('d');
				
				//Check to see if the args are even correct
				if (diceArgs.length == 2) {
					//Check if the provided number of rolls is good
					if ((diceArgs[0] == parseInt(diceArgs[0], 10)) && (diceArgs[0] < 21)) {
						var numberOfRolls = diceArgs[0];
					} else {
						bot.sendMessage({
							to: channelId,
							message: rollMessage
						});
						break;
					}
					
					//Check if the number of sides is good
					if (diceArgs[1] == parseInt(diceArgs[1], 10)) {
						//var numberOfSides = diceArgs[1];
						if ((diceArgs[1] == 4) || (diceArgs[1] == 6) || (diceArgs[1] == 8) || (diceArgs[1] == 10) || 
							(diceArgs[1] == 12) || (diceArgs[1] == 20)) {
								
							var numberOfSides = diceArgs[1];
						} else {
							bot.sendMessage({
								to: channelId,
								message: diceMessage
							});
							break;
						}
					} else {
						bot.sendMessage({
							to: channelId,
							message: diceMessage
						});
						break;
					}
					
					//Message to return
					var result = "```";
					
					//Do the actual rolling now
					for (i = 0; i < numberOfRolls; i++) {
						result += "Roll " + (i+1) + ": " + Math.floor((Math.random() * numberOfSides) + 1) + "\n";
					}
					
					result += "```";
					
					bot.sendMessage({
						to: channelId,
						message: result
					})
				} else {
					bot.sendMessage({
						to: channelId,
						message: incomplete
					});
					break;
				}
			break;
			
			default:
				bot.sendMessage({
					to: channelId,
					message: idk
				});
		}
	}
});