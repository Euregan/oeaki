module.exports = {
    env: {
        browser: true,
        node: true,
    },
    parser: 'babel-eslint',
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
    ],
    rules: {
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
                varsIgnorePattern: '^_',
            },
        ],
        'prettier/prettier': 'error',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};
