const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const {extractFlags, getBoolean} = require('../../../utils/functions');
const API_PATHS = require('../../../utils/paths')
require('dotenv').config()
const client = require('@sendgrid/client');

class DesignsList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.getDesigns()
      this.output(result.result)
    }

    async getDesigns() {

      const { headers, ...data } = extractFlags(this.flags);
          
      const request = {
        url: `${API_PATHS.DESIGNS}`,
        method: 'GET',
        qs: data,
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

DesignsList.description = 'This endpoint allows you to retrieve a list of designs already stored in your Design Library'
DesignsList.flags = Object.assign(
  {
    'page-size': flags.string({description: 'Number of results to return on a single page', required: false}),
    'page-token': flags.string({description: 'Token corresponding to a specific page of results, as provided by metadata', required: false}),
    'summary': getBoolean('If set to true, it returns reduced fields (for example no HTML body)', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = DesignsList;