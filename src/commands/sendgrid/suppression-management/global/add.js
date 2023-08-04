const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SuppressionGlobalAdd extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.addSuppressionGlobal()
      this.output(result)
    }

    async addSuppressionGlobal() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.SUPPRESION}/global`,
            method: 'POST',
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

SuppressionGlobalAdd.description = 'Add one or more email addresses to the global suppressions group'
SuppressionGlobalAdd.flags = Object.assign(
  { 
    'recipient_emails': getArrayFlag('The array of email addresses to add or find', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SuppressionGlobalAdd;