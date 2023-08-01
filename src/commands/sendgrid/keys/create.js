const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const { scopes } = require('../../../utils/common-flags')
const API_PATHS = require('../../../utils/paths');
const extractFlags = require('../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class KeyCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.createKey()
      this.output(result)
    }

    async createKey() {

        const { headers, ...data } = extractFlags(this.flags);
          
        const request = {
            url: `${API_PATHS.API_KEYS}`,
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

KeyCreate.description = 'Create a new API Key'
KeyCreate.flags = Object.assign(
  {
    'name': flags.string({description: 'Name of the API Key', required: true}),
    'scopes': scopes,
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = KeyCreate;