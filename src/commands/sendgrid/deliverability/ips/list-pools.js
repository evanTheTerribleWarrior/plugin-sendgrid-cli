const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getIpAddress } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class IpListPools extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listIpPools()
      this.output(result)
    }

    async listIpPools() {

        const { headers, ...data } = extractFlags(this.flags);
        const { ip_address } = data

        const request = {
            url: `${API_PATHS.IP}/${ip_address}`,
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

IpListPools.description = 'See which IP pools a particular IP address has been added to'
IpListPools.flags = Object.assign(
  { 
    'ip-address': getIpAddress('The IP address you are retrieving the IP pools for', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpListPools;