const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class IPAccessFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchIP()
      this.output(result)
    }

    async fetchIP() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data;

        const request = {
            url: `${API_PATHS.IP_ACCESS_MANAGEMENT}/whitelist/${id}`,
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

IPAccessFetch.description = 'Fetch specific whitelisted IP address'
IPAccessFetch.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the allowed IP address that you want to retrieve', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IPAccessFetch;