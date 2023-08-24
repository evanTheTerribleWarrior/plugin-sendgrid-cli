const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getStringWithLength  } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCSingleSendDuplicate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.duplicate()
      this.output(result)
    }

    async duplicate() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.MC_SINGLE_SEND}/${id}`,
            method: 'POST',
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

MCSingleSendDuplicate.description = 'Duplicate a Single Send'
MCSingleSendDuplicate.flags = Object.assign(
  { 
    'id': flags.string({description: 'The id of the single send', required: true}),
    'name': getStringWithLength('The name of the duplicate Single Send', false, 100),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCSingleSendDuplicate;