const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class TeammateInvite extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.inviteTeammate()
      this.output(result)
    }

    async inviteTeammate() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.TEAMMATES}`,
            method: 'POST',
            body: data,
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

TeammateInvite.description = 'Invite a Teammate to your account via email'
TeammateInvite.flags = Object.assign(
  { 
    'email': flags.string({description: 'New teammate\s email', required: true}),
    'scopes': getArrayFlag('Set to specify list of scopes that teammate should have. Should be empty if teammate is an admin', true),
    'is-admin': getBoolean('Set to true if teammate should be an admin user', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = TeammateInvite;