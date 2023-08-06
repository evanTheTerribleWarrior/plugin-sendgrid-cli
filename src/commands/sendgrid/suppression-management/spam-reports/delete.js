const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SpamReportDelete extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteSpamReport()
      this.output(result)
    }

    async deleteSpamReport() {

        const { headers, ...data } = extractFlags(this.flags);

        if(!data.emails && !data.delete_all) {
            return "emails array or delete_all must be set"
        }
        else if(data.emails && data.delete_all) {
            return "emails array and delete_all cannot both be set"
        }

        const request = {
            url: `${API_PATHS.SPAM_REPORTS}`,
            method: 'DELETE',
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

SpamReportDelete.description = 'Delete all emails on your spam report list'
SpamReportDelete.flags = Object.assign(
  { 
    'delete-all': getBoolean('This parameter allows you to delete every email in your spam report list. This should not be used with the emails parameter', false),
    'emails': getArrayFlag('Delete multiple emails from your spam report list at the same time. This should not be used with the delete_all parameter', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SpamReportDelete;