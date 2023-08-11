const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getDate } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class StatsGlobalList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listGlobalStats()
      this.output(result)
    }

    async listGlobalStats() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.STATS}`,
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

StatsGlobalList.description = 'Retrieve all of your global email statistics between a given date range'
StatsGlobalList.flags = Object.assign(
  { 
    'limit': flags.integer({description: 'The number of results to return', required: false}),
    'offset': flags.integer({description: 'The point in the list to begin retrieving results', required: false}),
    'aggregated-by': flags.enum({description: 'How to group the statistics', options: ['day', 'week', 'month'], required: false}),
    'start-date': getDate('The starting date of the statistics to retrieve. Must follow format YYYY-MM-DD', true),
    'end-date': getDate('The ending date of the statistics to retrieve. Must follow format YYYY-MM-DD', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = StatsGlobalList;