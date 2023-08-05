const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getIpAddress, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class IpListAssigned extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listAssignedIp()
      this.output(result)
    }

    async listAssignedIp() {

        const { headers } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.IP}/assigned`,
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

IpListAssigned.description = 'Retrieve only assigned IP addresses'
IpListAssigned.flags = Object.assign(
  { 
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpListAssigned;