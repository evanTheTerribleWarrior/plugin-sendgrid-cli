const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SubuserDelete extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteSubuser()
      this.output(result)
    }

    async deleteSubuser() {

        const { headers, ...data } = extractFlags(this.flags);
        const { subuser_name } = data;
        
        const request = {
            url: `${API_PATHS.SUBUSERS}/${subuser_name}`,
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

SubuserDelete.description = 'Delete a subuser'
SubuserDelete.flags = Object.assign(
  { 
    'subuser_name': flags.string({description: 'The username of the subuser', required: true})
  }, BaseCommand.flags)

module.exports = SubuserDelete;