const rule = require('../../../lib/rules/no-unguarded-globals');
const getMessage = rule.meta.message;
const RuleTester = require('eslint').RuleTester;
const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
});

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
        });`
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
        });`
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          willRender() {
            const location = window.location;
          }
        });`
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          didRender() {
            const location = window.location;
          }
        });`
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          willInsertElement() {
            const location = window.location;
          }
        });`
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          didInsertElement() {
            const location = window.location;
          }
        });`
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
        });`
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
        });`
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
        });`
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
        });`
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
        });`
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
        });`
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
        });`
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
        });`
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
        })`
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
        });`
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
        });`
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          willRender() {
            const node = document.querySelector('blah');
          }
        });`
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          didRender() {
            const node = document.querySelector('blah');
          }
        });`
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          willInsertElement() {
            const node = document.querySelector('blah');
          }
        });`
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          didInsertElement() {
            const node = document.querySelector('blah');
          }
        });`
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
        });`
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
        });`
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
        });`
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
        });`
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
        });`
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
        });`
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
        });`
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
        });`
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
      errors: [{
        message: DOCUMENT_MESSAGE
      }]
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
        });`
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';
        const { isBrowser } = environment

        export default Ember.Component.extend({
          shortCircuit() {
            if (isBrowser() && window.localStorage) {
              return window.localStorage;
            }
          }
        });`
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          isInBrowser() {
            if (environment.isBrowser() || window) {
              return true;
            }
          }
        });`
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';
        const { isBrowser } = environment;

        export default Ember.Component.extend({
          isInBrowser() {
            if (isBrowser() || window) {
              return true;
            }
          }
        });`
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
      errors: [
        { message: WINDOW_MESSAGE }
      ]
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';
        const { isBrowser } = environment;

        export default Ember.Component.extend({
          shortCircuit() {
            if (isBrowser() || window.localStorage) {
              return window.localStorage;
            }
          }
        });`,
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
      errors: [
        { message: WINDOW_MESSAGE }
      ]
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';
        const { isBrowser } = environment;

        export default Ember.Component.extend({
          conditionOrder() {
            if (window.location && isBrowser()) {
              doStuff();
            }
          }
        });`,
      errors: [
        { message: WINDOW_MESSAGE }
      ]
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';

        export default Ember.Component.extend({
          badFunc() {
            return environment.isBrowser() || window;
          }
        });`,
      errors: [
        { message: WINDOW_MESSAGE }
      ]
    },
    {
      code: `
        import environment from 'ember-stdlib/utils/environment';
        const { isBrowser } = environment;

        export default Ember.Component.extend({
          badFunc() {
            return isBrowser() || window;
          }
        });`,
      errors: [
        { message: WINDOW_MESSAGE }
      ]
    }
  ]
});
