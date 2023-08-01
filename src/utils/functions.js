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


  
  module.exports = extractFlags