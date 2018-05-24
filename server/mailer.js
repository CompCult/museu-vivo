var nodeMailer  = require('nodemailer');

class Mailer {
    static sendMail(email, content) {
        var transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                //process.env.MAILER_MAIL
                ////process.env.MAILER_PASS
                user: "ufcgcompcult@gmail.com",
                pass: "Atelier1516@"
            },
            tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
            }
        });

        var mailOptions = {
            from: "Equipe Minha Arvore <ufcgcompcult@gmail.com>", // sender address
            to: email, // list of receivers
            subject: content.subject, // Subject line
            text: content.text, // plaintext body
            html: content.html
        }

        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent!");
            }

            transporter.close(); // shut down the connection pool, no more messages
        });
    }
}

module.exports = Mailer;
