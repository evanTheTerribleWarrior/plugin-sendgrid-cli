const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class DesignDuplicatePreBuilt extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.duplicateDesign()
      this.output(result)
    }

    async duplicateDesign() {

      const data = {}
      if(this.flags.name) data.name = this.flags.name;
      if(this.flags.editor) data.editor = this.flags.editor;
          
      const request = {
        url: `/v3/designs/pre-builts/${this.flags.id}`,
        method: 'POST',
        body: data
      }

      const [response] = await client.request(request);
      return response.body
          
    }
}

DesignDuplicatePreBuilt.description = 'Duplicate a single Design from the SendGrid pre-built list'
DesignDuplicatePreBuilt.flags = Object.assign(
  {
    'id': flags.string({description: 'The ID of the design', required: true}),
    'name': flags.string({description: 'The name of the new design. If omitted, the original design name will be used', required: false}),
    'editor': flags.enum({description: 'The editor used in the UI', options: ['code', 'design'], required: false})
  }, BaseCommand.flags)

module.exports = DesignDuplicatePreBuilt;