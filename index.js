/**
 * A Bot for Slack!
 */


/**
 * Define a function for initiating a conversation on installation
 * With custom integrations, we don't have a way to find out who installed us, so we can't message them :(
 */

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}


/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) {
    var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});

controller.hears(
   ['hello', 'hi', 'greetings'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Hello!');
   }
);

controller.hears(
   ['Who is Takk?','takk','takk?'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'https://www.compass.com/agents/nyc/takk-yamaguchi/');
   }
);

controller.hears(
   ['Who is Amy?','takata'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'agent ops');
   }
);

controller.hears(
   ['Who is Pat Sherbo?','pat','Sherbo?'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Agent Ops & Listings Manager, pat@compass.com, 503.381.9069');
   }
);

controller.hears(
   ['Who is Maria Munoz?','maria?','munoz?','munoz'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Agent Ops Associate, maria@compass.com, 646.428.4054');
   }
);

controller.hears(
   ['Who is Reenie Mosher?','reenie','reenie?'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Agent Ops Senior Associate, reenie@compass.com, 518.573.7482');
   }
);

controller.hears(
   ['Who is Jenny Rodarte?','jenny','jennifer?'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Agent Ops Associate, jenny@compass.com, 646.306.3150');
   }
);

controller.hears(
   ['Who is Gordon Golub?','Gordon','Gordon Golub'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Senior Managing Director, gordon@compass.com, 917.716.9690');
   }
);

controller.hears(
   ['Who is Rob Reffkin?','Rob','Reffkin'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'CEO, rob@compass.com, 917.841.5555');
   }
);

controller.hears(
   ['OH Link','OH','Open House Link', 'Open House App'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Here is the link to the OH App: https://rink.hockeyapp.net/apps/f09fa58e28d147d2adbac994df64d9bb. Please remember to go to Settings>General>Profile or Device Management to Trust the App');
   }
);

controller.hears(
   ['Marketing Reimbursement','Reimbursement form','reimbursement form?', 'how can an agent submit a reimbursement?'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'In order to obtain a marketing reimbursement for vendors not set up to be direct billed, please submit this form on the navigation center. http://navigate.compass.com/hc/en-us/articles/214217477-Request-Marketing-Reimbursement');
   }
);

controller.hears(
   ['vendors','approved vendors','what are our approved vendors?', 'who are our vendors?'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'https://docs.google.com/spreadsheets/d/1U9HGNgn0g3AjXlFoOGeXzokTX8ghfnaTgvt9vUuETc4/edit#gid=0');
   }
);

controller.hears(
   ['pitch book','how can an agent get pitch book?','where are the pitch books?', 'who is Lorinna?'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'In order to receive a pitch book, please submit a pitch request form. Lorinna on 5 will have them. http://navigate.compass.com/hc/en-us/articles/212726217-Getting-Started-Submit-a-Pitch-Request');
   }
);

controller.hears(
   ['offering plan library','do we have offering plans?','offering', 'OP'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'http://navigate.compass.com/hc/en-us/articles/218494377-Offering-Plan-Library-');
   }
);

controller.hears(
   ['who does not have facebook?','Sherbo and Facebook','Pat does not have Facebook', 'Pat and Facebook'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Pat - He does not believe in social media.');
    } 
);

controller.hears(
   ['help'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Hi there! I am the Agent Ops BotWOMAN - here to help you, anytime, anywhere! I can help you with any questions regarding our Agent Suite, Agent Resources or general operations questions you might have during onboardinging or after. You can also ask me for life advice. Have a great day!');

}
);

controller.hears(
   ['how do I create avery labels?','avery labels', 'avery'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Create an XLS sheet with contacts. Keep this as Name, Address or Unit number, City, State and Zip. Save your Excel list and Open up Microsoft Word. Choose labels from the template options and hit enter.');
}
);

controller.hears(
   ['Compass License Number', 'Compass NYC license', 'Compass License in NYC', 'License NYC','License in New York', 'Compass License'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'10311205781');
}
);

controller.hears(
   ['Moo cards','agent business cards','business cards', 'business card reorders','moo cards'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'All agents are able to re-order their business cards on their own. Only the first 200 are covered by Compass, the rest can be ordered from their Moo accounts. Please check in the People section in Moo if the agent has been added and if not, add as a restricted employee and attach the desired pack. If you do not have a Moo account, ask Agent Ops to create one for you');
    }
); 
controller.hears(
   ['Agent Business Center','business center','what is a business center?','agent business center'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'The agent will have the business center in their Shared with Me section on Google Drive. If the agent does not have this information, please email closings@compass.com');
    } 
);
controller.hears(
   ['OLR account','olr account login','olr log in information','what is olr?','OLR'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'OLR is a New York City database for sales listings and rentals. Our log in information is username - RO75159 and password - RE71180');
    } 
);

controller.hears(
   ['Who is Chris Ramirez?','Chris Ramirez','Chris','IT Chris'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'IT Associate, cramirez@compass.com, 504.289.8752. See his Honey profile here: https://honey.is/home/#user/31705');
   } 
);

controller.hears(
   ['Who is Lauren Jones?', 'Lauren Jones', 'Who is Lauren from IT?', 'Lauren IT','Lauren Jones from IT', 'Lauren/IT', 'Jones, Lauren'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'IT Associate, lauren.jones@compass.com, 919.605.7209. See her Honey profile here: https://honey.is/home/#user/38991/profile');
}
);

controller.hears(
   ['Who is Paul Parker?', 'Paul Parker', 'Paul from IT', 'Paul Parker IT','Paul Parker/IT', 'Paul Parker in IT'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Director of Information Technology, paul.parker@compass.com, 516.205.6519. See his Honey profile here: https://honey.is/home/#user/37828/profile');
}
);

controller.hears(
   ['who is Cam?','who is Cam McCallie?','Cameron','cam','who is cam?','who is cam','who is cam?'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Best software engineer! Cam loves cats, speaks Japanese and can cook sushi - woah! Very competitive, runs marathons and races. He is always hungry, eats leftovers! See his Honey profile here: https://honey.is/home/#user/32561');
   } 
);

controller.hears(
   ['mailchimp','How do I create a list on mailchimp?','lists and mailchimp','mailchimp lists?','lists', 'create a list mailchimp', 'mailchimp contacts list', 'mailchimp contacts'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,' To create a list on MailChimp you click in Lists, then create new list, then add subscribers. You can add subscribers by importing them from Google Drive or Google Contacts or simply uploading a CSV or XLS file. Once the list is created, you can use it to send campaigns. NOTE: If the agent has over 2k contacts, MailChimp will not be free anymore. For more information on pricing, click here: http://mailchimp.com/pricing/');
   }
);

controller.hears(
   ['Who is Jenny Rodarte?','jenny','jennifer?'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Agent Ops Associate, jenny@compass.com, 646.306.3150');
   }
);
   
controller.hears(
   ['new agent','new agent hire form','new agent hire form?','what is the new agent form?'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'http://bit.ly/295vu0G');
   }
);

controller.hears(
   ['How do I create a campaign on mailchimp?','campaign in mailchimp?','how do you create a campaign?','MailChimp campaign','mailchimp campaign'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'To create a campaign on MailChimp, go to templates and select Create Campaign in dropdown menu and choose the list to whom you want to send campaign to.');
   }
);

controller.hears(
   ['Agent Master List','master list','agent master list','agent master','all agents'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'https://docs.google.com/spreadsheets/d/1s9GHXJ_w5V0qG5IbmIUOMfH8xgrLkRYD0gd0b8otJjI/edit?ts=571907fd#gid=0');
   }
);

controller.hears(
   ['Who is Victoria Shtainer?','victoria shtainer','Victoria Shtainer?','Victoria Agent','Victoria S'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Victoria is an agent at Lever House. She joined us on 5/26/2015 and is the team lead of the Victoria Shtainer Team. Her birthday is November 1st. Find her in our Compass site: https://www.compass.com/agents/nyc/victoria-shtainer/');
   }
);

controller.hears(
   ['Who is Kim Soule?','kim soule','kim soule?'],
   ['direct_mention', 'mention', 'direct_message'],
   function(bot,message) {
       bot.reply(message,'Kim is an agent at 90 5th. She joined us on 6/16/2016. Find her in our Compass site: https://www.compass.com/agents/nyc/kim-soule/');
   }
);




/* END */

/**
 * AN example of what could be:
 * Any un-handled direct mention gets a reaction and a pat response!
 */
//controller.on('direct_message,mention,direct_mention', function (bot, message) {
//    bot.api.reactions.add({
//        timestamp: message.ts,
//        channel: message.channel,
//        name: 'robot_face',
//    }, function (err) {
//        if (err) {
//            console.log(err)
//        }
//        bot.reply(message, 'I heard you loud and clear boss.');
//    });
//});
