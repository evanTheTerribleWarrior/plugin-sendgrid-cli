const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getIpAddress } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class IpWarmupFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchWarmupIP()
      this.output(result)
    }

    async fetchWarmupIP() {

        const { headers, ...data } = extractFlags(this.flags);
        const { ip_address } = data

        const request = {
            url: `${API_PATHS.IP_WARMUP}/${ip_address}`,
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

IpWarmupFetch.description = 'Retrieve the warmup status for a specific IP address'
IpWarmupFetch.flags = Object.assign(
  { 
    'ip-address': getIpAddress('The IP address that you want to retrieve the warmup status for', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpWarmupFetch;