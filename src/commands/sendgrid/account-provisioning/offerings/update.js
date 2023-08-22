const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const {extractFlags, getDataFile} = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../../utils/paths');

class OfferingUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateOfferings()
      this.output(result)
    }

    async updateOfferings() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, data_file } = data;
          
        const request = {
            url: `${API_PATHS.ACCOUNT_PROVISIONING}/accounts/${id}/offerings`,
            method: 'PUT',
            body: data_file,
            headers: headers
        }

        try {
            client.setApiKey(process.env.SG_ACCOUNT_PROVISIONING_KEY);
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error
        }  
          
    }
}

OfferingUpdate.description = 'Changes a package offering for the specified account'
OfferingUpdate.flags = Object.assign(
{
    'id': flags.string({description: 'The account ID to fetch the offerings for', required: true}),
    'data-file': getDataFile('The local JSON file containing the updated offerings for the account', true)  
}, BaseCommand.flags)

module.exports = OfferingUpdate;