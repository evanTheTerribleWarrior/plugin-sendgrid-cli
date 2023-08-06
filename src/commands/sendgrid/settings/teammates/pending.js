const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class TeammatePending extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listPendingInvites()
      this.output(result)
    }

    async listPendingInvites() {

        const { headers } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.TEAMMATES}`,
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

TeammatePending.description = 'Retrieve a list of all pending Teammate invitations'
TeammatePending.flags = Object.assign(
  { 
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = TeammatePending;