const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getIpAddress, getBoolean } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class IpMgmtUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateIp()
      this.output(result)
    }

    async updateIp() {

        const { headers, ...data } = extractFlags(this.flags);
        const { ip, ...dataWithoutIp } = data;

        const request = {
            url: `${API_PATHS.IP_ADDRESS_MANAGEMENT}/ips/${ip}`,
            method: 'PATCH',
            body: dataWithoutIp,
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

IpMgmtUpdate.description = 'Updates a specific IP address'
IpMgmtUpdate.flags = Object.assign(
  { 
    'ip': getIpAddress('The IP address to get', true),
    'is-auto-warmup': getBoolean('Indicates if the IP address is set to automatically warmup', false),
    'is-parent-assigned': getBoolean('Indicates if a parent on the account is able to send email from the IP address', false),
    'is-enabled': getBoolean('Indicates if the IP address is billed and able to send email', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpMgmtUpdate;