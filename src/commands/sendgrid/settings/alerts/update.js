const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class AlertUpdate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.updateAlert()
      this.output(result)
    }

    async updateAlert() {

        const { headers, ...data } = extractFlags(this.flags);
        const { id, ...dataWithoutId } = data;

        const request = {
            url: `${API_PATHS.ALERTS}/${id}`,
            method: 'PATCH',
            body: data,
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

AlertUpdate.description = 'Update an alert'
AlertUpdate.flags = Object.assign(
  { 
    'id': flags.string({description: 'The ID of the alert', required: false}),
    'email-to': flags.string({description: 'The email address the alert will be sent to', required: false}),
    'frequency': flags.string({description: 'Required for stats_notification. How frequently the alert will be sent. Example: daily', required: false}),
    'percentage': flags.integer({description: 'Required for usage_alert. When this usage threshold is reached, the alert will be sent. Example: 90', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = AlertUpdate;