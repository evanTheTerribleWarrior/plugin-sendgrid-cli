const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class RecipientErase extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.eraseRecipient()
      this.output(result)
    }

    async eraseRecipient() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.RECIPIENT_ERASE}`,
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

RecipientErase.description = 'Erase recipient data'
RecipientErase.flags = Object.assign(
  { 
    'email-addresses': getArrayFlag('List of unique recipient email addresses whose PII will be erased. You may include a maximum of 5,000 addresses or a maximum payload size of 256Kb, whichever comes first', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = RecipientErase;