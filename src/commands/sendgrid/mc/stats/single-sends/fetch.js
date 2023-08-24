const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getArrayFlag, getDate  } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCStatsSingleSendFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetch()
      this.output(result)
    }

    async fetch() {

        const { headers, ...data } = extractFlags(this.flags);
        const {id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.MC_STATS}/singlesends/${id}`,
            method: 'GET',
            qs: dataWithoutId,
            headers: headers
        }

        try {
            client.setApiKey(process.env.SG_API_KEY);
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error
        }    
    }
}

MCStatsSingleSendFetch.description = 'Retrieve stats for an individual Single Send using a Single Send ID'
MCStatsSingleSendFetch.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the single send to fetch', required: true}),
    'group-by': getArrayFlag('A/B Single Sends have multiple variation IDs and phase IDs', false),
    'aggregated-by': flags.enum({description: 'Dictates how the stats are time-sliced', options: ['total', 'day'], required: false}),
    'timezone': flags.string({description: 'IANA Area/Region string representing the timezone in which the stats are to be presented', required: false}),
    'page-size': flags.integer({description: 'The number of elements you want returned on each page', required: false}),
    'page-token': flags.string({description: 'Token corresponding to a specific page of results, as provided by metadata', required: false}),
    'start-date': getDate('Format: YYYY-MM-DD. If this parameter is included, the stats\' start date is included in the search', false),
    'end-date': getDate('Format: YYYY-MM-DD. If this parameter is included, the stats\' end date is included in the search', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCStatsSingleSendFetch;