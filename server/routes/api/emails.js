import express from 'express';
import sendEmail from '../../services/emailService.js';
import logger from '../../configs/logger.js';

const router = express.Router();

router.post('/', async function (req, res) {
    // TODO: Add CreatedBy to this for logging within the database
    const {to, subject, text, html} = req.body;

    logger(6, 'Request body: ' + req.body);

    try{
        await sendEmail(to, subject, text, html);
        res.status(200).json({success: true, message: 'Email sent successfully'});
    } catch(error){
        res.status(500).json({success: false, message: 'Failed to send email'});
        logger.log(6, "Failed to send email");
    }
})

export default router;