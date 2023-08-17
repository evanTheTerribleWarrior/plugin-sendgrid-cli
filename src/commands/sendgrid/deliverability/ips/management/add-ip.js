const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getBoolean, getArrayFlag } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class IpMgmtAdd extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.addIp()
      this.output(result)
    }

    async addIp() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.IP_ADDRESS_MANAGEMENT}/ips`,
            method: 'POST',
            body: data,
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

IpMgmtAdd.description = 'Adds a Twilio SendGrid IP address to your account'
IpMgmtAdd.flags = Object.assign(
  { 
    'is-auto-warmup': getBoolean('Indicates if the IP address is set to automatically warmup', true),
    'is-parent-assigned': getBoolean('Indicates if a parent on the account is able to send email from the IP address', true),
    'subusers': getArrayFlag('An array of Subuser IDs the IP address will be assigned to', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpMgmtAdd;