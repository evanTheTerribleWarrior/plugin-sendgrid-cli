const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const {extractFlags} = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class DomainSubuserFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchSubuserDomain()
      this.output(result)
    }

    async fetchSubuserDomain() {

        const { headers, ...data } = extractFlags(this.flags);
        
        const request = {
            url: `${API_PATHS.DOMAINS}/subuser`,
            method: 'GET',
            qs: data,
            headers: headers
        }

        try {
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error.response.body.errors[0].message
        }    
    }
}

DomainSubuserFetch.description = 'Fetch a subuser authenticated domain'
DomainSubuserFetch.flags = Object.assign(
  {
    'username': flags.string({description: 'Username for the subuser to find associated authenticated domain', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = DomainSubuserFetch;