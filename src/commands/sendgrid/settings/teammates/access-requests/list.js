const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class TeammateAccessList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listAccessRequests()
      this.output(result)
    }

    async listAccessRequests() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.SCOPES}/requests`,
            method: 'GET',
            qs: data,
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

TeammateAccessList.description = 'Retrieve a list of all recent access requests'
TeammateAccessList.flags = Object.assign(
  { 
    'limit': flags.integer({description: 'Number of teammates to return', required: false}),
    'offset': flags.integer({description: 'Paging offset', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = TeammateAccessList;