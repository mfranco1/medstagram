module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['react', 'react-hooks', 'jsx-a11y', 'tailwindcss'],
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:react-hooks/recommended',
      'plugin:tailwindcss/recommended',
      'prettier'
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
  };
  