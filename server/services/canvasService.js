import 'dotenv/config';
import axios from 'axios';
import logger from '../configs/logger.js';
import { response } from 'express';

const canvasService = {
    async getCourses(teacherID){
        if (process.env.CANVAS_ENABLED) {
            try{
                const response = await axios.get(`${process.env.CANVAS_URL}/api/v1/users/:${teacherID}/courses`, {
                    headers: { Authorization: `Bearer ${process.env.CANVAS_TOKEN}`}
                });
                return response;
            } catch(error){
                if(error.response.status === 401){
                    logger.error('Canvas API is not configured in server/.env');
                    const response = {status: 401, data: {message: 'Canvas API is not configured'}};
                    return response;
                }else{
                    logger.error('Failed to get courses: ' + error);
                    const response = {status: 503, data: {message: 'Failed to get courses'}};
                    return response;
                }
            }
        }
        else{
            logger.error('Canvas Token NOT defined in server/.env, Canvas API disabled');
            return response.status(500).json({message: 'Canvas API disabled'});
        }
    }
}

export default canvasService;