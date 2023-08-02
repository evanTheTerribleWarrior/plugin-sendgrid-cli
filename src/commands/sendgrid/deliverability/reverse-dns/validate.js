const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class ReverseDNSValidate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.validateRDNS()
      this.output(result)
    }

    async validateRDNS() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data;

        const request = {
            url: `${API_PATHS.IPS}/${id}/validate`,
            method: 'POST',
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

ReverseDNSValidate.description = 'Validate reverse DNS'
ReverseDNSValidate.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the reverse DNS record that you would like to validate.', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = ReverseDNSValidate;