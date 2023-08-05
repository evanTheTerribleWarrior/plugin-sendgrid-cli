const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class BouncePurgeUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listBouncePurge()
      this.output(result)
    }

    async listBouncePurge() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MAIL_SETTINGS}/bounce_purge`,
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

BouncePurgeUpdate.description = 'Update your current bounce and purge settings'
BouncePurgeUpdate.flags = Object.assign(
  { 
    'enabled': getBoolean('Indicates if the bounce purge mail setting is enabled', false),
    'soft-bounces': flags.integer({description: 'The number of days after which SendGrid will purge all contacts from your soft bounces suppression lists', required: false}),
    'hard-bounces': flags.integer({description: 'The number of days after which SendGrid will purge all contacts from your hard bounces suppression lists', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = BouncePurgeUpdate;