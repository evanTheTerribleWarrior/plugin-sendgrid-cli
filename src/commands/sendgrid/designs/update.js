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
      const result = await this.updateDesign()
      this.output(result.result)
    }

    async updateDesign() {

        const { headers, ...data } = extractFlags(this.flags)
        const { id, ...dataWithoutId } = data;
          
        const request = {
            url: `${API_PATHS.DESIGNS}/${id}`,
            method: 'PATCH',
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

DesignUpdate.description = 'Update a specific design'
DesignUpdate.flags = Object.assign(
  {
    'id': flags.string({description: 'Required. The ID of the design to update', required: true}),
    'name': flags.string({description: 'Name of the Design', required: false}),
    'html-content': flags.string({description: 'Required. The HTML content of the Design', required: true}),
    'plain-content': flags.string({description: 'Plain text content of the Design', required: false}),
    'generate-plain-content': getBoolean('If set to true, plain_content is always generated from html_content. If false, plain_content is not altered', false),
    'subject': flags.string({description: 'Subject of the Design', required: false}),
    'categories': categories,
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = DesignUpdate;