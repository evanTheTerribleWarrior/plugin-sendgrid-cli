const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const {extractFlags, getBoolean, getDataFile} = require('../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../utils/paths');

class AccountCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.createAccount()
      this.output(result)
    }

    async createAccount() {
        const { headers, ...data } = extractFlags(this.flags);
        const { is_test, data_file } = data;

        if(is_test) {
            headers['T-Test-Account'] = true;
        }
          
        const request = {
            url: `${API_PATHS.ACCOUNT_PROVISIONING}/accounts`,
            method: 'POST',
            body: data_file,
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

AccountCreate.description = 'Creates a new customer account'
AccountCreate.flags = Object.assign(
{
    'is-test': getBoolean('If true, it will create a Test Account', false),
    'data-file': getDataFile('The local JSON file containing the data for the new account', true) 
}, BaseCommand.flags)

module.exports = AccountCreate;