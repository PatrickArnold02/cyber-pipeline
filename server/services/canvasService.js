import 'dotenv/config';
import axios from 'axios';
import logger from '../configs/logger.js';
import { response } from 'express';

const canvasService = {
    async getCourses(){
        if (env.CANVAS_ENABLED) {
            try{
                const response = await axios.get(`${process.env.CANVAS_URL}/api/v1/courses`, {
                    headers: { Authorization: `Bearer ${process.env.CANVAS_TOKEN}`}
                });
                return response.data;
            } catch(error){
                logger.error('Failed to get courses: ' + error);
            }
        }
    }
}

export default canvasService;