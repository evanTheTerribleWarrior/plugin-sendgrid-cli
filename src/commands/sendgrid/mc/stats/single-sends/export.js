const { flags } = require('@oclif/command');
const { BaseCommand } = require('@twilio/cli-core').baseCommands;
const { TwilioCliError } = require('@twilio/cli-core').services.error;
const API_PATHS = require('../../../../../utils/paths');
const { extractFlags } = require('../../../../../utils/functions');
require('dotenv').config()
const client = require('@sendgrid/client');

class MCStatsSingleSendsExport extends BaseCommand {
    async run() {
      await super.run();
      const result = await this.export()
      this.output(result)
    }

    async export() {

        const { headers, ...data } = extractFlags(this.flags);

        const request = {
            url: `${API_PATHS.MC_STATS}/singlesends/export`,
            method: 'GET',
            qs: data,
            headers: headers
        }

        try {
            client.setApiKey(process.env.SG_API_KEY);
            const [response] = await client.request(request);
            return response.body
        } catch (error) {
            return error
        }    
    }
}

MCStatsSingleSendsExport.description = 'Export Single Send stats as CSV data'
MCStatsSingleSendsExport.flags = Object.assign(
  { 
    'ids': flags.string({description: 'The IDs of single sends for which to export stats', required: false}),
    'timezone': flags.string({description: 'The IANA Area/Region string representing the timezone in which the stats are to be presented', required: false}),
    'on-behalf-of': flags.string({description: 'Allows you to make API calls from a parent account on behalf of the parent\'s Subusers or customer account', required: false})
  }, BaseCommand.flags)

module.exports = MCStatsSingleSendsExport;