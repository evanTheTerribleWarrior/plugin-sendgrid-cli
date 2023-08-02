const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class LinkBrandingSubuserDisassociate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.disassociateSubuserLinkBranding()
      this.output(result)
    }

    async disassociateSubuserLinkBranding() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.LINKS}/subuser`,
            method: 'DELETE',
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

LinkBrandingSubuserDisassociate.description = 'Disassociate a branded link from a subuser'
LinkBrandingSubuserDisassociate.flags = Object.assign(
  { 
    'username': flags.string({description: 'The username of the subuser account that you want to disassociate the branded link from', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = LinkBrandingSubuserDisassociate;