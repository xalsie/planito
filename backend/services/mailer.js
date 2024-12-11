const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Description : Service to send emails.
 *
 * Method sendEmail
 * @param {String} target - The email address of the recipient.
 * @param {String} subject - The subject of the email.
 * @param {String} content - The content of the email.
 *
 * @return {Promise} - The promise to send the email.
 *
 * @example
 * const mailer = new MailerService();
 * mailer.sendEmail("mail@test.com", "Test", "This is a test email.");
 */
class MailerService {
    constructor() {
        const options = {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        }

        this.transporter = nodemailer.createTransport(options);
    }

    async sendEmail(target, subject, content) {
        try {
            const mailOptions = {
                from: "MySite@mysite.com",
                to: target,
                subject: subject,
                text: content
            };
            await this.transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log("Error sending message: " + err);
                } else {
                    console.log("Message sent succesfully.");
                }
            })
        } catch (error) {
            console.error(error.message);
        }
    }
}

module.exports = MailerService;
