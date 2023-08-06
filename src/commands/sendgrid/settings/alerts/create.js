const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class AlertCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.createAlert()
      this.output(result)
    }

    async createAlert() {

        const { headers, ...data } = extractFlags(this.flags);
        const { type } = data;

        if(type === "stats_notification" && data.percentage) {
            return "stats_notification can be set only with the frequency parameter"
        }

        if(type === "usage_limit" && data.frequency) {
            return "usage_limit can be set only with the percentage parameter"
        }


        const request = {
            url: `${API_PATHS.ALERTS}`,
            method: 'POST',
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

AlertCreate.description = 'Create an alert'
AlertCreate.flags = Object.assign(
  { 
    'type': flags.enum({description: 'The type of alert you want to create', options: ['stats_notification', 'usage_limit'], required: true}),
    'email-to': flags.string({description: 'The email address the alert will be sent to', required: true}),
    'frequency': flags.string({description: 'Required for stats_notification. How frequently the alert will be sent. Example: daily', required: false}),
    'percentage': flags.integer({description: 'Required for usage_alert. When this usage threshold is reached, the alert will be sent. Example: 90', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = AlertCreate;