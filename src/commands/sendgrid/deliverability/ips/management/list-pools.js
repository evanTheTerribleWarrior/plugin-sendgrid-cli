const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getIpAddress, getBoolean } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class IpMgmtPoolsList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listPools()
      this.output(result)
    }

    async listPools() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.IP_ADDRESS_MANAGEMENT}/pools`,
            method: 'GET',
            qs: data,
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

IpMgmtPoolsList.description = 'Returns a list of your IP Pools and a sample of each Pools\' associated IP addresses'
IpMgmtPoolsList.flags = Object.assign(
  { 
    'ip': getIpAddress('The IP address to get', false),
    'limit': flags.integer({description: 'Specifies the number of results to be returned by the API', required: false}),
    'after-key': flags.integer({description: 'Specifies which items to be returned by the API', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpMgmtPoolsList;