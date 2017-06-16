/**
 * @fileOverview Disallow the use of unguarded global references, such as window and document.
 * @author Steve Calvert
 */
'use strict';

const { get } = require('../utils/get');
const { isBrowser, isEnvironmentBrowser, getEnvironmentImportBinding } = require('../utils/bpr');
const { isInActions, isInteractive } = require('../utils/interactive');
const { collectObjectPatternBindings } = require('../utils/destructed-binding');

const BROWSER_GLOBALS = ['window', 'document'];

/**
 * Determines if the current name is a global reference.
 * @param {String} name The name of the node.
 * @returns {Boolean} Returns true if a global reference is found, otherwise false.
 */
function isGlobalReference(name) {
  return BROWSER_GLOBALS.includes(name);
}

/**
 * Gets the name from the node.
 * @param {ASTNode} node The identifier node.
 * @returns {String} Returns the name if found, or an empty string.
 */
function getName(node) {
  return get(node, 'callee.object.name') || get(node, 'object.name') || get(node, 'name') || '';
}

function getMessage(globalName) {
  return `Do not use unguarded ${globalName} references. Please see the following guide for more infromation: http://github.com/scalvert/ember-bpr-lint/blob/master/guides/rules/no-unguarded-globals.md`;
}

module.exports = {
  docs: {
    description: 'Disallow the use of unguarded global references, which causes issues with server side rendering.',
    category: 'Best Practices',
    recommended: false
  },
  meta: {
    message: getMessage
  },
  create(context) {
    let environmentImportBinding;
    let destructuredBindings = [];

    function checkForGlobal(context, node) {
      let name = getName(node);

      if (isGlobalReference(name)) {
        const isEnvironmentImported = !!environmentImportBinding && destructuredBindings.includes('isBrowser');
        const isGuarded = (isEnvironmentImported && isBrowser(node)) || isEnvironmentBrowser(node);

        if (!isInActions(node) && !isInteractive(node) && !isGuarded) {
          context.report(node, getMessage(name));
        }
      }
    }

    return {
      ObjectPattern(node) {
        if (environmentImportBinding) {
          destructuredBindings = destructuredBindings.concat(collectObjectPatternBindings(node, {
            [environmentImportBinding]: ['isBrowser']
          }));
        }
      },

      ImportDefaultSpecifier(node) {
        environmentImportBinding = getEnvironmentImportBinding(node);
      },

      CallExpression(node) {
        checkForGlobal(context, node);
      },

      Identifier(node) {
        checkForGlobal(context, node);
      }
    };
  }
};
