const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SubuserUpdateIp extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateIpSubuser()
      this.output(result)
    }

    async updateIpSubuser() {

        const { headers, ...data } = extractFlags(this.flags);
        const { subuser_name, ips } = data

        const request = {
            url: `${API_PATHS.SUBUSERS}/${subuser_name}/ips`,
            method: 'PUT',
            body: ips,
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

SubuserUpdateIp.description = 'Update your subuser assigned IP'
SubuserUpdateIp.flags = Object.assign(
  { 
    'subuser_name': flags.string({description: 'The username of this subuser', required: true}),
    'ips': getArrayFlag('The IP addresses that should be assigned to this subuser', true)
  }, BaseCommand.flags)

module.exports = SubuserUpdateIp;