const rule = require('../../../lib/rules/no-timers');
const MESSAGE = rule.meta.message;
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});

ruleTester.run('no-timers', rule, {
  valid: [
    {
      code: `
        export default Ember.Component.extend({
          actions: {
            foo() {
              setTimeout(() => {});
            }
          }
        });`
    },
    {
      code: `
        export default Ember.Component.extend({
          guarded() {
            if (environment.isBrowser()) {
              setTimeout(() => {});
            }
          }
        });`
    },
    {
      code: `
        export default Ember.Component.extend({
          guarded() {
            if (environment.isBrowser()) {
              setInterval(() => {});
            }
          }
        });`
    }
  ],
  invalid: [
    {
      code: `
        export default Ember.Component({
          bar() {
            setTimeout(() => {});
          }
        });`,
      errors: [{
        message: MESSAGE
      }]
    },
    {
      code: `
        export default Ember.Component({
          baz() {
            setInterval(() => {});
          }
        });`,
      errors: [{
        message: MESSAGE
      }]
    },
    {
      code: `
        export default Ember.Component({
          bar() {
            window.setTimeout(() => {});
          }
        });`,

      errors: [{
        message: MESSAGE
      }]
    },
    {
      code: `
        export default Ember.Component({
          baz() {
            window.setInterval(() => {});
          }
        });`,
      errors: [{
        message: MESSAGE
      }]
    }
  ]
});
