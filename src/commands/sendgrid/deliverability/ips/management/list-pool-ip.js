const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getArrayFlag } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class IpMgmtPoolListIp extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listIpPool()
      this.output(result)
    }

    async listIpPool() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.IP_ADDRESS_MANAGEMENT}/pools/${id}/ips`,
            method: 'GET',
            qs: dataWithoutId,
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

IpMgmtPoolListIp.description = 'Returns the IP Pools that the specified IP address is assigned to'
IpMgmtPoolListIp.flags = Object.assign(
  { 
    'id': flags.string({description: 'The Pool ID', required: true}),
    'limit': flags.integer({description: 'Specifies the number of results to be returned by the API', required: false}),
    'after-key': flags.integer({description: 'Specifies which items to be returned by the API', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpMgmtPoolListIp;