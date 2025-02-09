import express from 'express';
import canvasService from '../../services/canvasService.js';
import logger from '../../configs/logger.js';

const router = express.Router();

router.get('/courses', async function (req, res){
    try{
        const courses = await canvasService.getCourses();
        res.json(courses);
    } catch(error){
        logger.error('Failed to get courses: ' + error);
    }
})

export default router;