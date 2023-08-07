const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getDate } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class StatsSingleSubuser extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchStats()
      this.output(result)
    }

    async fetchStats() {

        const { headers, ...data } = extractFlags(this.flags);
        const { subuser_name, ...rest } = data;

        const request = {
            url: `${API_PATHS.SUBUSERS}/${subuser_name}/stats/monthly`,
            method: 'GET',
            qs: rest,
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

StatsSingleSubuser.description = 'Retrive email statistics for specific subusers'
StatsSingleSubuser.flags = Object.assign(
  { 
    'subusers': flags.string({description: 'The subuser you want to retrieve statistics for. You may include this parameter up to 10 times to retrieve statistics for multiple subusers', required: true}),
    'start-date': getDate('The starting date of the statistics to retrieve. Must follow format YYYY-MM-DD', true),
    'end-date': getDate('The ending date of the statistics to retrieve. Must follow format YYYY-MM-DD', false),
    'aggregated-by': flags.enum({description: 'How to group the statistics', options: ['day', 'week', 'month'], required: false}),
    'limit': flags.integer({description: 'Optional field to limit the number of results returned', required: false}),
    'offset': flags.integer({description: 'Optional beginning point in the list to retrieve from', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = StatsSingleSubuser;