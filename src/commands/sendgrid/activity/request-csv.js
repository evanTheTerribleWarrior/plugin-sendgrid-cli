const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const { extractFlags } = require('../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
const API_PATHS = require('../../../utils/paths');
client.setApiKey(process.env.SG_API_KEY);

class CsvRequest extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.requestCSV()
      this.output(result.result)
    }

    async requestCSV() {

        const { headers, ...data } = extractFlags(this.flags);
        const encodedQuery = encodeURIComponent(data.query);
        data.query = encodedQuery;
          
        const request = {
            url: `${API_PATHS.ACTIVITY}/download`,
            method: 'POST',
            body: data,
            headers: headers
        }

        const [response] = await client.request(request);
        return response.body
          
    }
}

CsvRequest.description = 'Request a CSSV file with your last 1 million messages. An email will be sent to download the file'
CsvRequest.flags = Object.assign(
  {
    'query': flags.string({description: 'Use the query syntax to indicate which messages to include in the CSV', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = CsvRequest;