const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_VALIDATION_KEY);

class EmailValidate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.emailValidate()
      this.output(result)
    }

    async emailValidate() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.EMAIL_VALIDATION}`,
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

EmailValidate.description = 'Validate an email address'
EmailValidate.flags = Object.assign(
  { 
    'email': flags.string({description: 'The email address that you want to validate', required: true}),
    'source': flags.string({description: 'A one-word classifier for where this validation originated', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = EmailValidate;