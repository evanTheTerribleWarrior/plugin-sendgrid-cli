const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class TeammateAccessApprove extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.approveAccessRequests()
      this.output(result)
    }

    async approveAccessRequests() {

        const { headers, ...data } = extractFlags(this.flags);
        const { request_id } = data

        const request = {
            url: `${API_PATHS.SCOPES}/requests/${request_id}/approve`,
            method: 'PATCH',
            headers: headers
        }

        try {
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error
        }    
    }
}

TeammateAccessApprove.description = 'Approve an access attempt'
TeammateAccessApprove.flags = Object.assign(
  { 
    'request-id': flags.string({description: 'The ID of the request that you want to approve', required: true}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = TeammateAccessApprove;