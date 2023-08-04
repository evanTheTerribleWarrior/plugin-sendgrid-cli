const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class EventWebhookTest extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.testEventWebhook()
      this.output(result)
    }

    async testEventWebhook() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.EVENT_WEBHOOK}/test`,
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

EventWebhookTest.description = 'Test an Event Webhook'
EventWebhookTest.flags = Object.assign(
  { 
    'id': flags.string({description: 'The id of the event webhook to update', required: false}),
    'url': flags.string({description: 'Set this property to the URL where you want the Event Webhook to send event data', required: true}),
    'oauth-client-id': flags.string({description: 'Set this property to the OAuth client ID that SendGrid will pass to your OAuth server or service provider to generate an OAuth access token', required: false}),
    'oauth-client-secret': flags.string({description: 'Set this property to the OAuth client secret that SendGrid will pass to your OAuth server or service provider to generate an OAuth access token', required: false}),
    'oauth-token-url': flags.string({description: 'Set this property to the URL where SendGrid will send the OAuth client ID and client secret to generate an OAuth access token', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = EventWebhookTest;