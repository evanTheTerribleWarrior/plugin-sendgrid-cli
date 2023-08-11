const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class OpenUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateOpenSettings()
      this.output(result)
    }

    async updateOpenSettings() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.TRACKING_SETTINGS}/open`,
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

OpenUpdate.description = 'Update open tracking settings on your account'
OpenUpdate.flags = Object.assign(
  { 
    'enabled': getBoolean('The setting you want to use for open tracking', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = OpenUpdate;