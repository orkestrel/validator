import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default [
    // Ignore build artifacts and dependencies
    {ignores: ['dist/**', 'node_modules/**']},
    // type-aware rules + stylistic fixes
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            '@stylistic': stylistic
        },
        languageOptions: {
            parserOptions: {
                projectService: true
            }
        },
        rules: {
            '@stylistic/quotes': ['error', 'single', {avoidEscape: true}],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/member-delimiter-style': [
                'error',
                {
                    multiline: {delimiter: 'semi', requireLast: true},
                    singleline: {delimiter: 'semi', requireLast: false}
                }
            ],
            '@typescript-eslint/no-unused-vars': ['error', { args: 'none', varsIgnorePattern: '^_' }],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {prefer: 'type-imports', fixStyle: 'inline-type-imports'}
            ],
            '@typescript-eslint/array-type': ['error', {default: 'array-simple'}],
            '@typescript-eslint/no-floating-promises': 'off'
        }
    },
    {
        files: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
        rules: {
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/require-await': 'off'
        }
    }
];
