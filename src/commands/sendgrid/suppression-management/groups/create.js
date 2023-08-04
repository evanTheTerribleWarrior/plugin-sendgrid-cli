const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SuppressionGroupCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.createSuppressionGroup()
      this.output(result)
    }

    async createSuppressionGroup() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.SUPPRESSION_GROUPS}`,
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

SuppressionGroupCreate.description = 'Create a Suppression Group'
SuppressionGroupCreate.flags = Object.assign(
  { 
    'name': flags.string({description: 'The name of your suppression group. Required when creating a group', required: true}),
    'description': flags.string({description: 'A brief description of your suppression group. Required when creating a group', required: true}),
    'is-default': getBoolean('Indicates if you would like this to be your default suppression group', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SuppressionGroupCreate;