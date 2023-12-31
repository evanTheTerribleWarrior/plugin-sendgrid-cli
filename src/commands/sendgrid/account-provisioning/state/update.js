const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const {extractFlags} = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../../utils/paths');

class AccountStateUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateAccountState()
      this.output(result)
    }

    async updateAccountState() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoudId } = data;
          
        const request = {
            url: `${API_PATHS.ACCOUNT_PROVISIONING}/accounts/${id}/state`,
            method: 'PUT',
            body: dataWithoudId,
            headers: headers
        }

        try {
            client.setApiKey(process.env.SG_ACCOUNT_PROVISIONING_KEY);
            const [response] = await client.request(request);
            return "OK"
        } catch (error) {
            return error
        }  
          
    }
}

AccountStateUpdate.description = 'Update the state of the specified account'
AccountStateUpdate.flags = Object.assign(
{
    'id': flags.string({description: 'The account ID to fetch the state for', required: true}),
    'state': flags.enum({description: 'The state of the account', options: ['activated', 'deactivated'], required: true})
}, BaseCommand.flags)

module.exports = AccountStateUpdate;