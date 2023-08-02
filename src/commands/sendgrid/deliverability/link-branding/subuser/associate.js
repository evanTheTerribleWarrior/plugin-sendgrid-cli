const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class LinkBrandingSubuserAssociate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.associateSubuserLinkBranding()
      this.output(result)
    }

    async associateSubuserLinkBranding() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data

        const request = {
            url: `${API_PATHS.LINKS}/${id}/subuser`,
            method: 'POST',
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

LinkBrandingSubuserAssociate.description = 'Associate a branded link with a subuser'
LinkBrandingSubuserAssociate.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the branded link you want to associate', required: true}),
    'username': flags.string({description: 'The username of the subuser account that you want to associate the branded link with', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = LinkBrandingSubuserAssociate;