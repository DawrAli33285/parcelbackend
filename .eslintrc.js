module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-continue': 'off'
  }
}
