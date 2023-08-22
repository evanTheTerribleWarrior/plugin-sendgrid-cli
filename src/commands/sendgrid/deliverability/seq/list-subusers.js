const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getDate } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class SeqSubusersList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listSeq()
      this.output(result)
    }

    async listSeq() {

        const { headers, ...data } = extractFlags(this.flags);
        
        const request = {
            url: `${API_PATHS.SEQ}/subusers/scores`,
            method: 'GET',
            qs: data,
            headers: headers
        }

        try {
            client.setApiKey(process.env.SG_ACCOUNT_PROVISIONING_KEY);
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error
        }    
    }
}

SeqSubusersList.description = 'Retrieve SendGrid Engagement Quality (SEQ) scores for your Subusers or customer accounts for a specific date'
SeqSubusersList.flags = Object.assign(
  {
    'date': getDate('The date in YYYY-MM-DD format (UTC) for which you want to retrieve a SendGrid Engagment Quality score', true),
    'limit': flags.integer({description: 'Specifies the number of results to be returned by the API', required: false}),
    'after-key': flags.integer({description: 'Specifies which items to be returned by the API', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SeqSubusersList;