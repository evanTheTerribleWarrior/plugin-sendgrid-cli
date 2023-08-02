const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const {extractFlags} = require('../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class DesignsList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.getDesigns()
      this.output(result.result)
    }

    async getDesigns() {

      const data = extractFlags(this.flags)
          
      const request = {
        url: `/v3/designs`,
        method: 'GET',
        qs: data
      }

      const [response] = await client.request(request);
      return response.body
          
    }
}

DesignsList.description = 'This endpoint allows you to retrieve a list of designs already stored in your Design Library'
DesignsList.flags = Object.assign(
  {
    'page-size': flags.string({description: 'Number of results to return on a single page', required: false}),
    'page-token': flags.string({description: 'Token corresponding to a specific page of results, as provided by metadata', required: false}),
    'summary': flags.boolean({description: 'If set to true, it returns reduced fields (for example no HTML body)', default: false})
  }, BaseCommand.flags)

module.exports = DesignsList;