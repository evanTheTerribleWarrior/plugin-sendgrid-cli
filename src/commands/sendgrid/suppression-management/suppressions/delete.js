const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class SuppressionDelete extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteSuppression()
      this.output(result)
    }

    async deleteSuppression() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, email } = data

        const request = {
            url: `${API_PATHS.SUPPRESSION_GROUPS}/${id}/suppressions/${email}`,
            method: 'DELETE',
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

SuppressionDelete.description = 'Remove a suppressed email address from the given suppression group'
SuppressionDelete.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the suppression group you would like to retrieve', required: true}),
    'email': flags.string({description: 'The email address that you want to remove from the suppression group', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SuppressionDelete;