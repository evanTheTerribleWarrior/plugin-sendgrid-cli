const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class SuppressionsList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listSuppressions()
      this.output(result)
    }

    async listSuppressions() {

        const { headers } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.SUPPRESION}`,
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

SuppressionsList.description = 'Retrieve a list of all suppressions'
SuppressionsList.flags = Object.assign(
  { 
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SuppressionsList;