const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class SuppressionSearch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.searchSuppressions()
      this.output(result)
    }

    async searchSuppressions() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data

        const request = {
            url: `${API_PATHS.SUPPRESSION_GROUPS}/${id}/suppressions/search`,
            method: 'POST',
            body: dataWithoutId,
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

SuppressionSearch.description = 'Search a suppression group for multiple suppressions'
SuppressionSearch.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the suppression group that you would like to search', required: true}),
    'recipient-emails': getArrayFlag('The array of email addresses to add or find', true),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SuppressionSearch;