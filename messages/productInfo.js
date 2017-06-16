var builder = require('botbuilder');    
    
module.exports = [
    (session) => {        
        builder.Prompts.choice(session, 'Are you looking for information on a current product or new product?', 'existing|new');
    },
    (session, results, next) => {
        session.send('Ok, this is a %s product', results.response.entity);
        session.dialogData.productNew = (results.response.entity == 'new');

        var options = [
            new builder.ThumbnailCard(session)
            .title('Garden Tools')
            .images([ builder.CardImage.create(session, 'https://www.carid.com/images/positec/patio-and-garden/wg050.jpg')])
            .buttons([ builder.CardAction.imBack(session, 'Lawn & Garden', 'Lawn & Garden') ]),

            new builder.ThumbnailCard(session)
            .title('Garden Tools')
            .images([ builder.CardImage.create(session, 'http://ww1.prweb.com/prfiles/2013/01/28/10757538/RK2600K2_Rockwell_16V_drill_driver.jpg')])
            .buttons([ builder.CardAction.imBack(session, 'Power Tool', 'Power Tool') ]),
            
            new builder.ThumbnailCard(session)
            .title('Garden Tools')
            .images([ builder.CardImage.create(session, 'http://ww1.prweb.com/prfiles/2016/05/26/13447845/Rockwell_Sonicrafter_F80_RK5151K_Light.jpg')])
            .buttons([ builder.CardAction.imBack(session, 'Oscillation Tool', 'Oscillation Tool') ])
        ];
        var reply = new builder.Message(session)
            .text('What category does this product belong to?')
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(options);

        builder.Prompts.text(session, reply);
    },
    (session, results, next) => {
        session.send('Ok, you have a %s product', results.response);
        session.dialogData.productCategory = results.response;
        var msg = new builder.Message(session)
            .text('Do you have an issue with your product or are you interested in free spools for life?')
            .suggestedActions(
                builder.SuggestedActions.create(
                        session, [
                            builder.CardAction.imBack(session, 'Product Issue', 'Product Issue'),
                            builder.CardAction.imBack(session, 'Free Spools', 'Free Spools')
                        ]
                    ));

        builder.Prompts.text(session, msg);
    },
    (session, results, next) => {
        if (results.response.toLowerCase().includes('free')) {
            session.replaceDialog('/freeSpools');
        }
        else if (results.response.toLowerCase().includes('issue')) {
            builder.Prompts.confirm(session, new builder.Message(session).text('So have a problem with your %s, right?', session.dialogData.productCategory));
        }
    },
    (session, result, next) => {
        console.log(result.response);
        if (result.response = true){
            session.send('Ok, here\'s how we are going to fix your problem...');
        }
        session.endDialog();
    }
];

