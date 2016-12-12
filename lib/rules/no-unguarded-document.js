/**
 * @fileOverview Disallow the use of unguarded document references.
 * @author Steve Calvert
 */
'use strict';

const { get } = require('../utils/get');
const { isBrowser, isEnvironmentBrowser, getEnvironmentImportBinding } = require('../utils/bpr');
const { isInActions, isInteractive } = require('../utils/interactive');
const { collectObjectPatternBindings } = require('../utils/destructed-binding');
const { shouldExecuteRule, TEST_FILE_PATTERN } = require('../utils/context');

const MESSAGE = 'Do not use unguarded document references. Please see the following guide for more infromation: http://github.com/scalvert/ember-bpr-lint/blob/master/guides/rules/no-unguarded-document.md';

/**
 * Determines if the current node is a document reference.
 * @param {ASTNode} node The identifier node.
 * @returns {Boolean} Returns true if a document reference is found, otherwise false.
 */
function isDocumentReference(node) {
  return get(node, 'callee.object.name') === 'document';
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
        if (isDocumentReference(node)) {
          if (!isInActions(node) && !isInteractive(node) && !isBrowser(node) && !isEnvironmentBrowser(node)) {
            context.report(node, MESSAGE);
          }
        }
      }
    };
  }
};
