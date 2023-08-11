const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class GoogleAnalyticsUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateGoogleAnalytics()
      this.output(result)
    }

    async updateGoogleAnalytics() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.TRACKING_SETTINGS}/google_analytics`,
            method: 'PATCH',
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

GoogleAnalyticsUpdate.description = 'Update google analytics settings on your account'
GoogleAnalyticsUpdate.flags = Object.assign(
  { 
    'enabled': getBoolean('The setting you want to use for google analytics', false),
    'utm-campaign': flags.string({description: 'The name of the campaign', required: false}),
    'utm-content': flags.string({description: 'Used to differentiate ads', required: false}),
    'utm-medium': flags.string({description: 'Name of the marketing medium (e.g. "Email")', required: false}),
    'utm-source': flags.string({description: 'Name of the referrer source', required: false}),
    'utm-term': flags.string({description: 'Any paid keywords', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = GoogleAnalyticsUpdate;