const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCSingleSendList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.list()
      this.output(result)
    }

    async list() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MC_SINGLE_SEND}`,
            method: 'GET',
            qs: data,
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

MCSingleSendList.description = 'List all Single Sends'
MCSingleSendList.flags = Object.assign(
  { 
    'page-size': flags.integer({description: 'Number of results to return', required: false}),
    'page-token': flags.string({description: 'Token corresponding to a specific page of results, as provided by metadata', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCSingleSendList;