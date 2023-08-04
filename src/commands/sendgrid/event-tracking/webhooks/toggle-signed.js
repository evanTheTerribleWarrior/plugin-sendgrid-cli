const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class EventWebhookToggleSigned extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.toggledSignedEventWebhook()
      this.output(result)
    }

    async toggledSignedEventWebhook() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.EVENT_WEBHOOK}/settings/signed/${id}`,
            method: 'PATCH',
            body: dataWithoutId,
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

EventWebhookToggleSigned.description = 'Enable or disable signature verification for a single Event Webhook by ID'
EventWebhookToggleSigned.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the Event Webhook you want to fetch', required: true}),
    'enabled': getBoolean('Enable or disable the webhook by setting this property to true or false, respectively', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = EventWebhookToggleSigned;