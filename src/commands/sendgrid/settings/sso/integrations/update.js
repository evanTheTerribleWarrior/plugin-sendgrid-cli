const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SsoIntegrationUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateSsoIntegration()
      this.output(result)
    }

    async updateSsoIntegration() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.SSO_INTEGRATIONS}/${id}`,
            method: 'PATCH',
            body: dataWithoutId,
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

SsoIntegrationUpdate.description = 'Update an SSO integration'
SsoIntegrationUpdate.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the integration', required: true}),
    'si': getBoolean('If this parameter is set to true, the response will include the completed_integration field', true),
    'name': flags.string({description: 'The name of your integration. This name can be anything that makes sense for your organization', required: true}),
    'signin_url': flags.string({description: 'The IdP\'s SAML POST endpoint. This endpoint should receive requests and initiate an SSO login flow. This is called the "Embed Link" in the Twilio SendGrid UI', required: true}),
    'signout_url': flags.string({description: 'This URL is relevant only for an IdP-initiated authentication flow. If a user authenticates from their IdP, this URL will return them to their IdP when logging out', required: true}),
    'enabled': getBoolean('Indicates if the integration is enabled', true),
    'completed-integration': getBoolean('Indicates if the integration is complete', false),
    'entity-id': flags.string({description: 'An identifier provided by your IdP to identify Twilio SendGrid in the SAML interaction. This is called the "SAML Issuer ID" in the Twilio SendGrid UI', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SsoIntegrationUpdate;