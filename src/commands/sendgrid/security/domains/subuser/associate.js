const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const extractFlags = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class DomainSubuserAssociate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.associateSubuserDomain()
      this.output(result)
    }

    async associateSubuserDomain() {

        const { headers, ...data } = extractFlags(this.flags);
        const {id, ...dataWithoutId} = data;
        
        const request = {
            url: `${API_PATHS.DOMAINS}/${id}/subuser`,
            method: 'POST',
            body: dataWithoutId,
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

DomainSubuserAssociate.description = 'Associate a specific authenticated domain with a subuser'
DomainSubuserAssociate.flags = Object.assign(
  {
    'username': flags.string({description: 'Username to associate with the authenticated domain.', required: true}),
    'id': flags.string({description: 'ID of the authenticated domain to associate with the subuser', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = DomainSubuserAssociate;