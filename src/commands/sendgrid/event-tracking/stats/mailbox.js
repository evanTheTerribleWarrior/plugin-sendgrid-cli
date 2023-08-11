const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getDate } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class StatsMailboxList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listMailboxStats()
      this.output(result)
    }

    async listMailboxStats() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.STATS_MAILBOX}`,
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

StatsMailboxList.description = 'Retrieve your email statistics segmented by recipient mailbox provider'
StatsMailboxList.flags = Object.assign(
  { 
    'mailbox-providers': flags.string({description: 'The mail box providers to get statistics for. You can include up to 10 by including this parameter multiple times', required: false}),
    'limit': flags.integer({description: 'The number of results to return', required: false}),
    'offset': flags.integer({description: 'The point in the list to begin retrieving results', required: false}),
    'aggregated-by': flags.enum({description: 'How to group the statistics', options: ['day', 'week', 'month'], required: false}),
    'start-date': getDate('The starting date of the statistics to retrieve. Must follow format YYYY-MM-DD', true),
    'end-date': getDate('The ending date of the statistics to retrieve. Must follow format YYYY-MM-DD', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = StatsMailboxList;