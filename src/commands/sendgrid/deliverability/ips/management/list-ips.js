const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getIpAddress, getBoolean } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class IpMgmtList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listIp()
      this.output(result)
    }

    async listIp() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.IP_ADDRESS_MANAGEMENT}/ips`,
            method: 'GET',
            qs: data,
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

IpMgmtList.description = 'Returns a list of all IP addresses associated with your account'
IpMgmtList.flags = Object.assign(
  { 
    'ip': getIpAddress('The IP address to get', false),
    'pool': flags.string({description: 'Specifies the unique ID for an IP Pool', required: false}),
    'limit': flags.integer({description: 'Specifies the number of results to be returned by the API', required: false}),
    'after-key': flags.integer({description: 'Specifies which items to be returned by the API', required: false}),
    'before-key': flags.integer({description: 'Specifies which items to be returned by the API', required: false}),
    'is-leased': getBoolean('Indicates whether an IP address is leased from Twilio SendGrid', false),
    'is-enabled': getBoolean('Indicates if the IP address is billed and able to send email', false),
    'is-parent-assigned': getBoolean('Indicates if a parent on the account is able to send email from the IP address', false),
    'start-added-at': flags.integer({description: 'The start_added_at and end_added_at parameters are used to set a time window', required: false}),
    'end-added-at': flags.integer({description: 'The start_added_at and end_added_at parameters are used to set a time window', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = IpMgmtList;