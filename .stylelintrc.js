'use strict';

module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-prettier/recommended'],
  rules: {
    'no-descending-specificity': null,
    'color-function-notation': 'legacy',
    'selector-class-pattern': [
      // https://github.com/btd1337/stylelint-config-sass-guidelines/blob/master/.stylelintrc
      // '^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:\\[.+\\])?$',
      '^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)*(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)*(?:\\[.+\\])?$',
    ],
  },
};
