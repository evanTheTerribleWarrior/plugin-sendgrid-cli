const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class DomainAddIp extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.addIp()
      this.output(result)
    }

    async addIp() {

        const { headers, ...data } = extractFlags(this.flags);
        const {id, ...dataWithoutId} = data;

        const request = {
            url: `${API_PATHS.DOMAINS}/${id}/ips`,
            method: 'POST',
            body: dataWithoutId,
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

DomainAddIp.description = 'Add an IP to a domain'
DomainAddIp.flags = Object.assign(
  { 
    'id': flags.string({description: 'ID of the domain to which you are adding an IP', required: true}),
    'ip': flags.string({description: 'IP to associate with the domain. Used for manually specifying IPs for custom SPF', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = DomainAddIp;