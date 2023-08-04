const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class CnameEmail extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.emailCname()
      this.output(result)
    }

    async emailCname() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `/v3/whitelabel/dns/email`,
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

CnameEmail.description = 'Share DNS records with a colleague'
CnameEmail.flags = Object.assign(
  { 
    'link-id': flags.integer({description: 'The ID of the branded link', required: false}),
    'domain-id': flags.integer({description: 'The ID of the domain record', required: false}),
    'email': flags.string({description: 'The email address to send the DNS information to', required: true}),
    'message': flags.string({description: 'A custom text block to include in the email body sent with the records', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = CnameEmail;