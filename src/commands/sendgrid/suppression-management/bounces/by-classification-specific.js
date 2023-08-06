const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../utils/paths');
const { extractFlags, getBoolean, getDate } = require('../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');
client.setApiKey(process.env.SG_API_KEY);

class BounceByClassificationSpecific extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.fetchBounce()
      this.output(result)
    }

    async fetchBounce() {

        const { headers, ...data } = extractFlags(this.flags);
        const { csv, classification, ...restOfData } = data;

        csv ? headers.Accept = "text/csv" : headers.Accept = "application/json"

        console.log(headers)

        const request = {
            url: `${API_PATHS.BOUNCES}/classifications/${classification}`,
            method: 'GET',
            qs: restOfData,
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

BounceByClassificationSpecific.description = 'Return the number of bounces for the classification specified in descending order for each day'
BounceByClassificationSpecific.flags = Object.assign(
  { 
    'start-date': getDate('The start of the time range, in YYYY-MM-DD format, when a bounce was created (inclusive)', true),
    'end-date': getDate('The end of the time range, in YYYY-MM-DD format, when a bounce was created (inclusive)', false),
    'classification': flags.enum({description: 'The classification you want to filter by', options:['Content', 'Frequency or Volume Too High', 'Invalid Address', 'Mailbox Unavailable', 'Reputation', 'Technical Failure', 'Unclassified'], required: true}),
    'csv': getBoolean('Set to true to get results in csv format', false),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = BounceByClassificationSpecific;