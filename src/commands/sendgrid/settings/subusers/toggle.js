const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SubuserToggle extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.toggleSubuser()
      this.output(result)
    }

    async toggleSubuser() {

        const { headers, ...data } = extractFlags(this.flags);
        const { subuser_name, ...disabled } = data;
        
        const request = {
            url: `${API_PATHS.SUBUSERS}/${subuser_name}`,
            method: 'PATCH',
            body: disabled,
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

SubuserToggle.description = 'Enable or disable a subuser'
SubuserToggle.flags = Object.assign(
  { 
    'subuser_name': flags.string({description: 'The username of the subuser', required: true}),
    'disabled': flags.boolean({description: 'Whether or not this subuser is disabled. True means disabled, False means enabled', default: false})
  }, BaseCommand.flags)

module.exports = SubuserToggle;