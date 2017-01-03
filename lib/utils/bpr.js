const { get, getParent } = require('../utils/get');

function _getConditions(node) {
  let callees = [];

  if (!node.test) {
    return callees;
  }

  // condition only has one logical expression
  _getCallee(node.test, callees);

  if (node.test.left) {
    _getCallee(node.test.left, callees);
  }

  if (node.test.right) {
    _getCallee(node.test.right, callees);
  }

  return callees;
}

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

function _isBrowser(node) {
  let callees = _getConditions(node);

  return callees.some(function(callee) {
    return callee && callee.name === 'isBrowser';
  });
}

function _isEnvironmentBrowser(node) {
  let callees = _getConditions(node);

  return callees.some(function(callee) {
    let obj = callee.object;
    let prop = callee.property;

    return obj && obj.name === 'environment' && prop && prop.name === 'isBrowser';
  });
}

function isIfStatement(node) {
  return node.type === 'IfStatement';
}

function isBrowser(node) {
  return getParent(node, (node) => isIfStatement(node) && _isBrowser(node));
}

function isEnvironmentBrowser(node) {
  return getParent(node, (node) => isIfStatement(node) && _isEnvironmentBrowser(node));
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