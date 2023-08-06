const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class InvalidEmailList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listInvalidEmail()
      this.output(result)
    }

    async listInvalidEmail() {

        const { headers } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.INVALID_EMAIL}`,
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

InvalidEmailList.description = 'List of all invalid email addresses you attempt to send to'
InvalidEmailList.flags = Object.assign(
  { 
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = InvalidEmailList;