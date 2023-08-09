const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const { categories } = require('../../../utils/common-flags')
const {extractFlags} = require('../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../utils/paths');
client.setApiKey(process.env.SG_API_KEY);

class TemplateList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listTemplates()
      this.output(result.result)
    }

    async listTemplates() {

        const { headers, ...data } = extractFlags(this.flags);
          
        const request = {
            url: `${API_PATHS.TEMPLATES}`,
            method: 'GET',
            qs: data,
            headers: headers
        }

        const [response] = await client.request(request);
        return response.body
          
    }
}

TemplateList.description = 'List paged transactional templates'
TemplateList.flags = Object.assign(
  {
    'generations': flags.enum({description: 'Comma-delimited list specifying which generations of templates to return', options: ['legacy', 'dynamic'],required: false}),
    'page-size': flags.integer({description: 'The number of templates to be returned in each page of results', required: true}),
    'page-token': flags.string({description: 'A token corresponding to a specific page of results, as provided by metadata', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = TemplateList;