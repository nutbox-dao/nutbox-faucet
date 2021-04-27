var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client({
   token: auth.token,
autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
var redis = require('redis');
var client = redis.createClient(6379,'127.0.0.1');
client.on('connect', function() {
    console.log('connected');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    logger.info(user)
    logger.info(message)
    console.info(user)
    console.info(message)

    if (checkAddress(message)) {
        var addressKey = message + '_droped_today';
        console.info("address valid!!!")  
        client.exists(addressKey, function(err, reply) {
            if (reply === 1) {
                console.log('exists');
                bot.sendMessage({
                    to: channelID,
                    message: 'Sorry ' + user + ', you have obtained today. Please check it out tomorrow!!!'
                });
            } else {
                console.log('doesn\'t exist');
                // TODO invoke contract to mint or sth
                
                client.set(addressKey, 1);
                client.expire(addressKey, 24 * 60 * 60);
                bot.sendMessage({
                    to: channelID,
                    message: 'Congratulations to ' + user + ', you have obtained 100 test PNUTS!!!'
                });
                
            }

        });
        

    }
    // if (message.substring(0, 1) == 'Hello') {
    //     var args = message.substring(1).split(' ');
    //     var cmd = args[0];
       
    //     args = args.splice(1);
    //     switch(cmd) {
    //         // !ping
    //         case 'ping':
    //             bot.sendMessage({
    //                 to: channelID,
    //                 message: 'Morning! Not looking too shab-bee!'
    //             });
    //         break;
    //      }
    // }
});

var checkAddress = function(message) {
    var regex=/^[A-Za-z0-9_\-]+$/ig;
    return regex.test(message) && message.length == 34;
}