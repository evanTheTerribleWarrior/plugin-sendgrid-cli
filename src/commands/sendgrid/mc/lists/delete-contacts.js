const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCListDeleteContacts extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteListContacts()
      this.output(result)
    }

    async deleteListContacts() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.MC_LISTS}/${id}/contacts`,
            method: 'DELETE',
            qs: dataWithoutId,
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

MCListDeleteContacts.description = 'Remove contacts from a given list'
MCListDeleteContacts.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the Contact List', required: true}),
    'contact-ids': flags.string({description: 'comma separated list of contact ids', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCListDeleteContacts;