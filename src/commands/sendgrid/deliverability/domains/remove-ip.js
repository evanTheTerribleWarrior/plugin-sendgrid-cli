const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class DomainRemoveIp extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.removeIp()
      this.output(result)
    }

    async removeIp() {

        const { headers, ...data } = extractFlags(this.flags);
        const {id, ip} = data;

        const request = {
            url: `${API_PATHS.DOMAINS}/${id}/ips/${ip}`,
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

DomainRemoveIp.description = 'Remove an IP from a domain'
DomainRemoveIp.flags = Object.assign(
  { 
    'id': flags.string({description: 'ID of the domain to delete the IP from', required: true}),
    'ip': flags.string({description: 'IP to remove from the domain', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = DomainRemoveIp;