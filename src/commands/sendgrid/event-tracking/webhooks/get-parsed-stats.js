const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getDate } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class ParseWebhookGetStats extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.getParsedStats()
      this.output(result)
    }

    async getParsedStats() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.PARSE_WEBHOOK}/stats`,
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

ParseWebhookGetStats.description = 'Retrieve the statistics for your Parse Webhook usage'
ParseWebhookGetStats.flags = Object.assign(
  { 
    'limit': flags.string({description: 'The number of statistics to return on each page', required: false}),
    'offset': flags.string({description: 'The number of statistics to skip', required: false}),
    'aggregated-by': flags.string({description: 'How you would like the statistics to by grouped', required: false}),
    'start-date': getDate('The starting date of the statistics you want to retrieve. Must be in the format YYYY-MM-DD', true),
    'end-date': getDate('The end date of the statistics you want to retrieve. Must be in the format YYYY-MM-DD', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = ParseWebhookGetStats;