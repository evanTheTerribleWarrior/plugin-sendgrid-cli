const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getDate } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class StatsGeoList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listGeoStats()
      this.output(result)
    }

    async listGeoStats() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.STATS_GEO}`,
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

StatsGeoList.description = 'Retrieve your email statistics segmented by country and state/province'
StatsGeoList.flags = Object.assign(
  { 
    'country': flags.string({description: 'The country you would like to see statistics for. Currently only supported for US and CA', required: false}),
    'limit': flags.integer({description: 'The number of results to return', required: false}),
    'offset': flags.integer({description: 'The point in the list to begin retrieving results', required: false}),
    'aggregated-by': flags.enum({description: 'How to group the statistics', options: ['day', 'week', 'month'], required: false}),
    'start-date': getDate('The starting date of the statistics to retrieve. Must follow format YYYY-MM-DD', true),
    'end-date': getDate('The ending date of the statistics to retrieve. Must follow format YYYY-MM-DD', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = StatsGeoList;