var builder = require('botbuilder');    
    
module.exports = [
    (session) => {
        session.send('Welcome to the Free Spools for Life sign up!');
        if (!session.dialogData.profile) {
            session.send('It looks like you don\'t have an account with us... Please register');
            session.beginDialog('profile');
        }   
        else {
            builder.Prompts.confirm(session, new builder.Message(session).text('We\'ll use the account registed under %s?', session.dialogData.profile.name));
        }   
    },
    (session, results) => {
        session.send('Sending free spools to %s', results.response.email);
    }
];

