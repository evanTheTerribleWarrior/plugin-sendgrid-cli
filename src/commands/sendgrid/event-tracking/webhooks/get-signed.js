const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class EventWebhookGetSigned extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.getSignedEventWebhook()
      this.output(result)
    }

    async getSignedEventWebhook() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data;

        const request = {
            url: `${API_PATHS.EVENT_WEBHOOK}/settings/signed/${id}`,
            method: 'GET',
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

EventWebhookGetSigned.description = 'Retrieve the public key for a single Event Webhook by ID'
EventWebhookGetSigned.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the Event Webhook you want to fetch', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = EventWebhookGetSigned;