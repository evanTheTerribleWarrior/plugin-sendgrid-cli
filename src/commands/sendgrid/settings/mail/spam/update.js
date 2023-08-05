const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SpamUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.spamSettings()
      this.output(result)
    }

    async spamSettings() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MAIL_SETTINGS}/forward_spam`,
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

SpamUpdate.description = 'Update your current Forward Spam mail settings'
SpamUpdate.flags = Object.assign(
  { 
    'enabled': getBoolean('Indicates if the Forward Spam setting is enabled', false),
    'email': flags.string({description: 'The email address where you would like the spam reports to be forwarded', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SpamUpdate;