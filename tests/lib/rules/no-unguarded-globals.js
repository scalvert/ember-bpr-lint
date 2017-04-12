const rule = require('../../../lib/rules/no-unguarded-globals');
const getMessage = rule.meta.message;
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester();

const WINDOW_MESSAGE = getMessage('window');
const DOCUMENT_MESSAGE = getMessage('document');

ruleTester.run('no-unguarded-globals', rule, {
  valid: [
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          actions: {
            guarded() {
              if (environment.isBrowser()) {
                const location = window.location;
              }
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          actions: {
            guarded() {
              const location = window.location;
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          willRender() {
            const location = window.location;
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          didRender() {
            const location = window.location;
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          willInsertElement() {
            const location = window.location;
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          didInsertElement() {
            const location = window.location;
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          guarded() {
            if (environment.isBrowser()) {
              const location = window.location;
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          guarded() {
            if (environment.isBrowser() && this.get('otherCondition')) {
              const location = window.location;
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          guarded() {
            if (someOtherCondition() && environment.isBrowser() && this.get('otherCondition')) {
              const location = window.location;
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          guarded() {
            if (someOtherCondition() && environment.isBrowser() && this.get('otherCondition') || this.get('yetAnotherCondition')) {
              const location = window.location;
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        let { isBrowser } = environment;

        export default Ember.Component.extend({
          guarded() {
            if (isBrowser()) {
              const location = window.location;
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        let { isBrowser } = environment;

        export default Ember.Component.extend({
          guarded() {
            if (someCondition() && isBrowser()) {
              const location = window.location;
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        let { isBrowser } = environment;

        export default Ember.Component.extend({
          guarded() {
            if (someCondition() && isBrowser() && this.get('otherCondition')) {
              const location = window.location;
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import Ember from 'ember';
        import environment from 'ember-stdlib/utils/environment';
        const { isBrowser } = environment

        export default Ember.Component.extend({
          init() {
            this._super(...arguments);
            if (isBrowser()) {
              const location = window.location;
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          shortCircuit() {
            if (environment.isBrowser() && window.localStorage) {
              return window.localStorage;
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          ternary() {
            return (environment.isBrowser() && window.localStorage) ? window.localStorage : {};
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import Ember from 'ember';
        let troll = {
          isBrowser() { return 'under bridge' }
        }

        export default Ember.Component.extend({
          init() {
            this._super(...arguments);
            if (troll.isBrowser()) {
              let attackUnsuspectingLoser = true;
            }
          }
        })`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          actions: {
            guarded() {
              if (environment.isBrowser()) {
                const node = document.querySelector('blah');
              }
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          actions: {
            guarded() {
              const node = document.querySelector('blah');
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          willRender() {
            const node = document.querySelector('blah');
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          didRender() {
            const node = document.querySelector('blah');
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          willInsertElement() {
            const node = document.querySelector('blah');
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          didInsertElement() {
            const node = document.querySelector('blah');
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          guarded() {
            if (environment.isBrowser()) {
                const node = document.querySelector('blah');
              }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          guarded() {
            if (environment.isBrowser() && this.get('otherCondition')) {
                const node = document.querySelector('blah');
              }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          guarded() {
            if (someOtherCondition() && environment.isBrowser() && this.get('otherCondition')) {
                const node = document.querySelector('blah');
              }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          guarded() {
            if (someOtherCondition() && environment.isBrowser() && this.get('otherCondition') || this.get('yetAnotherCondition')) {
                const node = document.querySelector('blah');
              }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        let { isBrowser } = environment;

        export default Ember.Component.extend({
          guarded() {
            if (isBrowser()) {
              const node = document.querySelector('blah');
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        let { isBrowser } = environment;

        export default Ember.Component.extend({
          guarded() {
            if (someCondition() && isBrowser()) {
              const node = document.querySelector('blah');
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        let { isBrowser } = environment;

        export default Ember.Component.extend({
          guarded() {
            if (someCondition() && isBrowser() && this.get('otherCondition')) {
              const node = document.querySelector('blah');
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import Ember from 'ember';
        import environment from 'ember-stdlib/utils/environment';
        const { isBrowser } = environment

        export default Ember.Component.extend({
          init() {
            this._super(...arguments);
            if (isBrowser()) {
              const node = document.querySelector('blah');
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      code: `
        import Ember from 'ember';
        let troll = {
          isBrowser() { return 'under bridge' }
        }

        export default Ember.Component.extend({
          init() {
            this._super(...arguments);
            if (troll.isBrowser()) {
              let attackUnsuspectingLoser = true;
            }
          }
        })`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [{
        message: DOCUMENT_MESSAGE
      }]
    }
  ],
  invalid: [
    {
      code: `
        export default Ember.Component({
          didUpdateAttrs() {
            const node = document.querySelector('blah');
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        { message: DOCUMENT_MESSAGE },
        { message: DOCUMENT_MESSAGE }
      ]
    },
    {
      code: `
        export default Ember.Component({
          unguarded() {
            const node = document.querySelector('blah');
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        { message: DOCUMENT_MESSAGE },
        { message: DOCUMENT_MESSAGE }
      ]
    },
    {
      code: `
        import Ember from 'ember';
        let troll = {
          isBrowser() { return 'under bridge' }
        }

        export default Ember.Component.extend({
          init() {
            this._super(...arguments);
            if (troll.isBrowser()) {
              const node = document.querySelector('blah');
            }
          }
        })`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        { message: DOCUMENT_MESSAGE },
        { message: DOCUMENT_MESSAGE }
      ]
    },
    {
      code: `
        import Ember from 'ember';

        export default Ember.Component.extend({
          init() {
            this._super(...arguments);

            this.set('prop', {
              foo: blah('boo', document.documentElement, true),
            });
          },
        })`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [{
        message: DOCUMENT_MESSAGE
      }]
    },
    {
      code: `
        import Ember from 'ember';

        export default Ember.Component.extend({
          init() {
            this._super(...arguments);

            this.set('prop', {
              foo: blah('boo', document, true),
            });
          },
        })`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [{
        message: DOCUMENT_MESSAGE
      }]
    },
    {
      code: `
        export default Ember.Component({
          didUpdateAttrs() {
            const location = window.location;
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        { message: WINDOW_MESSAGE }
      ]
    },
    {
      code: `
        export default Ember.Component({
          unguarded() {
            const location = window.location;
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        { message: WINDOW_MESSAGE }
      ]
    },
    {
      code: `
        import Ember from 'ember';
        let troll = {
          isBrowser() { return 'under bridge' }
        }

        export default Ember.Component.extend({
          init() {
            this._super(...arguments);
            if (troll.isBrowser()) {
              let location = window.location;
            }
          }
        })`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        { message: WINDOW_MESSAGE }
      ]
    },
    {
      code: `
        import Ember from 'ember';

        export default Ember.Component.extend({
          init() {
            this._super(...arguments);

            this.set('prop', {
              foo: blah('boo', window.location, true),
            });
          },
        })`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        { message: WINDOW_MESSAGE }
      ]
    },
    {
      code: `
        import Ember from 'ember';

        export default Ember.Component.extend({
          init() {
            this._super(...arguments);

            this.set('prop', {
              foo: blah('boo', window, true),
            });
          },
        })`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        { message: WINDOW_MESSAGE }
      ]
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          shortCircuit() {
            if (environment.isBrowser() || window.localStorage) {
              return window.localStorage;
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        { message: WINDOW_MESSAGE }
      ]
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          ternary() {
            return (environment.isBrowser()) ? {} : window.location;
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        { message: WINDOW_MESSAGE }
      ]
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          conditionOrder() {
            if (window.location && environment.isBrowser()) {
              doStuff();
            }
          }
        });`,
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        { message: WINDOW_MESSAGE }
      ]
    }
  ]
});
