const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class IPAccessRemoveMultiple extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.removeIPs()
      this.output(result)
    }

    async removeIPs() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.IP_ACCESS_MANAGEMENT}/whitelist`,
            method: 'DELETE',
            body: data,
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

IPAccessRemoveMultiple.description = 'Remove one or more IP addresses from your list of allowed addresses'
IPAccessRemoveMultiple.flags = Object.assign(
  { 
    'ids': getArrayFlag('An array of the IDs of the IP address that you want to remove from your allow list', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IPAccessRemoveMultiple;