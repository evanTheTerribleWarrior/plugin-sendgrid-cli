const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean, getArrayFlag, getObjectArray } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SsoTeammateCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.createSsoTeammate()
      this.output(result)
    }

    async createSsoTeammate() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.SSO_TEAMMATES}`,
            method: 'POST',
            body: data,
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

SsoTeammateCreate.description = 'Create an SSO Teammate'
SsoTeammateCreate.flags = Object.assign(
  { 
    'email': flags.string({description: 'Set this property to the Teammate\'s email address. This email address will also function as the Teammate\'s username and must match the address assigned to the user in your IdP', required: true}),
    'first-name': flags.string({description: 'Set this property to the Teammate\'s first name', required: true}),
    'last-name': flags.string({description: 'Set this property to the Teammate\'s last name', required: true}),
    'is-admin': getBoolean('Set this property to true if the Teammate has admin permissions', false),
    'has-restricted-subuser-access': getBoolean('Set this property to true to give the Teammate permissions to operate only on behalf of a Subuser. This property value must be true if the subuser_access property is not empty', false),
    'persona': flags.enum({description: 'A persona represents a group of permissions often required by a type of Teammate such as a developer or marketer. Assigning a persona allows you to allocate a group of pre-defined permissions rather than assigning each scope individually', options: ['accountant', 'developer', 'marketer', 'observer'], required: false}),
    'scopes': getArrayFlag('Add or remove permissions from a Teammate using this scopes property', false),
    'subuser-access': getObjectArray('Specify which Subusers the Teammate may access and act on behalf of with this property. If this property is populated, you must set the has_restricted_subuser_access property to true', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SsoTeammateCreate;