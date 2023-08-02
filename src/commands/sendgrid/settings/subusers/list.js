const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SubusersList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listSubusers()
      this.output(result)
    }

    async listSubusers() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.SUBUSERS}`,
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

SubusersList.description = 'Retrieve all branded links'
SubusersList.flags = Object.assign(
  { 
    'username': flags.string({description: 'The username of this subuser', required: false}),
    'limit': flags.string({description: 'Limits the number of results returned per page', required: false}),
    'offset': flags.string({description: 'The number of subusers to skip', required: false})
  }, BaseCommand.flags)

module.exports = SubusersList;