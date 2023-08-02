const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class IPAccessAttempts extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.retrieveAttempts()
      this.output(result)
    }

    async retrieveAttempts() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.IP_ACCESS_MANAGEMENT}/activity`,
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

IPAccessAttempts.description = 'This endpoint allows you to retrieve a list of all of the IP addresses that recently attempted to access your account either through the User Interface or the API'
IPAccessAttempts.flags = Object.assign(
  { 
    'limit': flags.string({description: 'Limits the number of IPs to return', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})

  }, BaseCommand.flags)

module.exports = IPAccessAttempts;