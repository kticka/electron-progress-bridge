module.exports = [
  {
    'rules': {
      'no-console':     'warn',
      'no-debugger':    'warn',
      'no-unused-vars': ['warn', {argsIgnorePattern: 'req|res|resolve|reject|next', caughtErrorsIgnorePattern: 'err|error|e'}],
      'prefer-const':   'error',
      'camelcase':      ['warn', {properties: 'never'}]
    },
  },
  {
    ignores: ['node_modules/*', 'test/*']
  }
]