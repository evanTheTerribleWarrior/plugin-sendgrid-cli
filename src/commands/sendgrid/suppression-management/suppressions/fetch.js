const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class SuppressionFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchSuppressionGroup()
      this.output(result)
    }

    async fetchSuppressionGroup() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data

        const request = {
            url: `${API_PATHS.SUPPRESSION_GROUPS}/${id}/suppressions`,
            method: 'GET',
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

SuppressionFetch.description = 'Retrieve all suppressed email addresses belonging to the given group'
SuppressionFetch.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the suppression group you would like to retrieve', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SuppressionFetch;