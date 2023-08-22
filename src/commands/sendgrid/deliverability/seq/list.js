const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getDate } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class SeqList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listSeq()
      this.output(result)
    }

    async listSeq() {

        const { headers, ...data } = extractFlags(this.flags);
        
        const request = {
            url: `${API_PATHS.SEQ}/scores`,
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

SeqList.description = 'Retrieve your SendGrid Engagement Quality (SEQ) scores for a specified date range'
SeqList.flags = Object.assign(
  {
    'from': getDate('The starting date in YYYY-MM-DD format (UTC) for which you want to retrieve scores', true),
    'to': getDate('The ending date in YYYY-MM-DD format (UTC) for which you want to retrieve scores', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SeqList;