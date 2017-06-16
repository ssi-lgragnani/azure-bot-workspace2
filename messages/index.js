/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
http://docs.botframework.com/builder/node/guides/understanding-natural-language/
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');
// var useEmulator = true;

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

bot.localePath(path.join(__dirname, './locale'));

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId || 'd9a7fcd9-32a2-4403-8c31-982f8870c77a';
var luisAPIKey = process.env.LuisAPIKey || '00dc3ef0820a49e99c7cab94b61d136a';
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

bot.dialog('/', [
    (session) => {
        var msg = new builder.Message(session)
            .text('Are you inquiring about a product? Interested in free spools for life?')
            .suggestedActions(
                builder.SuggestedActions.create(
                        session, [
                            builder.CardAction.imBack(session, 'Help with Product', 'Product Information'),
                            builder.CardAction.imBack(session, 'I want Free Spools', 'Free Spools')
                        ]
                    ));
        session.send(msg);
    }
]).triggerAction({ matches: 'start' })    

bot.dialog('productInfo', require('./productInfo')).triggerAction({ matches: 'productinfo' });
bot.dialog('freeSpools', require('./freeSpools')).triggerAction({ matches: 'freespools' });
bot.dialog('profile', require('./profile'));
bot.dialog('None', () => {
    bot.endConversation('It seems like you didn\'t want to do anything anyway...');
}).triggerAction({ matches: 'None' });

// bot.dialog('/', intents);    

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}

