const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const {extractFlags} = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../../utils/paths');

class AccountStateFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchAccountState()
      this.output(result)
    }

    async fetchAccountState() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data;
          
        const request = {
            url: `${API_PATHS.ACCOUNT_PROVISIONING}/accounts/${id}/state`,
            method: 'GET',
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

AccountStateFetch.description = 'Retrieve the state of the specified account'
AccountStateFetch.flags = Object.assign(
{
    'id': flags.string({description: 'The account ID to fetch the state for', required: true})  
}, BaseCommand.flags)

module.exports = AccountStateFetch;