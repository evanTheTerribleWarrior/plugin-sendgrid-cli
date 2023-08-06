const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SpamReportList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listSpamReports()
      this.output(result)
    }

    async listSpamReports() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.SPAM_REPORTS}`,
            method: 'GET',
            qs: data,
            headers: headers
        }

        try {
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error
        }    
    }
}

SpamReportList.description = 'Retrieve all spam reports'
SpamReportList.flags = Object.assign(
  { 
    'start-time': flags.integer({description: 'Refers start of the time range in unix timestamp when a spam report was created (inclusive)', required: false}),
    'end-time': flags.integer({description: 'Refers end of the time range in unix timestamp when a spam report was created (inclusive)', required: false}),
    'limit': flags.integer({description: 'Limit the number of results to be displayed per page', required: false}),
    'offset': flags.integer({description: 'The point in the list to begin displaying results. To retrieve more than 500 results, you can make multiple requests to the API, using the offset to begin at the next result in the list', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SpamReportList;