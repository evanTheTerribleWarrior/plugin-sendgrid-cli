const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class ReverseDNSCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.createRDNS()
      this.output(result)
    }

    async createRDNS() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.IPS}`,
            method: 'POST',
            body: data,
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

ReverseDNSCreate.description = 'Set up reverse DNS'
ReverseDNSCreate.flags = Object.assign(
  { 
    'ip': flags.string({description: 'The IP address for which you want to set up reverse DNS.', required: true}),
    'subdomain': flags.string({description: 'The subdomain that will be used to send emails from the IP address. This should be the same as the subdomain used to set up an authenticated domain.', required: false}),
    'domain': flags.string({description: 'The root, or sending, domain that will be used to send message from the IP address.', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = ReverseDNSCreate;