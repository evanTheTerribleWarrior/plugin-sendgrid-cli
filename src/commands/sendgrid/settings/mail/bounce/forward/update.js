const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class ForwardBounceUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listForwardBounce()
      this.output(result)
    }

    async listForwardBounce() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MAIL_SETTINGS}/forward_bounce`,
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

ForwardBounceUpdate.description = 'Update your current forward bounce settings'
ForwardBounceUpdate.flags = Object.assign(
  { 
    'enabled': getBoolean('Indicates if the bounce purge mail setting is enabled', false),
    'email': flags.string({description: 'The email address that you would like your bounce reports forwarded to', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = ForwardBounceUpdate;