const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class LinkBrandingUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateLinkBranding()
      this.output(result)
    }

    async updateLinkBranding() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.LINKS}/${id}`,
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

LinkBrandingUpdate.description = 'Update a branded link'
LinkBrandingUpdate.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the branded link you want to retrieve', required: true}),
    'default': flags.boolean({description: 'Indicates if the branded link is set as the default. When setting a new default, the existing default link branding will have its default status removed automatically', default: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = LinkBrandingUpdate;