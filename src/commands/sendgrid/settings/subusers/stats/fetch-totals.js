const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getDate } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class TotalsList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listTotals()
      this.output(result)
    }

    async listTotals() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.SUBUSERS}/stats/sums`,
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

TotalsList.description = 'Retrive the total sums of each email statistic metric for all subusers over the given date range'
TotalsList.flags = Object.assign(
  { 
    'aggregated-by': getDate('How to group the statistics. Defaults to today. Must follow format YYYY-MM-DD', false),
    'start-date': getDate('The starting date of the statistics to retrieve. Must follow format YYYY-MM-DD', true),
    'end-date': getDate('The ending date of the statistics to retrieve. Must follow format YYYY-MM-DD', false),
    'sort-by-metric': flags.enum({description: 'The metric that you want to sort by.', options: ['blocks','bounces', 'clicks', 'delivered', 'opens', 'requests','unique_clicks', 'unique_opens', 'unsubscribes'], required: false}),
    'sort-by-direction': flags.enum({description: 'The direction you want to sort', options: ['asc', 'desc'], required: false}),
    'limit': flags.integer({description: 'Optional field to limit the number of results returned', required: false}),
    'offset': flags.integer({description: 'Optional beginning point in the list to retrieve from', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = TotalsList;