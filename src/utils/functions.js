const { flags } = require('@oclif/command');

const extractFlags = (flagsObject) => {

    const data = {};
    const headers = {}

    const accountIdRegex = /^sg[0-9a-f]{31}$/i;

    const excludedFlags = ['cli-log-level', 'cli-output-format', 'silent'];

    const filteredFlags = Object.keys(flagsObject).filter(
      (flagName) => !excludedFlags.includes(flagName)
    );

    filteredFlags.forEach((flagName) => {
        if (flagName === 'on-behalf-of') {
          const accountId = flagsObject[flagName];
          const isAccountId = accountIdRegex.test(accountId);
          if (isAccountId) {
            headers['on-behalf-of'] = `account-id ${accountId}`;
          } else {
            headers['on-behalf-of'] = accountId;
          }
        }
        else {
          const transformedFlagName = flagName.replace(/-/g, '_');
          data[transformedFlagName] = flagsObject[flagName];
        }
      });

    return { ...data, headers };
    
  }

  const getArrayFlag = (description, required) => {
    return flags.string({
      description: description,
      required: required,
      parse: (input) => input.split(',').map(item => item.trim()),
      validate: (input) => {
        const uniqueItems = new Set(input);
        if (uniqueItems.size !== input.length) {
          return 'The items in the array must be unique.';
        }
        return true;
      },
    });
  }

  const getBoolean = (description, required) => {
    return flags.string({
      description: description,
      required: required,
      parse: (input) => {
        const lowerCaseInput = input.toLowerCase();
        if (lowerCaseInput === 'true') {
          return true;
        } else if (lowerCaseInput === 'false') {
          return false;
        } else {
          throw new Error('Invalid value for the flag. Use --flag=true or --flag=false');
        }
      },
    })
  }

  const getDate = (description, required) => {
    return flags.string({
      description: description,
      required: required,
      parse: (input) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(input)) {
          throw new Error('Invalid date format. Use the format YYYY-MM-DD.');
        }
        return input;
      },
    })
  }

  const getIpAddress = (description, required) => {
    return flags.string({
      description: description,
      required: required,
      parse: (input) => {
        const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (!ipRegex.test(input)) {
          throw new Error('Invalid IP address. Please provide a valid IP address.');
        }
        return input;
      },
    })
  }
  
  module.exports = {
    extractFlags,
    getArrayFlag,
    getBoolean,
    getDate,
    getIpAddress
  }