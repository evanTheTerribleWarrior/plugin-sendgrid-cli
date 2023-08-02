const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class IPAccessManagementAdd extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.addIps()
      this.output(result)
    }

    async addIps() {

        const { headers, ...data } = extractFlags(this.flags);

        const ipObjectsArray = data.ips.map((ip) => {
            return { ip };
        });

        const ipsArray = { "ips": ipObjectsArray}

        const request = {
            url: `${API_PATHS.IP_ACCESS_MANAGEMENT}/whitelist`,
            method: 'POST',
            body: ipsArray,
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

IPAccessManagementAdd.description = 'Add IPs to your allowlist to control which IP addresses can be used to access your account'
IPAccessManagementAdd.flags = Object.assign(
  { 
    'ips': getArrayFlag('An array containing the IP(s) you want to allow', true)
  }, BaseCommand.flags)

module.exports = IPAccessManagementAdd;