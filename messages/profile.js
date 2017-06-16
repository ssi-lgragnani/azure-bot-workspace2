var builder = require('botbuilder');    

module.exports = [
    function (session, args, next) {
        session.dialogData.profile = args || {};
        if (!session.dialogData.profile.name) {
            builder.Prompts.text(session, "What's your name?");
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.profile.name = results.response;
        }
        if (!session.dialogData.profile.email) {
            builder.Prompts.text(session, "what is your email?");
        } else {
            next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.profile.email = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
];