const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SenderRequestUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateSenderRequest()
      this.output(result)
    }

    async updateSenderRequest() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.SENDER_VERIFICATION}/${id}`,
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

SenderRequestUpdate.description = 'Update a Sender Identity'
SenderRequestUpdate.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the sender identity', required: true}),
    'nickname': getStringWithLength('Nickname for the identity', true, 100),
    'from-email': getStringWithLength('Email that will receive the request', true, 256),
    'from-name': getStringWithLength('From name for the request', false, 256),
    'reply-to': getStringWithLength('Reply-to address for the request', true, 256),
    'reply-to-name': getStringWithLength('Reply-to name for the request', false, 256),
    'address': getStringWithLength('Optional address details', false, 100),
    'address2': getStringWithLength('Optional address details', false, 100),
    'state': getStringWithLength('Optional state details', false, 2),
    'city': getStringWithLength('Optional city details', false, 150),
    'zip': getStringWithLength('Optional zip code details', false, 10),
    'country': getStringWithLength('Optional country details', false, 100),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SenderRequestUpdate;