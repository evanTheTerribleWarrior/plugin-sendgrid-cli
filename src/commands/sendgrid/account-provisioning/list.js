const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const {extractFlags} = require('../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../utils/paths');

class AccountsList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listAccounts()
      this.output(result)
    }

    async listAccounts() {
        const { headers, ...data } = extractFlags(this.flags);
          
        const request = {
            url: `${API_PATHS.ACCOUNT_PROVISIONING}/accounts`,
            method: 'GET',
            qs: data,
            headers: headers
        }

        try {
            client.setApiKey(process.env.SG_ACCOUNT_PROVISIONING_KEY);
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error
        }  
          
    }
}

AccountsList.description = 'Retrieves all accounts under the organization'
AccountsList.flags = Object.assign(
{
    'offset': flags.string({description: 'The offset that defines where to start counting from', required: false}),
    'limit': flags.integer({description: 'Results per page', required: false})  
}, BaseCommand.flags)

module.exports = AccountsList;