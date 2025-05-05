import 'dotenv/config';
import nodemailer from 'nodemailer';
import logger from '../configs/logger.js';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },
});

const sendEmail = async (to, subject, text, html) => {
    try{
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: Array.isArray(to) ? to.join(',') : to,
            subject: subject,
            text: text,
            html: html,
        };

        logger.email('Sending email to:  ' + to);
        const result = await transporter.sendMail(mailOptions);
        logger.email('Email sent: '+ result.messageId);

    } catch(error){
        logger.error('Failed to send email: ' + error);

        throw error;
    }
}

const sendMagicLink = async (emailData) => {
    console.log(emailData)

    try{
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: emailData.to,
            subject: emailData.subject,
            text: emailData.text,
            html: emailData.html,
        };

        logger.email('Sending email to: ' + emailData.to);
        const result = await transporter.sendMail(mailOptions);
        logger.email('Email sent: ' + result.messageId);
    } catch(error) {
        logger.error('Failed to send email: ' + error);
        throw error;
    }
}

export default sendEmail;
export { sendMagicLink };
