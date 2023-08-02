const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const {extractFlags} = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class DomainSubuserDisassociate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.disassociateSubuserDomain()
      this.output(result)
    }

    async disassociateSubuserDomain() {

        const { ...data } = extractFlags(this.flags);
        
        const request = {
            url: `${API_PATHS.DOMAINS}/subuser`,
            method: 'DELETE',
            qs: data
        }

        try {
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error.response.body.errors[0].message
        }    
    }
}

DomainSubuserDisassociate.description = 'Disassociate a specific authenticated domain from a subuser'
DomainSubuserDisassociate.flags = Object.assign(
  {
    'username': flags.string({description: 'Username for the subuser to find associated authenticated domain', required: true})
  }, BaseCommand.flags)

module.exports = DomainSubuserDisassociate;