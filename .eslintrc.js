module.exports = {
    env: {
        browser: true,
        node: true,
    },
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
        'no-console': [
            'error',
            {
                allow: ['warn', 'error'],
            },
        ],
        'no-unused-vars': [
            'error',
            {
                ignoreRestSiblings: true,
            },
        ],
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
