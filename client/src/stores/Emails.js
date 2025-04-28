import { defineStore } from 'pinia'
import Logger from 'js-logger'

import api from '@/services/api'

// TODO: Finish setting this store up for database logging of the emails

export const useEmailsStore = defineStore('emails', {
    state: () => {
        return {
            emails: [] // list of emails
        }
    },
    actions: {
        /*  Sends an email using the data from the emailData object
        *   @param {object} emailData -
        *       {
        *          to: 'recipient email address',
        *          subject: 'email subject',
        *          body: 'email body',
        *          attachments: [ 'attachment1', 'attachment2' ]
        *       }
        *
        */
        async sendEmail(emailData){
            try {
                await api.post('/api/v1/emails', emailData)
            } catch (error) {
                Logger.error('Failed to send email: ', error);
            }
        },
        //async hydrate() {
        //    Logger.info('emails:hydrate')
        //    await api.get('/api/v1/emails').then((response) => {
        //        this.emails = response.data
        //    })
        //}
    }

})

export default useEmailsStore