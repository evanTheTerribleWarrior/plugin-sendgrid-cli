const { flags } = require('@oclif/command');

const categories = flags.string({
  description: 'Array of categories. Separate by comman. Max 10 categories',
  required: false,
  parse: (input) => input.split(',').map(item => item.trim()),
  validate: (input) => {
    if (input.length > 10) {
      return 'Cannot contain more than 10 categories.';
    }

    const uniqueItems = new Set(input);
    if (uniqueItems.size !== input.length) {
      return 'The categories must be unique.';
    }
    return true;
  },
});

module.exports = {
    categories
};
