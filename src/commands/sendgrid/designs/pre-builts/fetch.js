const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class DesignFetchPreBuilt extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchDesign()
      this.output(result)
    }

    async fetchDesign() {
          
      const request = {
        url: `/v3/designs/pre-builts/${this.flags.id}`,
        method: 'GET'
      }

      const [response] = await client.request(request);
      return response.body
          
    }
}

DesignFetchPreBuilt.description = 'Fetch a single Design from the SendGrid pre-built list'
DesignFetchPreBuilt.flags = Object.assign(
  {
    'id': flags.string({description: 'The ID of the design', required: true})
  }, BaseCommand.flags)

module.exports = DesignFetchPreBuilt;