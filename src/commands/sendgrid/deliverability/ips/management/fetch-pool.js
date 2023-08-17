const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getIpAddress, getBoolean } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class IpMgmtPoolFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchPool()
      this.output(result)
    }

    async fetchPool() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data;

        const request = {
            url: `${API_PATHS.IP_ADDRESS_MANAGEMENT}/pools/${id}`,
            method: 'GET',
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

IpMgmtPoolFetch.description = 'Returns details for a specific IP pool'
IpMgmtPoolFetch.flags = Object.assign(
  { 
    'id': flags.string({description: 'The Pool ID', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpMgmtPoolFetch;