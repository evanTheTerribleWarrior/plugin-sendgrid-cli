const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const { categories } = require('../../../utils/common-flags')
const {extractFlags} = require('../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../utils/paths');

class AccountDelete extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteAccount()
      this.output(result)
    }

    async deleteAccount() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data;
          
        const request = {
            url: `${API_PATHS.ACCOUNT_PROVISIONING}/${id}`,
            method: 'DELETE',
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

AccountDelete.description = 'Delete an account'
AccountDelete.flags = Object.assign(
{
    'id': flags.string({description: 'The account ID to delete', required: true})  
}, BaseCommand.flags)

module.exports = AccountDelete;