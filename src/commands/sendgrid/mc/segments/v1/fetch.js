const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags, getBoolean  } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCSegmentsFetchV1 extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetch()
      this.output(result)
    }

    async fetch() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.MC_SEGMENTS_V1}/${id}`,
            method: 'GET',
            qs: dataWithoutId,
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

MCSegmentsFetchV1.description = 'Fetch a Segment - v1 API'
MCSegmentsFetchV1.flags = Object.assign(
  { 
    'id': flags.string({description: 'The id of the segment', required: true}),
    'query-json': getBoolean('Defaults to false. Set to true to return the parsed SQL AST as a JSON object in the field query_json', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCSegmentsFetchV1;