const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class PasswordUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updatePassword()
      this.output(result)
    }

    async updatePassword() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.USER_PASSWORD}`,
            method: 'PUT',
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

PasswordUpdate.description = 'Update your user password'
PasswordUpdate.flags = Object.assign(
  { 
    'new-password': flags.string({description: 'The new password for your user', required: true}),
    'old-password': flags.string({description: 'The old password for your user', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = PasswordUpdate;