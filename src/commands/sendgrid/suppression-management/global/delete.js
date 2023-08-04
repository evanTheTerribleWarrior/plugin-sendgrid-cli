const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SuppressionGlobalDelete extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteSuppressionGlobal()
      this.output(result)
    }

    async deleteSuppressionGlobal() {

        const { headers, ...data } = extractFlags(this.flags);
        const { email } = data;

        const request = {
            url: `${API_PATHS.SUPPRESION}/global/${email}`,
            method: 'DELETE',
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

SuppressionGlobalDelete.description = 'Delete a global suppression'
SuppressionGlobalDelete.flags = Object.assign(
  { 
    'email': flags.string({description: 'The email address of the global suppression you want to delete', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SuppressionGlobalDelete;