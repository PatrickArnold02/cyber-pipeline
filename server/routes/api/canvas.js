import express from 'express';
import canvasService from '../../services/canvasService.js';
import logger from '../../configs/logger.js';

const router = express.Router();
/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve a list of courses
 *     description: Fetches the list of courses from the Canvas API.
 *     responses:
 *       200:
 *         description: Successfully retrieved courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized - Canvas API is not configured
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       503:
 *         description: Service unavailable - Failed to get courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/courses', async function (req, res){
    const response = await canvasService.getCourses();
    
    if(response.status === 200){
        res.json(response.data);
    }
    else if(response.status === 401){
        res.status(401).json({message: 'Canvas API is not configured.'});
    }
    else{
        res.status(503).json({message: 'Failed to get courses (check api connection?)'});
        logger.error('Failed to get courses');
    }
})

export default router;