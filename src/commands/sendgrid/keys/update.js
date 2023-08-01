const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const { scopes } = require('../../../utils/common-flags')
const API_PATHS = require('../../../utils/paths');
const extractFlags = require('../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class KeyUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateKey()
      this.output(result)
    }

    async updateKey() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;
          
        const request = {
            url: `${API_PATHS.API_KEYS}/${id}`,
            method: data.scopes? 'PUT': 'PATCH',
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

KeyUpdate.description = 'Update an API Key'
KeyUpdate.flags = Object.assign(
  {
    'id': flags.string({description: 'ID of your API Key', required: true}),
    'name': flags.string({description: 'Updated name of the API Key', required: false}),
    'scopes': scopes,
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = KeyUpdate;