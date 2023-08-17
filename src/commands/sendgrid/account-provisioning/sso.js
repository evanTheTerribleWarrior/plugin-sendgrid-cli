const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const { categories } = require('../../../utils/common-flags')
const {extractFlags} = require('../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../utils/paths');

class AccountSSO extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.ssoAccount()
      this.output(result)
    }

    async ssoAccount() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data;
          
        const request = {
            url: `${API_PATHS.ACCOUNT_PROVISIONING}/accounts/${id}/sso`,
            method: 'POST',
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

AccountSSO.description = 'Logs in a user to Twilio Sendgrid as a specific admin identity configured for SSO by partner'
AccountSSO.flags = Object.assign(
{
    'id': flags.string({description: 'The account ID', required: true})  
}, BaseCommand.flags)

module.exports = AccountSSO;