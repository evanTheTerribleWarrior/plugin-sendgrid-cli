const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getDate } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class MonthlyStatsSingleSubuser extends BaseCommand {
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

MonthlyStatsSingleSubuser.description = 'Retrive the monthly email statistics for a specific subuser'
MonthlyStatsSingleSubuser.flags = Object.assign(
  { 
    'subuser-name': flags.string({description: 'The target subuser name', required: true}),
    'date': getDate('The date of the month to retrieve statistics for. Must be formatted YYYY-MM-DD', true),
    'sort-by-metric': flags.enum({description: 'The metric that you want to sort by.', options: ['blocks','bounces', 'clicks', 'delivered', 'opens', 'requests','unique_clicks', 'unique_opens', 'unsubscribes'], required: false}),
    'sort-by-direction': flags.enum({description: 'The direction you want to sort', options: ['asc', 'desc'], required: false}),
    'limit': flags.integer({description: 'Optional field to limit the number of results returned', required: false}),
    'offset': flags.integer({description: 'Optional beginning point in the list to retrieve from', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MonthlyStatsSingleSubuser;