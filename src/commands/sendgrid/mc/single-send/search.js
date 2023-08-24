const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength, getArrayFlag  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCSingleSendSearch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.search()
      this.output(result)
    }

    async search() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MC_SINGLE_SEND}/search`,
            method: 'POST',
            body: data,
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

MCSingleSendSearch.description = 'Search for Single Sends based on specified criteria'
MCSingleSendSearch.flags = Object.assign(
  { 
    'name': getStringWithLength('Leading and trailing wildcard search on name of the Single Send', false, 100),
    'status': getArrayFlag('Current status of the Single Send', false),
    'categories': getArrayFlag('Categories to associate with this Single Send, match any single send that has at least one of the categories', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCSingleSendSearch;