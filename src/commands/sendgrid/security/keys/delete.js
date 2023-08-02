const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const {extractFlags} = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class KeyDelete extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteKey()
      this.output(result)
    }

    async deleteKey() {

        const { headers, ...data } = extractFlags(this.flags);
        
        const request = {
            url: `${API_PATHS.API_KEYS}/${data.id}`,
            method: 'DELETE',
            headers: headers
        }

        try {
            const [response] = await client.request(request);
            return {
                "success": "The API Key was successfully deleted"
            }
        } catch (error) {
            return error
        }    
    }
}

KeyDelete.description = 'Delete a single API Key'
KeyDelete.flags = Object.assign(
  {
    'id': flags.string({description: 'The ID of the API Key', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = KeyDelete;