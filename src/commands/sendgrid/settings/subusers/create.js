const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SubuserCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.createSubuser()
      this.output(result)
    }

    async createSubuser() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.SUBUSERS}`,
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

SubuserCreate.description = 'Create a Subuser'
SubuserCreate.flags = Object.assign(
  { 
    'username': flags.string({description: 'The username of this subuser', required: true}),
    'email': flags.string({description: 'The email address of the subuser', required: true}),
    'password': flags.string({description: 'The password this subuser will use when logging into SendGrid', required: true}),
    'ips': getArrayFlag('The IP addresses that should be assigned to this subuser', true)
  }, BaseCommand.flags)

module.exports = SubuserCreate;