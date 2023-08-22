const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class DomainsList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listDomains()
      this.output(result)
    }

    async listDomains() {

        const { headers, ...data } = extractFlags(this.flags);
        
        const request = {
            url: `${API_PATHS.DOMAINS}`,
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

DomainsList.description = 'List authenticated domains'
DomainsList.flags = Object.assign(
  {
    'limit': flags.string({description: 'Number of domains to return', required: false}),
    'offset': flags.string({description: 'Paging offset from results', required: false}),
    'exclude-subusers': flags.boolean({description: 'Exclude subuser domains from the result', default: false}),
    'username': flags.string({description: 'The username associated with an authenticated domain', required: false}),
    'domain': flags.string({description: 'Search for authenticated domains', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = DomainsList;