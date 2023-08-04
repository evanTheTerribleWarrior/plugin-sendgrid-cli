const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getArrayFlag } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class SuppressionGlobalList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listSuppressionGlobal()
      this.output(result)
    }

    async listSuppressionGlobal() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `/v3/suppression/unsubscribes`,
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

SuppressionGlobalList.description = 'Retrieve a list of all email address that are globally suppressed'
SuppressionGlobalList.flags = Object.assign(
  { 
    'start-time': flags.integer({description: 'Refers start of the time range in unix timestamp when an unsubscribe email was created (inclusive)', required: false}),
    'end-time': flags.integer({description: 'Refers start of the time range in unix timestamp when an unsubscribe email was created (inclusive)', required: false}),
    'limit': flags.integer({description: 'Refers start of the time range in unix timestamp when an unsubscribe email was created (inclusive)', required: false}),
    'offset': flags.integer({description: 'Refers start of the time range in unix timestamp when an unsubscribe email was created (inclusive)', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = SuppressionGlobalList;