const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class ParseWebhookGet extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.getParsedEventWebhook()
      this.output(result)
    }

    async getParsedEventWebhook() {

        const { headers } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.PARSE_WEBHOOK}/settings`,
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

ParseWebhookGet.description = 'Retrieve the parse webhook settings'
ParseWebhookGet.flags = Object.assign(
  { 
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = ParseWebhookGet;