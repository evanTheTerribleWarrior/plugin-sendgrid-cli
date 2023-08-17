const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getIpAddress, getBoolean } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class IpMgmtFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchIp()
      this.output(result)
    }

    async fetchIp() {

        const { headers, ...data } = extractFlags(this.flags);
        const { ip } = data;

        const request = {
            url: `${API_PATHS.IP_ADDRESS_MANAGEMENT}/ips/${ip}`,
            method: 'GET',
            headers: headers
        }

        try {
            client.setApiKey(process.env.SG_API_KEY);
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error
        }    
    }
}

IpMgmtFetch.description = 'Returns details of a specific IP address'
IpMgmtFetch.flags = Object.assign(
  { 
    'ip': getIpAddress('The IP address to get', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpMgmtFetch;