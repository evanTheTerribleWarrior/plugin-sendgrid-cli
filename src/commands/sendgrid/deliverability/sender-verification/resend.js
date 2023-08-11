const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SenderRequestResend extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.verifySenderRequest()
      this.output(result)
    }

    async verifySenderRequest() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data;

        const request = {
            url: `${API_PATHS.SENDER_VERIFICATION}/resend/${id}`,
            method: 'POST',
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

SenderRequestResend.description = 'Resend a new Sender Identity request'
SenderRequestResend.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the sender identity request', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SenderRequestResend;