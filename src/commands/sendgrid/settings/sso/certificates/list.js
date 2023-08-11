const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SsoCertificateList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listSsoCertificate()
      this.output(result)
    }

    async listSsoCertificate() {

        const { headers, ...data } = extractFlags(this.flags);
        const { integration_id } = data;

        const request = {
            url: `${API_PATHS.SSO_INTEGRATIONS}/${integration_id}/certificates`,
            method: 'GET',
            headers: headers
        }

        try {
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error
        }    
    }
}

SsoCertificateList.description = 'Retrieve all your IdP configurations by configuration ID'
SsoCertificateList.flags = Object.assign(
  { 
    'integration-id': flags.string({description: 'An ID that matches a certificate to a specific IdP integration', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SsoCertificateList;