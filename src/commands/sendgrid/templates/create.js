const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const {extractFlags} = require('../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../utils/paths');
client.setApiKey(process.env.SG_API_KEY);

class TemplateCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.createTemplate()
      this.output(result.result)
    }

    async createTemplate() {

        const { headers, ...data } = extractFlags(this.flags);
          
        const request = {
            url: `${API_PATHS.TEMPLATES}`,
            method: 'POST',
            body: data,
            headers: headers
        }

        const [response] = await client.request(request);
        return response.body
          
    }
}

TemplateCreate.description = 'Create a new empty transactional template'
TemplateCreate.flags = Object.assign(
  {
    'name': flags.string({description: 'Name of the template', required: true}),
    'generation': flags.enum({description: 'Defines whether the template supports dynamic replacement', options: ['legacy', 'dynamic'], required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = TemplateCreate;