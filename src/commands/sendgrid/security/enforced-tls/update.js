const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const {extractFlags} = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class EnforcedTLSUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateEnforcedTLS()
      this.output(result)
    }

    async updateEnforcedTLS() {

        const { headers, ...data } = extractFlags(this.flags);
        
        const request = {
            url: `${API_PATHS.USER_SETTINGS}/enforced_tls`,
            method: 'PATCH',
            headers: headers,
            body: data
        }

        try {
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error
        }    
    }
}

EnforcedTLSUpdate.description = 'Fetch current Enforced TLS settings'
EnforcedTLSUpdate.flags = Object.assign(
  {
    'require-tls': flags.boolean({description: 'Indicates if you want to require your recipients to support TLS', default: false}),
    'require-valid-cert': flags.boolean({description: 'Indicates if you want to require your recipients to have a valid certificate.', default: false}),
    'version': flags.string({
        char: 'f',
        description: 'The minimum required TLS certificate version.',
        parse: (input) => {
            const versionValue = parseFloat(input);
            if (isNaN(versionValue)) {
                throw new Error('Invalid TLS version number');
            }
            if (![1.1, 1.2, 1.3].includes(versionValue)) {
                throw new Error(`TLS version must be one of the allowed values: ${[1.1, 1.2, 1.3].join(', ')}`);
            }

            return versionValue;
        }
    }),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = EnforcedTLSUpdate;