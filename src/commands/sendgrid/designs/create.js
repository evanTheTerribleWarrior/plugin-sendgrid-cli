const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const { categories } = require('../../../utils/common-flags')
const {extractFlags, getBoolean} = require('../../../utils/functions');
const API_PATHS = require('../../../utils/paths')
require('dotenv').config()
const client = require('@sendgrid/client');

class DesignUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.createDesign()
      this.output(result.result)
    }

    async createDesign() {

        const {headers, ...data} = extractFlags(this.flags)
          
        const request = {
            url: `${API_PATHS.DESIGNS}`,
            method: 'POST',
            body: data,
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

DesignUpdate.description = 'Update a specific design'
DesignUpdate.flags = Object.assign(
  {
    'name': flags.string({description: 'Name of the Design', required: true}),
    'html-content': flags.string({description: 'The HTML content of the Design', required: true}),
    'plain-content': flags.string({description: 'Plain text content of the Design', required: false}),
    'generate-plain-content': getBoolean('If set to true, plain_content is always generated from html_content. If false, plain_content is not altered', false),
    'subject': flags.string({description: 'Subject of the Design', required: false}),
    'categories': categories,
    'editor': flags.enum({description: 'The editor used in the UI', options: ['code', 'design'], required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = DesignUpdate;