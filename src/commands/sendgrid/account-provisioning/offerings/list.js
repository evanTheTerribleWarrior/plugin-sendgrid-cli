const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const {extractFlags} = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../../utils/paths');

class OfferingsList extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.listOfferings()
      this.output(result)
    }

    async listOfferings() {

        const { headers } = extractFlags(this.flags);
          
        const request = {
            url: `${API_PATHS.ACCOUNT_PROVISIONING}/offerings`,
            method: 'GET',
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

OfferingsList.description = 'Returns all the Twilio SendGrid features or offerings available to a reseller account'
OfferingsList.flags = Object.assign(
{
 
}, BaseCommand.flags)

module.exports = OfferingsList;