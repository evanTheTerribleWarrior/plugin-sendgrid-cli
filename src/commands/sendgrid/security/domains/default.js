const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const extractFlags = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class DomainDefault extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.getDefaultDomain()
      this.output(result)
    }

    async getDefaultDomain() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.DOMAINS}/default`,
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

DomainDefault.description = 'Get the default authentication for a domain'
DomainDefault.flags = Object.assign(
  {
    'domain': flags.string({description: 'The domain to find a default authentication for', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = DomainDefault;