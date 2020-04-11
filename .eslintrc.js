module.exports = {
    parser: 'babel-eslint',
    plugins: ['prettier', 'flowtype', 'react'],
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:react/recommended',
        'plugin:flowtype/recommended',
        'plugin:react-hooks/recommended',
    ],
    rules: {
        'prettier/prettier': 'error',
        'react/react-in-jsx-scope': 'off',
    },
};
