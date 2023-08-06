const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class InvalidEmailFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchInvalidEmail()
      this.output(result)
    }

    async fetchInvalidEmail() {

        const { headers, ...data } = extractFlags(this.flags);
        const { email } = data;

        const request = {
            url: `${API_PATHS.INVALID_EMAIL}/${email}`,
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

InvalidEmailFetch.description = 'Retrieve a specific invalid email addresses'
InvalidEmailFetch.flags = Object.assign(
  { 
    'email': flags.string({description: 'The specific email address of the invalid email entry that you want to retrieve', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = InvalidEmailFetch;