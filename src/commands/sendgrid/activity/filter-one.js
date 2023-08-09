const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const { extractFlags } = require('../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../utils/paths');
client.setApiKey(process.env.SG_API_KEY);

class ActivityFilterOne extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.filterActivityOne()
      this.output(result.result)
    }

    async filterActivityOne() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id } = data;
          
        const request = {
            url: `${API_PATHS.ACTIVITY}/${id}`,
            method: 'GET',
            headers: headers
        }

        const [response] = await client.request(request);
        return response.body
          
    }
}

ActivityFilterOne.description = 'Filter a specific message from the Email Activity'
ActivityFilterOne.flags = Object.assign(
  {
    'id': flags.string({description: 'The ID of the message you are requesting details for', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = ActivityFilterOne;