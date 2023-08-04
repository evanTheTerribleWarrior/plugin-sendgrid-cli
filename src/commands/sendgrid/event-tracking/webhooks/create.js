const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class EventWebhookCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.createEventWebhook()
      this.output(result)
    }

    async createEventWebhook() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.EVENT_WEBHOOK}/settings`,
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

EventWebhookCreate.description = 'Create an Event Webhook'
EventWebhookCreate.flags = Object.assign(
  { 
    'enabled': getBoolean('Set this property to true to enable the Event Webhook or false to disable it', false),
    'url': flags.string({description: 'Set this property to the URL where you want the Event Webhook to send event data', required: true}),
    'group-resubscribe': getBoolean('Set this property to true to receive group resubscribe events', false),
    'group-unsubscribe': getBoolean('Set this property to true to receive group unsubscribe events', false),
    'delivered': getBoolean('Set this property to true to receive delivered events', false),
    'spam-report': getBoolean('Set this property to true to receive spam report events', false),
    'bounce': getBoolean('Set this property to true to receive bounce events', false),
    'deferred': getBoolean('Set this property to true to receive deferred events', false),
    'unsubscribe': getBoolean('Set this property to true to receive unsubscribe events', false),
    'processed': getBoolean('Set this property to true to receive processed events', false),
    'open': getBoolean('Set this property to true to receive open events', false),
    'click': getBoolean('Set this property to true to receive click events', false),
    'dropped': getBoolean('Set this property to true to receive dropped events', false),
    'friendly-name': flags.string({description: 'Optionally set this property to a friendly name for the Event Webhook', required: false}),
    'oauth-client-id': flags.string({description: 'Set this property to the OAuth client ID that SendGrid will pass to your OAuth server or service provider to generate an OAuth access token', required: false}),
    'oauth-client-secret': flags.string({description: 'Set this property to the OAuth client secret that SendGrid will pass to your OAuth server or service provider to generate an OAuth access token', required: false}),
    'oauth-token-url': flags.string({description: 'Set this property to the URL where SendGrid will send the OAuth client ID and client secret to generate an OAuth access token', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = EventWebhookCreate;