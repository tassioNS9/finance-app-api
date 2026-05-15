import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.node,
            },
        },
    },
]
