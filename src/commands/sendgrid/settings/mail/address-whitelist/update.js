const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getArrayFlag, getBoolean } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class AddressWhitelistUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.addressWhitelistUpdate()
      this.output(result)
    }

    async addressWhitelistUpdate() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MAIL_SETTINGS}/address_whitelist`,
            method: 'PATCH',
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

AddressWhitelistUpdate.description = 'Update your current email address whitelist settings'
AddressWhitelistUpdate.flags = Object.assign(
  { 
    'enabled': getBoolean('Indicates if your email address whitelist is enabled', false),
    'list': getArrayFlag('Either a single email address that you want whitelisted or a domain, for which all email addresses belonging to this domain will be whitelisted', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = AddressWhitelistUpdate;