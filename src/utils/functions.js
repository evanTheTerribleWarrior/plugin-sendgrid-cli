const extractFlags = (flagsObject) => {
    const data = {};

    const filteredFlags = Object.keys(flagsObject).filter(
        (flagName) => flagName !== 'cli-log-level' && flagName !== 'cli-output-format'
    );

    filteredFlags.forEach((flagName) => {
        if (flagsObject[flagName]) {
          const transformedFlagName = flagName.replace(/-/g, '_');
          data[transformedFlagName] = flagsObject[flagName];
        }
      });
    return data;
  }
  
  module.exports = extractFlags;