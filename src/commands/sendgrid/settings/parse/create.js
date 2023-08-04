const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class ParseCreate extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.createParse()
      this.output(result)
    }

    async createParse() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.PARSE_WEBHOOK}/settings`,
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

ParseCreate.description = 'Create a parse setting'
ParseCreate.flags = Object.assign(
  { 
    'url': flags.string({description: 'The public URL where you would like SendGrid to POST the data parsed from your email', required: true}),
    'hostname': flags.string({description: 'A specific and unique domain or subdomain that you have created to use exclusively to parse your incoming email', required: true}),
    'spam-check': getBoolean('Indicates if you would like SendGrid to check the content parsed from your emails for spam before POSTing them to your domain', false),
    'send-raw': getBoolean('When this parameter is set to true, SendGrid will send a JSON payload of the content of your email', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = ParseCreate;