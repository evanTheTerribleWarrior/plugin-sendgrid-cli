const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean, getDate } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class BounceByClassification extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchBounce()
      this.output(result)
    }

    async fetchBounce() {

        const { headers, ...data } = extractFlags(this.flags);
        const { csv, ...dataWithoutCsv } = data;

        csv ? headers.Accept = "text/csv" : headers.Accept = "application/json"

        console.log(headers)

        const request = {
            url: `${API_PATHS.BOUNCES}/classifications`,
            method: 'GET',
            qs: dataWithoutCsv,
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

BounceByClassification.description = 'Return the total number of bounces by classification in descending order for each day'
BounceByClassification.flags = Object.assign(
  { 
    'start-date': getDate('The start of the time range, in YYYY-MM-DD format, when a bounce was created (inclusive)', true),
    'end-date': getDate('The end of the time range, in YYYY-MM-DD format, when a bounce was created (inclusive)', false),
    'csv': getBoolean('Set to true to get results in csv format', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = BounceByClassification;