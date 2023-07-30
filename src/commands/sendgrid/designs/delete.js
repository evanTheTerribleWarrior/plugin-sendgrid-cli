const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class DesignDelete extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.deleteDesign()
      this.output(result)
    }

    async deleteDesign() {
          
      const request = {
        url: `/v3/designs/${this.flags.id}`,
        method: 'DELETE'
      }

      try {
        await client.request(request);
        return "Design deleted successfully"
      } catch (error) {
        return error
      }    
    }
}

DesignDelete.description = 'Delete a single Design from your library'
DesignDelete.flags = Object.assign(
  {
    'id': flags.string({description: 'The ID of the design', required: true})
  }, BaseCommand.flags)

module.exports = DesignDelete;