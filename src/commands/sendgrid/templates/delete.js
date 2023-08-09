const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const { categories } = require('../../../utils/common-flags')
const {extractFlags} = require('../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../utils/paths');
client.setApiKey(process.env.SG_API_KEY);

class TemplateDelete extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteTemplate()
      this.output(result.result)
    }

    async deleteTemplate() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data;
          
        const request = {
            url: `${API_PATHS.TEMPLATES}/${id}`,
            method: 'DELETE',
            headers: headers
        }

        const [response] = await client.request(request);
        return response.body
          
    }
}

TemplateDelete.description = 'Delete a single transactional template'
TemplateDelete.flags = Object.assign(
  {
    'id': flags.string({description: 'The ID of the template to delete', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = TemplateDelete;