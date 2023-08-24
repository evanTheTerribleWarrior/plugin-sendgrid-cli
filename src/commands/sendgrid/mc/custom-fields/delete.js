const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCCustomFieldDelete extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.delete()
      this.output(result)
    }

    async delete() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data;

        const request = {
            url: `${API_PATHS.MC_CUSTOM_FIELDS}/${id}`,
            method: 'DELETE',
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

MCCustomFieldDelete.description = 'Deletes custom field definition'
MCCustomFieldDelete.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the custom field', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCCustomFieldDelete;