const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class TemplateUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.legacyTemplateUpdate()
      this.output(result)
    }

    async legacyTemplateUpdate() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MAIL_SETTINGS}/template`,
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

TemplateUpdate.description = 'Update your current legacy email template settings'
TemplateUpdate.flags = Object.assign(
  { 
    'enabled': getBoolean('Indicates if you want to enable the legacy email template mail setting', false),
    'html-content': flags.string({description: 'The new HTML content for your legacy email template', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = TemplateUpdate;