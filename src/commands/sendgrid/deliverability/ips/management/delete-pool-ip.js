const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getArrayFlag } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class IpMgmtPoolDeleteIp extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.addIpPool()
      this.output(result)
    }

    async addIpPool() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.IP_ADDRESS_MANAGEMENT}/pools/${id}/ips:batchDelete`,
            method: 'POST',
            body: dataWithoutId,
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

IpMgmtPoolDeleteIp.description = 'Delete an array of IPs from an existing IP Pool'
IpMgmtPoolDeleteIp.flags = Object.assign(
  { 
    'id': flags.string({description: 'The Pool ID', required: true}),
    'ips': getArrayFlag('An array of IP addresses to delete from the specified IP Pool', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpMgmtPoolDeleteIp;