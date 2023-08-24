const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength, getArrayFlag  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCContactFetchEmails extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetch()
      this.output(result)
    }

    async fetch() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MC_CONTACTS}/search/emails`,
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

MCContactFetchEmails.description = 'Fetch a batch of Contacts from the email addresses'
MCContactFetchEmails.flags = Object.assign(
  { 
    'emails': getArrayFlag('One or more primary and/or alternate email addresses to search for in your Marketing Campaigns contacts', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCContactFetchEmails;