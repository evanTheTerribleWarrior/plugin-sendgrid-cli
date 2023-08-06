const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean, getArrayFlag } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class InvalidEmailDeleteMultiple extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteMultiple()
      this.output(result)
    }

    async deleteMultiple() {

        const { headers, ...data } = extractFlags(this.flags);

        if(!data.emails && !data.delete_all) {
            return "emails array or delete_all must be set"
        }
        else if(data.emails && data.delete_all) {
            return "emails array and delete_all cannot both be set"
        }

        const request = {
            url: `${API_PATHS.INVALID_EMAIL}`,
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

InvalidEmailDeleteMultiple.description = 'Remove email addresses from your invalid email address list'
InvalidEmailDeleteMultiple.flags = Object.assign(
  { 
    'delete-all': getBoolean('Indicates if you want to remove all email address from the invalid emails list', false),
    'emails': getArrayFlag('The list of specific email addresses that you want to remove', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = InvalidEmailDeleteMultiple;