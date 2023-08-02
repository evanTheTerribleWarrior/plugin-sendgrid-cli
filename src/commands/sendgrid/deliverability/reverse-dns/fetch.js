const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class ReverseDNSFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchRDNS()
      this.output(result)
    }

    async fetchRDNS() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data

        const request = {
            url: `${API_PATHS.IPS}/${id}`,
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

ReverseDNSFetch.description = 'List a specific reverse DNS record'
ReverseDNSFetch.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the reverse DNS record that you would like to retrieve', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = ReverseDNSFetch;