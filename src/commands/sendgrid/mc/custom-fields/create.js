const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCCustomFieldCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.create()
      this.output(result)
    }

    async create() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MC_CUSTOM_FIELDS}`,
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

MCCustomFieldCreate.description = 'Creates a new custom field definition'
MCCustomFieldCreate.flags = Object.assign(
  { 
    'name': getStringWithLength('The name of the custom field', true, 100),
    'field-type': flags.enum({description: 'The type of the custom field', options: ['Text','Date', 'Number'], required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCCustomFieldCreate;