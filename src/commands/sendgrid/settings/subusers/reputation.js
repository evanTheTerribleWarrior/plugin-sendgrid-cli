const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SubuserReputation extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.reputationSubuser()
      this.output(result)
    }

    async reputationSubuser() {

        const { headers, ...data } = extractFlags(this.flags);
        
        const request = {
            url: `${API_PATHS.SUBUSERS}/reputations`,
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

SubuserReputation.description = 'Get reputation of subusers'
SubuserReputation.flags = Object.assign(
  { 
    'usernames': flags.string({description: 'The username of the subuser', required: false})
  }, BaseCommand.flags)

module.exports = SubuserReputation;