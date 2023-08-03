const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class IPAccessRemoveOne extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.removeIP()
      this.output(result)
    }

    async removeIP() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data;

        const request = {
            url: `${API_PATHS.IP_ACCESS_MANAGEMENT}/whitelist/${id}`,
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

IPAccessRemoveOne.description = 'Remove a single IP address from your list of allowed addresses'
IPAccessRemoveOne.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the allowed IP address that you want to retrieve', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IPAccessRemoveOne;