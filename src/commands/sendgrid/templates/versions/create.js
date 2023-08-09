const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const {extractFlags, getBoolean} = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../../utils/paths');
client.setApiKey(process.env.SG_API_KEY);

class VersionCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.createVersion()
      this.output(result.result)
    }

    async createVersion() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, dataWithoutId } = data;
          
        const request = {
            url: `${API_PATHS.TEMPLATES}/${id}/versions`,
            method: 'POST',
            body: dataWithoutId,
            headers: headers
        }

        const [response] = await client.request(request);
        return response.body
          
    }
}

VersionCreate.description = 'Create a new template version'
VersionCreate.flags = Object.assign(
  {
    'id': flags.string({description: 'ID of the template', required: true}),
    'active': flags.enum({description: 'Set the version as the active version associated with the template', options: [0, 1], required: false}),
    'name': flags.string({description: 'Name of the transactional template version', required: true}),
    'html-content': flags.string({description: 'The HTML content of the version. Maximum of 1048576 bytes allowed', required: false}),
    'plain-content': flags.string({description: 'Text/plain content of the transactional template version. Maximum of 1048576 bytes allowed', required: false}),
    'generate-plain-content': getBoolean('If true, plain_content is always generated from html_content. If false, plain_content is not altered', false),
    'subject': flags.string({description: 'Subject of the new transactional template version', required: true}),
    'test-data': flags.string({description: 'For dynamic templates only, the mock json data that will be used for template preview and test sends', required: false}),
    'editor': flags.enum({description: 'The editor used in the UI', options: ['code', 'design'], required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = VersionCreate;