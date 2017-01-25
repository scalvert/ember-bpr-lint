/**
 * @fileOverview Disallow the use of unguarded window references.
 * @author Steve Calvert
 */
'use strict';

const { get } = require('../utils/get');
const { isBrowser, isEnvironmentBrowser, getEnvironmentImportBinding } = require('../utils/bpr');
const { isInActions, isInteractive } = require('../utils/interactive');
const { collectObjectPatternBindings } = require('../utils/destructed-binding');
const { shouldExecuteRule, TEST_FILE_PATTERN } = require('../utils/context');

const MESSAGE = 'Do not use unguarded window references. Please see the following guide for more infromation: http://github.com/scalvert/ember-bpr-lint/blob/master/guides/rules/no-unguarded-window.md';

/**
 * Determines if the current node is a window reference.
 * @param {ASTNode} node The identifier node.
 * @returns {Boolean} Returns true if a window reference is found, otherwise false.
 */
function isWindowReference(node) {
  return (get(node, 'object.name') || get(node, 'name')) === 'window';
}

module.exports = {
  docs: {
    description: 'Disallow the use of unguarded document references',
    category: 'Best Practices',
    recommended: false
  },
  meta: {
    message: MESSAGE
  },
  create(context) {
    let environmentImportBinding;
    let destructuredBindings = [];

    // We explicitly ignore executing this rule against test files, as we're only concerned with
    // application code.
    if (!shouldExecuteRule(context, TEST_FILE_PATTERN)) {
      return {};
    }

    function checkForWindow(context, node) {
      if (isWindowReference(node)) {
        const isEnvironmentImported = !!environmentImportBinding && destructuredBindings.includes('isBrowser');
        const isGuarded = (isEnvironmentImported && isBrowser(node)) || isEnvironmentBrowser(node);

        if (!isInActions(node) && !isInteractive(node) && !isGuarded) {
          context.report(node, MESSAGE);
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

      MemberExpression(node) {
        checkForWindow(context, node);
      },

      Identifier(node) {
        checkForWindow(context, node);
      }
    };
  }
};