const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getIpAddress } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class IpPoolDelete extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteIpPool()
      this.output(result)
    }

    async deleteIpPool() {

        const { headers, ...data } = extractFlags(this.flags);
        const { pool_name } = data;

        const request = {
            url: `${API_PATHS.IP_POOLS}/${pool_name}`,
            method: 'DELETE',
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

IpPoolDelete.description = 'Delete an IP pool'
IpPoolDelete.flags = Object.assign(
  { 
    'pool-name': flags.string({description: 'The name of the pool', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpPoolDelete;