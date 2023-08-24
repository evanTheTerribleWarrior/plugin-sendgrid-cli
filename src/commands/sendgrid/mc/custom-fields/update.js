const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCCustomFieldUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.update()
      this.output(result)
    }

    async update() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutID } = data;

        const request = {
            url: `${API_PATHS.MC_CUSTOM_FIELDS}/${id}`,
            method: 'PATCH',
            body: dataWithoutID,
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

MCCustomFieldUpdate.description = 'Updates custom field definition'
MCCustomFieldUpdate.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the custom field', required: true}),
    'name': getStringWithLength('The name of the custom field', true, 100),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCCustomFieldUpdate;