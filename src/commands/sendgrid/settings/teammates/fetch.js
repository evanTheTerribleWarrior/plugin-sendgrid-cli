const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class TeammateFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchTeammate()
      this.output(result)
    }

    async fetchTeammate() {

        const { headers, ...data } = extractFlags(this.flags);
        const { username } = data;

        const request = {
            url: `${API_PATHS.TEAMMATES}/${username}`,
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

TeammateFetch.description = 'Retrieve a specific Teammate'
TeammateFetch.flags = Object.assign(
  { 
    'username': flags.string({description: 'The username of the teammate you want to retrieve', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = TeammateFetch;