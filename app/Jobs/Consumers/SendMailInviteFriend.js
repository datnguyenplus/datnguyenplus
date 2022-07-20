'use strict';

const Mail = use('Mail')
const Env = use('Env')
/**
 * Sample job consumer class
 *
 * @version 2.0.0
 * @adonis-version 4.0+
 */

class SendMailInviteFriend {

    /**
     * Concurrency for processing this job
     * @return {Int} Num of jobs processed at time
     */
    static get concurrency() {
        return 1;
    }

    /**
     * UUID for this job class
     * Make sure consumer and producer are in sync
     * @return {String}
     */
    static get type() {
        return 'send-mail-invite-friend';
    }

    /**
     * Inject custom payload into the job class
     * @param  {Object} data
     *
     * DO NOT MODIFY!
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * Inject the kue ctx to the consumer, you can use it to
     * pause(), shutdown() or remove() handler actions.
     * See kue's doc for more details
     * @param  {Object} data
     *
     * DO NOT MODIFY!
     */
    setContext(ctx) {
        this.ctx = ctx;
    }

    /**
     * Handle the sending of email data
     * You can drop the async keyword if it is synchronous
     */
    async handle() {
        const userData = this.data['data']
        await Mail.send('emails.customer_invite_friend', userData, (message) => {
            message
            .to(userData.email)
            .from(Env.get('MAIL_FROM_ADDRESS') , Env.get('MAIL_FROM_NAME'))
            .subject('ICAREBASE! You just received invite from ' + userData.full_name)
        })
    }


}

module.exports = SendMailInviteFriend;
