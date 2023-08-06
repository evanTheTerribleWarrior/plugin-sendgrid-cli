const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class TeammateUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateTeammate()
      this.output(result)
    }

    async updateTeammate() {

        const { headers, ...data } = extractFlags(this.flags);
        const { username, ...dataWithoutUsername} = data;

        const request = {
            url: `${API_PATHS.TEAMMATES}/${username}`,
            method: 'PATCH',
            body: dataWithoutUsername,
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

TeammateUpdate.description = 'Update a specific Teammate'
TeammateUpdate.flags = Object.assign(
  { 
    'scopes': getArrayFlag('Set to specify list of scopes that teammate should have. Should be empty if teammate is an admin', true),
    'is-admin': getBoolean('Set to true if teammate should be an admin user', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = TeammateUpdate;