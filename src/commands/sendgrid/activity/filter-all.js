const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const { extractFlags } = require('../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../utils/paths');
client.setApiKey(process.env.SG_API_KEY);

class ActivityFilter extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.filterActivity()
      this.output(result.result)
    }

    async filterActivity() {

        const { headers, ...data } = extractFlags(this.flags);
          
        const request = {
            url: `${API_PATHS.ACTIVITY}`,
            method: 'GET',
            qs: data,
            headers: headers
        }

        const [response] = await client.request(request);
        return response.body
          
    }
}

ActivityFilter.description = 'Filter all messages to search your Email Activity'
ActivityFilter.flags = Object.assign(
  {
    'query': flags.string({description: 'Use the query syntax to filter your email activity', required: true}),
    'limit': flags.integer(
        {
            description: 'ID of the version', 
            required: true,
            parse: (input) => {
                if (input < 0 || input > 1000) {
                    throw new Error('Invalid value. Provide an integer between 0 and 1000.');
                }
                return input;
            }
        }),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = ActivityFilter;