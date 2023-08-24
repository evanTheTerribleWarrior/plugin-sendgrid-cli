const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength, getArrayFlag  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCSendersCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.create()
      this.output(result)
    }

    async create() {

        const { headers, ...data } = extractFlags(this.flags);

        const body = {
            nickname: data.nickname,
            from: {
                email: data.from_email,
                name: data.from_name
            },
            reply_to: {
                email: data['reply_to_email'],
                name: data['reply_to_name']
            },
            address: data.address,
            address2: data.address2,
            city: data.city,
            zip: data.zip,
            state: data.state,
            country: data.country
        }

        const request = {
            url: `${API_PATHS.MC_SENDERS}`,
            method: 'POST',
            body: body,
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

MCSendersCreate.description = 'Create a new sender identity'
MCSendersCreate.flags = Object.assign(
  { 
    'nickname': flags.string({description: 'A nickname for the sender identity. Not used for sending', required: true}),
    'from-email':flags.string({description: 'This is where the email will appear to originate from for your recipient', required: true}),
    'from-name':flags.string({description: 'This is the name appended to the from email field. IE - Your name or company name', required: true}),
    'reply-to-email':flags.string({description: 'This is the email that your recipient will reply to', required: true}),
    'reply-to-name':flags.string({description: 'This is the name appended to the reply to email field. IE - Your name or company name', required: true}),
    'address':flags.string({description: 'The physical address of the sender identity', required: true}),
    'address2':flags.string({description: 'Additional sender identity address information', required: false}),
    'city':flags.string({description: 'The city of the sender identity', required: true}),
    'state':flags.string({description: 'The state of the sender identity', required: false}),
    'zip':flags.string({description: 'The zipcode of the sender identity', required: false}),
    'country':flags.string({description: 'The country of the sender identity', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCSendersCreate;