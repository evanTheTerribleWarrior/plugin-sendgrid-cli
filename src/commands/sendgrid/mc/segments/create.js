const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength, getArrayFlag  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCSegmentsCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.create()
      this.output(result)
    }

    async create() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MC_SEGMENTS}`,
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

MCSegmentsCreate.description = 'Creates a new Segment'
MCSegmentsCreate.flags = Object.assign(
  { 
    'name': getStringWithLength('The name of the segment', true, 100),
    'parent-list-ids': getArrayFlag('The array of list ids to filter contacts on when building this segment. It allows only one such list id for now', false),
    'query-dsl': flags.string({description: 'SQL query which will filter contacts based on the conditions provided', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCSegmentsCreate;