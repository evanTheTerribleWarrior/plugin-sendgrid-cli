const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SsoCertificateUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateSsoCertificate()
      this.output(result)
    }

    async updateSsoCertificate() {

        const { headers, ...data } = extractFlags(this.flags);
        const { cert_id, ...dataWithoutCertId} = data;

        const request = {
            url: `${API_PATHS.SSO_CERTIFICATES}/${cert_id}`,
            method: 'PATCH',
            body: dataWithoutCertId,
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

SsoCertificateUpdate.description = 'Update an SSO certificate'
SsoCertificateUpdate.flags = Object.assign(
  { 
    'cert-id': flags.string({description: 'The SSO certificate ID', required: true}),
    'public-certificate': flags.string({description: 'This public certificate allows SendGrid to verify that SAML requests it receives are signed by an IdP that it recognizes', required: true}),
    'enabled': getBoolean('Indicates if the certificate is enabled', false),
    'integration-id': flags.string({description: 'An ID that matches a certificate to a specific IdP integration. This is the id returned by the "Get All SSO Integrations" endpoint', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SsoCertificateUpdate;