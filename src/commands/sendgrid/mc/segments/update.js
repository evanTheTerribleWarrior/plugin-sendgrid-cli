const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength, getArrayFlag  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCSegmentsUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.update()
      this.output(result)
    }

    async update() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.MC_SEGMENTS}/${id}`,
            method: 'PATCH',
            body: dataWithoutId,
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

MCSegmentsUpdate.description = 'Updates a Segment'
MCSegmentsUpdate.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the segment', required: true}),
    'name': getStringWithLength('The name of the segment', false, 100),
    'query-dsl': flags.string('SQL query which will filter contacts based on the conditions provided', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCSegmentsUpdate;