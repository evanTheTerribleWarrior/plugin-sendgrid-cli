const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const extractFlags = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class KeysList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listKeys()
      this.output(result)
    }

    async listKeys() {

        const { headers, ...data } = extractFlags(this.flags);
        
        const request = {
            url: `${API_PATHS.API_KEYS}`,
            method: 'GET',
            headers: headers
        }

        try {
            const [response] = await client.request(request);
            return response.body.result
        } catch (error) {
            return error
        }    
    }
}

KeysList.description = 'List API Keys'
KeysList.flags = Object.assign(
  {
    'limit': flags.string({description: 'Number of results to be returned. Can be used in combination with "before_key" and "after_key" to iterate through paginated results', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = KeysList;