const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const {extractFlags} = require('../../../utils/functions');
const API_PATHS = require('../../../utils/paths')
require('dotenv').config()
const client = require('@sendgrid/client');

class DesignDuplicate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.duplicateDesign()
      this.output(result)
    }

    async duplicateDesign() {

      const {headers, ...data} = extractFlags(this.flags)
      const { id, ...dataWithoutId} = data
          
      const request = {
        url: `${API_PATHS.DESIGNS}/${id}`,
        method: 'POST',
        body: dataWithoutId,
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

DesignDuplicate.description = 'Duplicate a single Design from your Design Library'
DesignDuplicate.flags = Object.assign(
  {
    'id': flags.string({description: 'The ID of the design', required: true}),
    'name': flags.string({description: 'The name of the new design. If omitted, the original design name will be used', required: false}),
    'editor': flags.enum({description: 'The editor used in the UI', options: ['code', 'design'], required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = DesignDuplicate;