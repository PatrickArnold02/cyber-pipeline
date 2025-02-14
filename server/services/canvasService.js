import 'dotenv/config';
import axios from 'axios';
import logger from '../configs/logger.js';
import { response } from 'express';

const canvasService = {
    async getCourses(){
        if (process.env.CANVAS_ENABLED) {
            try{
                const response = await axios.get(`${process.env.CANVAS_URL}/api/v1/courses`, {
                    headers: { Authorization: `Bearer ${process.env.CANVAS_TOKEN}`}
                });
                
                return response;

            } catch(error){
                logger.error('Failed to get courses: ' + error);
                const response = {};
                response.status = 1;
                response.data = {message: 'Failed to get courses (check api connection?)'};
                return response;
            }
        }
    }
}

export default canvasService;