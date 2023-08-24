const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getArrayFlag  } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCStatsAutomationsList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listAll()
      this.output(result)
    }

    async listAll() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MC_STATS}/automations`,
            method: 'GET',
            qs: data,
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

MCStatsAutomationsList.description = 'Retrieve stats for all your Automations'
MCStatsAutomationsList.flags = Object.assign(
  { 
    'automation-ids': getArrayFlag('This endpoint returns all automation IDs if no automation_ids are specified', false),
    'page-size': flags.integer({description: 'The number of elements you want returned on each page', required: false}),
    'page-token': flags.string({description: 'Token corresponding to a specific page of results, as provided by metadata', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCStatsAutomationsList;