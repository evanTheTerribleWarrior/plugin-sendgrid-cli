const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean, getArrayFlag  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCSegmentsList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.list()
      this.output(result)
    }

    async list() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MC_SEGMENTS}`,
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

MCSegmentsList.description = 'Retrieve a list of segments'
MCSegmentsList.flags = Object.assign(
  { 
    'ids': getArrayFlag('A list of segment IDs to retrieve. When this parameter is included, the no_parent_list_ids and parent_list_ids parameters are ignored and only segments with given IDs are returned', false),
    'parent-list-ids': flags.string({description: 'A comma separated list up to 50 in size, to filter segments on. Only segments that have any of these list ids as the parent list will be retrieved', required: false}),
    'no-parent-list-id': getBoolean('If set to true, segments with an empty value of parent_list_id', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCSegmentsList;