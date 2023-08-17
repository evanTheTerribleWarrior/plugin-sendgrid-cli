const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const {extractFlags} = require('../../../utils/functions');
const API_PATHS = require('../../../utils/paths')
require('dotenv').config()
const client = require('@sendgrid/client');

class DesignFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchDesign()
      this.output(result)
    }

    async fetchDesign() {

      const { headers, ...data } = extractFlags(this.flags);
      const { id } = data;
          
      const request = {
        url: `${API_PATHS.DESIGNS}/${id}`,
        method: 'GET',
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

DesignFetch.description = 'Fetch a single Design from your Design Library'
DesignFetch.flags = Object.assign(
  {
    'id': flags.string({description: 'The ID of the design', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = DesignFetch;