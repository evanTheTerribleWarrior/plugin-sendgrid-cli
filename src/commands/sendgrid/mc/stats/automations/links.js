const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getArrayFlag, getDate  } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCStatsAutomationsFetchLinks extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetch()
      this.output(result)
    }

    async fetch() {

        const { headers, ...data } = extractFlags(this.flags);
        const {id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.MC_STATS}/automations/${id}/links`,
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

MCStatsAutomationsFetchLinks.description = 'Retrieve click-tracking stats for a single Automation'
MCStatsAutomationsFetchLinks.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the automation to fetch', required: true}),
    'group-by': getArrayFlag('Automations can have multiple steps. Including step_id as a group_by metric allows further granularity of stats', false),
    'step-ids': getArrayFlag('Comma-separated list of step_ids that you want the link stats for', false),
    'page-size': flags.integer({description: 'The number of elements you want returned on each page', required: false}),
    'page-token': flags.string({description: 'Token corresponding to a specific page of results, as provided by metadata', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCStatsAutomationsFetchLinks;