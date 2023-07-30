const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class DesignsListPreBuilt extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.getDesigns()
      this.output(result.result)
    }

    async getDesigns() {

      const queryParams = {};

      if(this.flags['page-size']) queryParams.page_size = this.flags['page-size']
      if(this.flags['page-token']) queryParams.page_token = this.flags['page-token']
      queryParams.summary = this.flags.summary
          
      const request = {
        url: `/v3/designs/pre-builts`,
        method: 'GET',
        qs: queryParams
      }

      const [response] = await client.request(request);
      return response.body
          
    }
}

DesignsListPreBuilt.description = 'This endpoint allows you to retrieve a list of SendGrid pre-built designs'
DesignsListPreBuilt.flags = Object.assign(
  {
    'page-size': flags.string({description: 'Number of results to return on a single page', required: false}),
    'page-token': flags.string({description: 'Token corresponding to a specific page of results, as provided by metadata', required: false}),
    'summary': flags.boolean({description: 'If set to true, it returns reduced fields (for example no HTML body)', default: false})
  }, BaseCommand.flags)

module.exports = DesignsListPreBuilt;