const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCSingleSendSchedule extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.schedule()
      this.output(result)
    }

    async schedule() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.MC_SINGLE_SEND}/${id}/schedule`,
            method: 'PUT',
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

MCSingleSendSchedule.description = 'Schedule a Single Send'
MCSingleSendSchedule.flags = Object.assign(
  { 
    'id': flags.string({description: 'The id of the single send', required: true}),
    'send-at': flags.string({description: 'The ISO 8601 time at which to send the Single Send. This must be in future or the string now', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCSingleSendSchedule;