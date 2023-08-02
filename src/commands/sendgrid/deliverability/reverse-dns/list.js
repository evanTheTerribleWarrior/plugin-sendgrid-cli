const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class ReverseDNSList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listRDNS()
      this.output(result)
    }

    async listRDNS() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.IPS}`,
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

ReverseDNSList.description = 'List all reverse DNS records'
ReverseDNSList.flags = Object.assign(
  { 
    'limit': flags.string({description: 'The maximum number of results to retrieve', required: false}),
    'offset': flags.string({description: 'The point in the list of results to begin retrieving IP addresses from', required: false}),
    'ip': flags.string({description: 'The IP address segment that you\'d like to use in a prefix search', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = ReverseDNSList;