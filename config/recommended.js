module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: {
    'browser': true
  },
  plugins: [
    'ember-bpr-lint'
  ],
  rules: {
    // Custom rules
    'ember-bpr-lint/no-timers': 2,
    'ember-bpr-lint/no-unguarded-globals': 2
  }
};
