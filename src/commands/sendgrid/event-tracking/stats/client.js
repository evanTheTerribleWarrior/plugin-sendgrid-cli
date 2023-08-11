const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getDate } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class StatsClientList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listClientStats()
      this.output(result)
    }

    async listClientStats() {

        const { headers, ...data } = extractFlags(this.flags);
        const { client_type, ...dataWithoutClientType } = data;

        const request = {
            url: `/v3/clients/${client_type}/stats`,
            method: 'GET',
            qs: dataWithoutClientType,
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

StatsClientList.description = 'Retrieve your email statistics by specific client type'
StatsClientList.flags = Object.assign(
  { 
    'client-type': flags.enum({description: 'Specifies the type of client to retrieve stats for', options: ['phone', 'tablet', 'webmail', 'desktop'], required: true}),
    'aggregated-by': flags.enum({description: 'How to group the statistics', options: ['day', 'week', 'month'], required: false}),
    'start-date': getDate('The starting date of the statistics to retrieve. Must follow format YYYY-MM-DD', true),
    'end-date': getDate('The ending date of the statistics to retrieve. Must follow format YYYY-MM-DD', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = StatsClientList;