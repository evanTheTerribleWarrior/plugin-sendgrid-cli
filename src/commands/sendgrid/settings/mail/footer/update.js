const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class FooterUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateFooterSettings()
      this.output(result)
    }

    async updateFooterSettings() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MAIL_SETTINGS}/footer`,
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

FooterUpdate.description = 'Update your current Footer mail settings'
FooterUpdate.flags = Object.assign(
  { 
    'enabled': getBoolean('Indicates if the Footer mail setting is currently enabled', false),
    'html-content': flags.string({description: 'The custom HTML content of your email footer', required: false}),
    'plain-content': flags.string({description: 'The plain text content of your email footer', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = FooterUpdate;