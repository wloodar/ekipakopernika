const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
    }
});

transporter.use('compile', hbs({
    viewEngine: {
        extName: '.hbs',
        layoutsDir: __dirname + "/layouts/",
        defaultLayout: __dirname + "/layouts/basic.hbs",
        partialsDir: __dirname + "/layouts/",
    },
    viewPath: __dirname + "/templates/",
    extName: '.hbs'
}));

let sendMail = (mailOptions) => {
    transporter.sendMail({ 
        from: process.env.APP_NAME + ' <' + process.env.EMAIL_NAME + '>',
        bcc: [
            process.env.EMAIL_NAME,
            {
                name: process.env.APP_NAME,
                address: process.env.EMAIL_NAME
            }
        ], ...mailOptions }, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
};

module.exports = sendMail;
















// let handlebarsOptions = {
//     viewEngine: {
//         extName: '.hbs', // handlebars extension
//         layoutsDir: path.resolve('backend/components/custom/mail/layouts/'), // location of handlebars templates
//         defaultLayout: path.resolve('backend/components/custom/mail/layouts/basic.hbs'),
//         partialsDir: path.resolve('backend/components/custom/mail/layouts/'), // location of your subtemplates aka. header, footer etc
//     },
//     viewPath: path.resolve('backend/components/custom/mail/templates/'),
//     extName: '.hbs'
// };