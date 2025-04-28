import { defineStore } from 'pinia'
import Logger from 'js-logger'
import api from '@/services/api'

export const useCanvasStore = defineStore('canvas', {
    state: () => {
        return{
            courses: []
        }
    },
    actions: {
        /* Gets course progress for a specific course and teacher 
        *  @param {string} courseID - the CANVAS id of the course 
        *  @param {string} teacherID - the CANVAS id of the teacher 
        *  NOTE: teacherID is currently being stored in the eid field in the database
        *        in the future, this should either be changed or swapped to a SIS ID
        */
        async getCourseProgress(courseID, teacherID){
            try{
                const response = await api.get(`/api/v1/canvas/courses/progress/${courseID}/${teacherID}`);
                this.courses = response.data;

                return response;
            }catch (error){
                if(error.response.status === 401){
                    if(error.response.status === 401){
                        return {status: 401, data: {message: 'Canvas API is not configured.'}};
                    } else if(error.response.status === 503){
                        return {status: 503, data: {message: 'Failed to get courses (check api connection?)'}};
                    } else if(error.response.status === 500){
                        return {status: 500, data: {message: 'Canvas API disabled, see server/.env'}};
                    } else{
                        return {status: 500, data: {message: 'Failed to get courses'}};
                    }
                }
            }
        },
        /*  Enrolls a teacher in a course 
        *  @param {string} courseID - the CANVAS id of the course
        *  @param {string} teacherID - the CANVAS id of the teacher
        */
        async enrollTeacherInCourse(courseID, teacherID){
            try{
                const response = await api.post(`/api/v1/canvas/courses/enrollment/${courseID}/${teacherID}`);
                
                return true;
            } catch(error){
                return false;
            }
        }
    }
    // actions: {
    //     async getCourses(){
    //         try{
    //             const response = await api.get('/api/v1/canvas/courses');
    //             this.courses = response.data;

    //             return response;
    //         } catch(error){
    //             if(error.response.status === 401){
    //                 return {status: 401, data: {message: 'Canvas API is not configured.'}};
    //             } else if(error.response.status === 503){
    //                 return {status: 503, data: {message: 'Failed to get courses (check api connection?)'}};
    //             } else if(error.response.status === 500){
    //                 return {status: 500, data: {message: 'Canvas API disabled, see server/.env'}};
    //             }
    //             else{
    //                 return {status: 500, data: {message: 'Failed to get courses'}};
    //             }
    //         }
    //     }
    // }
})