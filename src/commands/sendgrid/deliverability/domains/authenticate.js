const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag} = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class DomainAuthenticate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.authenticateDomain()
      this.output(result)
    }

    async authenticateDomain() {

        const { headers, ...data } = extractFlags(this.flags);

        console.log(data)
        
        const request = {
            url: `${API_PATHS.DOMAINS}`,
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

DomainAuthenticate.description = 'Authenticate a single domain'
DomainAuthenticate.flags = Object.assign(
  {
    'domain': flags.string({description: 'Domain being authenticated', required: true}),
    'subdomain': flags.string({description: 'The subdomain to use for this authenticated domain', required: false}),
    'username': flags.string({description: 'The username associated with this domain', required: false}),
    'ips': getArrayFlag('The IP addresses that will be included in the custom SPF record for this authenticated domain.', false),
    'custom-spf': flags.boolean({description: 'Specify whether to use a custom SPF or allow SendGrid to manage your SPF. This option is only available to authenticated domains set up for manual security.', default: false}),
    'default': flags.boolean({description: 'Whether to use this authenticated domain as the fallback if no authenticated domains match the sender\'s domain.', default: false}),
    'automatic_security': flags.boolean({description: 'Whether to allow SendGrid to manage your SPF records, DKIM keys, and DKIM key rotation.', default: false}),
    'custom-dkim-selector': flags.string({
            description: 'Add a custom DKIM selector. Accepts three letters or numbers.',
            parse: (input) => {
                const regex = /^[a-zA-Z0-9]{3}$/;
                if (!regex.test(input)) {
                throw new Error('Custom flag must be exactly three letters or numbers');
                }
                return input;
            },
        }),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = DomainAuthenticate;