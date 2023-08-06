const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SsoCertificateDelete extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteSsoCertificate()
      this.output(result)
    }

    async deleteSsoCertificate() {

        const { headers, ...data } = extractFlags(this.flags);
        const { cert_id } = data;

        const request = {
            url: `${API_PATHS.SSO_CERTIFICATES}/${cert_id}`,
            method: 'DELETE',
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

SsoCertificateDelete.description = 'Delete an individual SSO certificate'
SsoCertificateDelete.flags = Object.assign(
  { 
    'cert-id': flags.string({description: 'An SSO certificate ID', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SsoCertificateDelete;