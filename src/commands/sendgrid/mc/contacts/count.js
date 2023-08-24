const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCContactFetchCount extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetch()
      this.output(result)
    }

    async fetch() {

        const { headers } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MC_CONTACTS}/count`,
            method: 'GET',
            headers: headers
        }

        try {
            client.setApiKey(process.env.SG_API_KEY);
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error
        }    
    }
}

MCContactFetchCount.description = 'Returns the total number of contacts you have stored'
MCContactFetchCount.flags = Object.assign(
  { 
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCContactFetchCount;