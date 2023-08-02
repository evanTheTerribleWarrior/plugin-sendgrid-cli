const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class DomainUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateDomain()
      this.output(result)
    }

    async updateDomain() {

        const { headers, ...data } = extractFlags(this.flags);
        const {id, ...dataWithoutId} = data;

        const request = {
            url: `${API_PATHS.DOMAINS}/${id}`,
            method: 'PATCH',
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

DomainUpdate.description = 'Update a single authenticated domain'
DomainUpdate.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the domain to update', required: true}),
    'custom-spf': flags.boolean({description: 'Indicates whether to generate a custom SPF record for manual security.', default: false}),
    'default': flags.boolean({description: 'Indicates whether this is the default authenticated domain.', default: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = DomainUpdate;