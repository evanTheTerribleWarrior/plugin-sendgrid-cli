const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class UserProfileUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateUserProfile()
      this.output(result)
    }

    async updateUserProfile() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.USER_PROFILE}`,
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

UserProfileUpdate.description = 'Update your user profile'
UserProfileUpdate.flags = Object.assign(
  { 
    'address': flags.string({description: 'The user address', required: false}),
    'address2': flags.string({description: 'An optional second line for the street address of this user profile', required: false}),
    'city': flags.string({description: 'The city of the user profile', required: false}),
    'company': flags.string({description: 'The company the user profile is associated with', required: false}),
    'country': flags.string({description: 'The country for the user profile', required: false}),
    'first-name': flags.string({description: 'The first name for the user profile', required: false}),
    'last-name': flags.string({description: 'The last name for the user profile', required: false}),
    'phone': flags.string({description: 'The phone for the user profile', required: false}),
    'state': flags.string({description: 'The state for the user profile', required: false}),
    'website': flags.string({description: 'The website for the user profile', required: false}),
    'zip': flags.string({description: 'The zip code for the user profile', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = UserProfileUpdate;