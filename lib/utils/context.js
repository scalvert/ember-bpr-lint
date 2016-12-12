
const TEST_FILE_PATTERN = /^(?!.*test).*$/;

function shouldExecuteRule(context, pattern) {
  let fileName = context.eslint.getFilename();

  return !!fileName.match(pattern);
}

module.exports = {
  shouldExecuteRule,
  TEST_FILE_PATTERN
};
