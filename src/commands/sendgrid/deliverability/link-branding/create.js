const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class LinkBrandingCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.createLinkBranding()
      this.output(result)
    }

    async createLinkBranding() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.LINKS}`,
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

LinkBrandingCreate.description = 'Create a Link Branding'
LinkBrandingCreate.flags = Object.assign(
  { 
    'domain': flags.string({description: 'The root domain for the subdomain that you are creating the link branding for. This should match your FROM email address', required: true}),
    'subdomain': flags.string({description: 'The subdomain to create the link branding for. Must be different from the subdomain you used for authenticating your domain', required: false}),
    'default': flags.boolean({description: 'Indicates if you want to use this link branding as the default or fallback. When setting a new default, the existing default link branding will have its default status removed automatically', default: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = LinkBrandingCreate;