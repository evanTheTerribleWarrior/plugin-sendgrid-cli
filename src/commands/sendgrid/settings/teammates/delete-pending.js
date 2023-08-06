const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class TeammatePendingDelete extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteTeammateInvite()
      this.output(result)
    }

    async deleteTeammateInvite() {

        const { headers, ...data } = extractFlags(this.flags);
        const { token } = data;

        const request = {
            url: `${API_PATHS.TEAMMATES}/pending/${token}`,
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

TeammatePendingDelete.description = 'Delete a specific Teammate invite'
TeammatePendingDelete.flags = Object.assign(
  { 
    'token': flags.string({description: 'The token for the invite you want to delete', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = TeammatePendingDelete;