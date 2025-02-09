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
        async getCourses(){
            try{
                const response = await api.get('/api/v1/canvas/courses');
                this.courses = response.data;
            } catch(error){
                Logger.error('Failed to get courses: ', error);
            }
        }
    }
})