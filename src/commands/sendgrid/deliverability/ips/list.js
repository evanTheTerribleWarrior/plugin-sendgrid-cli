const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getIpAddress, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class IpList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listIp()
      this.output(result)
    }

    async listIp() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.IP}`,
            method: 'GET',
            qs: data,
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

IpList.description = 'Retrieve a list of all assigned and unassigned IPs'
IpList.flags = Object.assign(
  { 
    'ip': getIpAddress('The IP address to get', false),
    'subuser': flags.string({description: 'The subuser you are requesting for', required: false}),
    'sort-by-direction': flags.enum({description: 'The direction to sort the results', options: ['asc', 'desc'], required: false}),
    'limit': flags.integer({description: 'The number of IPs you want returned at the same time', required: false}),
    'offset': flags.integer({description: 'The offset for the number of IPs that you are requesting', required: false}),
    'exclude-whitelabels': getBoolean('Should we exclude reverse DNS records (whitelabels)?', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpList;