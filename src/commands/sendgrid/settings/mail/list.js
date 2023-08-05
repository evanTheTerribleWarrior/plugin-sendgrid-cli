const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class MailSettingsList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listMailSettings()
      this.output(result)
    }

    async listMailSettings() {

        const { headers, ...data } = extractFlags(this.flags);
        console.log(data)

        const request = {
            url: `${API_PATHS.MAIL_SETTINGS}`,
            method: 'GET',
            qs: data,
            headers: headers
        }

        try {
            const [response] = await client.request(request);
            return response.body.result
        } catch (error) {
            return error
        }    
    }
}

MailSettingsList.description = 'Retrieve a list of all mail settings'
MailSettingsList.flags = Object.assign(
  { 
    'limit': flags.integer({description: 'The number of settings to return', required: false}),
    'offset': flags.integer({description: 'Where in the list of results to begin displaying settings', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MailSettingsList;