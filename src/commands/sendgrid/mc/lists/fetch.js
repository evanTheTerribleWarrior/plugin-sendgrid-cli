const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCListFetch extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchList()
      this.output(result)
    }

    async fetchList() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.MC_LISTS}/${id}`,
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

MCListFetch.description = 'Returns data about a specific list'
MCListFetch.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the Contact List', required: true}),
    'contact-sample': getBoolean('Setting this parameter to the true will cause the contact_sample to be returned', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCListFetch;