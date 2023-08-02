const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class LinkBrandingSubuserFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchSubuserLinkBranding()
      this.output(result)
    }

    async fetchSubuserLinkBranding() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.LINKS}/subuser`,
            method: 'GET',
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

LinkBrandingSubuserFetch.description = 'Fetch a branded link from a subuser'
LinkBrandingSubuserFetch.flags = Object.assign(
  { 
    'username': flags.string({description: 'The username of the subuser to retrieve associated branded links for', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = LinkBrandingSubuserFetch;