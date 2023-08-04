const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SuppressionGlobalFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchSuppressionGlobal()
      this.output(result)
    }

    async fetchSuppressionGlobal() {

        const { headers, ...data } = extractFlags(this.flags);
        const { email } = data;

        const request = {
            url: `${API_PATHS.SUPPRESION}/global/${email}`,
            method: 'GET',
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

SuppressionGlobalFetch.description = 'Retrieve a global suppression. You can also use this endpoint to confirm if an email address is already globally suppresed'
SuppressionGlobalFetch.flags = Object.assign(
  { 
    'email': flags.string({description: 'The email address of the global suppression you want to retrieve', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SuppressionGlobalFetch;