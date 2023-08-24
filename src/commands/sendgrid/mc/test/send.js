const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength, getArrayFlag  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCTestSend extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.create()
      this.output(result)
    }

    async create() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MC_TEST}`,
            method: 'POST',
            body: data,
            headers: headers
        }

        try {
            client.setApiKey(process.env.SG_API_KEY);
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error
        }    
    }
}

MCTestSend.description = 'Send a test marketing email to a list of email addresses'
MCTestSend.flags = Object.assign(
  { 
    'template-id': flags.string({description: 'The ID of the template that you would like to use', required: true}),
    'version-id-overrid':flags.string({description: 'You can override the active template with an alternative template version by passing the version ID in this field', required: false}),
    'sender-id':flags.integer({description: 'This ID must belong to a verified sender. Alternatively, you may supply a from_address email', required: false}),
    'custom-unsubscribe-url':flags.string({description: 'A custom unsubscribe URL to be used', required: false}),
    'suppression-group-id':flags.integer({description: 'Suppression group to be used', required: false}),
    'emails': getArrayFlag('An array of email addresses you want to send the test message to', true),
    'from-address':flags.string({description: 'You can either specify this address or specify a verified sender ID', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCTestSend;