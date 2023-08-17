const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getArrayFlag, getIpAddress } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class IpMgmtSubuserDeleteIp extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteSubuserIp()
      this.output(result)
    }

    async deleteSubuserIp() {

        const { headers, ...data } = extractFlags(this.flags);
        const { ip, ...dataWithoutIp } = data;

        const request = {
            url: `${API_PATHS.IP_ADDRESS_MANAGEMENT}/ips/${ip}/subusers:batchDelete`,
            method: 'POST',
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

IpMgmtSubuserDeleteIp.description = 'Delete an array of subusers from an IP address'
IpMgmtSubuserDeleteIp.flags = Object.assign(
  { 
    'ip': getIpAddress('The ip path parameter specifies an IP address to make the request against.', true),
    'subusers': getArrayFlag('An array of Subuser IDs to be deleted from the specified IP address', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpMgmtSubuserDeleteIp;