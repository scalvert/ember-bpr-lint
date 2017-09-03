const { get, getParent } = require('../utils/get');
const EMPTY_CALLEES = Object.freeze([]);

/**
 * Gets all the callee from a condition.
 * @param {ASTNode} node
 * @param {ASTNode} globalReferenceNode
 * @return {Array}
 */
function _getConditions(node, globalReferenceNode) {
  let callees = [];

  if (!node.test) {
    return callees;
  }

  // condition only has one logical expression
  _getCallee(node.test, callees);

  if (node.test.left) {
    // If the global reference is part of the conditional and is on the left side (i.e. it's before the
    // isBrowser check), return an empty array of callees to make isEnvironmentBrowser/isBrowser check false.
    if (isGlobalBeforeIsBrowser(node, globalReferenceNode)) {
      return EMPTY_CALLEES;
    }
    _getCallee(node.test.left, callees);
  }

  if (node.test.right) {
    if (isGlobalAfterOrOperator(node, globalReferenceNode)) {
      return EMPTY_CALLEES;
    }
    _getCallee(node.test.right, callees);
  }

  return callees;
}

/**
 * Function to recursively collect the callees of a given node.
 * @param {ASTNode} node
 * @param {Array} callees
 */
function _getCallee(node, callees) {
  if (node.callee) {
    callees.push(node.callee);
  }

  if (node.left) {
    _getCallee(node.left, callees);
  }

  if (node.right) {
    _getCallee(node.right, callees);
  }
}
/**
 * Checks whether the global reference node is part of the conditional.
 * (e.g. `if (isBrowser() && widow.atob())` )
 * @param {ASTNode} ifStatementNode
 * @param {ASTNode} globalReferenceNode
 * @return {Boolean}
 */
function isGlobalPartofCondition(ifStatementNode, globalReferenceNode) {
  return !!getParent(globalReferenceNode, (parentNode) => parentNode === ifStatementNode);
}
/**
 * Checks if the global reference is part of the conditional and is before the isBrowser check.
 * @param {ASTNode} node
 * @param {ASTNode} globalReferenceNode
 * @return {Boolean}
 */
function isGlobalBeforeIsBrowser(node, globalReferenceNode) {
  return isGlobalPartofCondition(node, globalReferenceNode) && node.test.left.object === globalReferenceNode;
}
/**
 * Checks if the global reference is part of the conditional and is after an OR operator (and thus unguarded).
 * @param {ASTNode} node
 * @param {ASTNode} globalReferenceNode
 * @return {Boolean}
 */
function isGlobalAfterOrOperator(node, globalReferenceNode) {
  return isGlobalPartofCondition(node, globalReferenceNode)
    && node.test.right.object === globalReferenceNode
    && node.test.operator === '||';
}

/**
 * Gets the IfStatement's callees to determine if any of them are `isBrowser`.
 * @param {ASTNode} node - IfStatement node
 * @param {ASTNode} globalReferenceNode - global reference node
 * @return {Boolean}
 */
function _isBrowser(node, globalReferenceNode) {
  let callees = _getConditions(node, globalReferenceNode);

  return callees.some(function(callee) {
    return callee && callee.name === 'isBrowser';
  });
}

/**
 * Gets the IfStatement's callees to determine if any of them are `enviroment.isBrowser`.
 * @param {ASTNode} node - IfStatement node
 * @param {ASTNode} globalReferenceNode - global reference node
 * @return {Boolean}
 */
function _isEnvironmentBrowser(node, globalReferenceNode) {
  let callees = _getConditions(node, globalReferenceNode);

  return callees.some(function(callee) {
    let obj = callee.object;
    let prop = callee.property;

    return obj && obj.name === 'environment' && prop && prop.name === 'isBrowser';
  });
}

function isIfStatement(node) {
  return node.type === 'IfStatement';
}

/**
 * This function checks if the global reference has a parent which is an IfStatement and whether the global is properly
 * protected by `isBrowser`.
 * @param {ASTNode} globalReferenceNode - The node which a global reference
 * @return {ASTNode}
 */
function isBrowser(globalReferenceNode) {
  return getParent(globalReferenceNode, (node) => isIfStatement(node) && _isBrowser(node, globalReferenceNode));
}
/**
 * This function checks if the global reference has a parent which is an IfStatement and whether the global is properly
 * protected by `enviroment.isBrowser`.
 * @param {ASTNode} globalReferenceNode - The node which a global reference
 * @return {ASTNode}
 */
function isEnvironmentBrowser(globalReferenceNode) {
  return getParent(globalReferenceNode, (node) => isIfStatement(node) && _isEnvironmentBrowser(node, globalReferenceNode));
}

function getEnvironmentImportBinding(node) {
  if (get(node, 'parent.source.raw').includes('ember-stdlib/utils/environment')) {
    return node.local.name;
  }
}

module.exports = {
  isBrowser,
  isEnvironmentBrowser,
  getEnvironmentImportBinding
};
