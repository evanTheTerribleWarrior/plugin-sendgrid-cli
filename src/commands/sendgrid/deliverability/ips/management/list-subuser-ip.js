const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getIpAddress } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class IpMgmtSubuserListIp extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listIpSubusers()
      this.output(result)
    }

    async listIpSubusers() {

        const { headers, ...data } = extractFlags(this.flags);
        const { ip, ...dataWithoutIp } = data;

        const request = {
            url: `${API_PATHS.IP_ADDRESS_MANAGEMENT}/ips/${ip}/subusers`,
            method: 'GET',
            qs: dataWithoutIp,
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

IpMgmtSubuserListIp.description = 'Returns a list of Subuser IDs that have been assigned the specified IP address'
IpMgmtSubuserListIp.flags = Object.assign(
  { 
    'ip': getIpAddress('The ip path parameter specifies an IP address to make the request against', true),
    'limit': flags.integer({description: 'Specifies the number of results to be returned by the API', required: false}),
    'after-key': flags.integer({description: 'Specifies which items to be returned by the API', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpMgmtSubuserListIp;