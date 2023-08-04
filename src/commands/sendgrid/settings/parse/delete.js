const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class ParseDelete extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteParse()
      this.output(result)
    }

    async deleteParse() {

        const { headers, ...data } = extractFlags(this.flags);
        const { hostname } = data

        const request = {
            url: `${API_PATHS.PARSE_WEBHOOK}/settings/${hostname}`,
            method: 'DELETE',
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

ParseDelete.description = 'Delete an inbound parse setting'
ParseDelete.flags = Object.assign(
  { 
    'hostname': flags.string({description: 'The hostname associated with the inbound parse setting that you would like to delete', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = ParseDelete;