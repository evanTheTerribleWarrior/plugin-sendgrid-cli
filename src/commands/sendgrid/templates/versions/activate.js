const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const {extractFlags, getBoolean} = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../../utils/paths');
client.setApiKey(process.env.SG_API_KEY);

class VersionActivate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.activateVersion()
      this.output(result.result)
    }

    async activateVersion() {

        const { headers, ...data } = extractFlags(this.flags);
        const { template_id, version_id } = data;
          
        const request = {
            url: `${API_PATHS.TEMPLATES}/${template_id}/versions/${version_id}/activate`,
            method: 'POST',
            headers: headers
        }

        const [response] = await client.request(request);
        return response.body
          
    }
}

VersionActivate.description = 'Activate a template version'
VersionActivate.flags = Object.assign(
  {
    'template-id': flags.string({description: 'ID of the template', required: true}),
    'version-id': flags.string({description: 'ID of the version', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = VersionActivate;