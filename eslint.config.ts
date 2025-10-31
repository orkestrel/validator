import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';
import tsdoc from 'eslint-plugin-tsdoc';

// Centralized paths
const typesFile = 'src/types.ts';

// AST selector helpers for exported APIs (used by jsdoc rules)
const exportedFns = [
    'ExportNamedDeclaration > FunctionDeclaration',
    'ExportDefaultDeclaration > FunctionDeclaration',
];
const exportedClasses = [
    'ExportNamedDeclaration > ClassDeclaration',
    'ExportDefaultDeclaration > ClassDeclaration',
];
const exportedMethods = [
    'ExportNamedDeclaration > ClassDeclaration > ClassBody > MethodDefinition[kind="method"][accessibility!=private][accessibility!=protected]',
    'ExportDefaultDeclaration > ClassDeclaration > ClassBody > MethodDefinition[kind="method"][accessibility!=private][accessibility!=protected]',
];
const exportedGetters = [
    'ExportNamedDeclaration > ClassDeclaration > ClassBody > MethodDefinition[kind="get"][accessibility!=private][accessibility!=protected]',
    'ExportDefaultDeclaration > ClassDeclaration > ClassBody > MethodDefinition[kind="get"][accessibility!=private][accessibility!=protected]',
];
const exportedSetters = [
    'ExportNamedDeclaration > ClassDeclaration > ClassBody > MethodDefinition[kind="set"][accessibility!=private][accessibility!=protected]',
    'ExportDefaultDeclaration > ClassDeclaration > ClassBody > MethodDefinition[kind="set"][accessibility!=private][accessibility!=protected]',
];

// Narrowed selectors that exclude TypeScript type guard functions (those with a TSTypePredicate return)
const exportedFnsNoTypePredicate = exportedFns.map(s => `${s}:not(:has(TSTypePredicate))`);
const exportedMethodsNoTypePredicate = exportedMethods.map(s => `${s}:not(:has(TSTypePredicate))`);

// Toggle-able config blocks (spread into export default)
// 1) Enable JSDoc's built-in examples processor/config (MD code blocks, etc.)
const jsdocExamples = jsdoc.configs.examples; // array of flat config entries


// 2) JSDoc rules targeting exported APIs in src
const jsdocRules = [
    {
        files: ['src/**/*.ts', 'src/**/*.tsx'],
        plugins: { jsdoc },
        settings: {
            jsdoc: { mode: 'typescript', tagNamePreference: { returns: 'returns' } },
        },
        rules: {
            // JSDoc authoring across exported APIs
            'jsdoc/no-types': 'error',
            'jsdoc/require-jsdoc': [
                'error',
                {
                    publicOnly: { ancestorsOnly: false, cjs: true, esm: true },
                    contexts: [
                        ...exportedFns,
                        ...exportedClasses,
                        ...exportedMethods,
                        ...exportedGetters,
                        ...exportedSetters,
                    ],
                    checkConstructors: false,
                },
            ],
            'jsdoc/require-description': [
                'error',
                {
                    contexts: [
                        ...exportedFns,
                        ...exportedClasses,
                        ...exportedMethods,
                        ...exportedGetters,
                        ...exportedSetters,
                    ],
                },
            ],
            'jsdoc/require-param': [
                'error',
                { contexts: [...exportedFns, ...exportedMethods] },
            ],
            'jsdoc/require-param-description': [
                'error',
                { contexts: [...exportedFns, ...exportedMethods] },
            ],
            // For functions that are TS type guards (return type predicate), don't require @returns docs.
            'jsdoc/require-returns': [
                'error',
                {
                    contexts: [
                        // Exclude functions/methods that have a TSTypePredicate in their return type
                        ...exportedFnsNoTypePredicate,
                        ...exportedMethodsNoTypePredicate,
                        // Getters can never be type guards; keep them
                        ...exportedGetters,
                    ],
                },
            ],
            'jsdoc/require-returns-description': [
                'error',
                {
                    contexts: [
                        ...exportedFnsNoTypePredicate,
                        ...exportedMethodsNoTypePredicate,
                        ...exportedGetters,
                    ],
                },
            ],
            'jsdoc/require-example': [
                'error',
                { contexts: [...exportedFns, ...exportedMethods, ...exportedClasses] },
            ],
        },
    },
];

// 3) TSDoc syntax checking (lightweight, independent)
const tsdocRules = [
    {
        files: ['src/**/*.ts', 'src/**/*.tsx'],
        plugins: { tsdoc },
        rules: { 'tsdoc/syntax': 'error' },
    },
];

export default [
    // Ignore build artifacts and dependencies
    { ignores: ['dist/**', 'node_modules/**', 'guides/**', 'packages/**'] },

    // Enable JSDoc examples processor (toggle by commenting the next line)
    ...jsdocExamples,

    // Type-aware rules + stylistic fixes
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: { '@stylistic': stylistic },
        languageOptions: { parserOptions: { projectService: true } },
        rules: {
            '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/member-delimiter-style': [
                'error',
                {
                    multiline: { delimiter: 'semi', requireLast: true },
                    singleline: { delimiter: 'semi', requireLast: false },
                },
            ],
            '@typescript-eslint/no-unused-vars': ['error', { args: 'none', varsIgnorePattern: '^_' }],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
            ],
            '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/ban-ts-comment': [
                'error',
                { 'ts-ignore': true, 'ts-expect-error': 'allow-with-description' },
            ],
        },
    },
    // Source files overrides
    {
        files: ['src/**/*.ts', 'src/**/*.tsx'],
        rules: {
            'no-restricted-syntax': [
                'error',
                // Ban value assertions (casts) in source files
                { selector: 'TSAsExpression', message: 'Do not use type assertions (as). Prefer safer patterns like type guards, generics, inference, or the satisfies operator.' },
                { selector: 'TSTypeAssertion', message: 'Do not use angle-bracket type assertions (<T>value). Prefer safer patterns like type guards, generics, inference, or the satisfies operator.' },
                // Keep types/interfaces centralized in typesFile only
                { selector: 'TSTypeAliasDeclaration', message: `Define type aliases only in ${typesFile}.` },
                { selector: 'TSInterfaceDeclaration', message: `Define interfaces only in ${typesFile}.` },
            ],
        },
    },

    // Test files overrides
    {
        files: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
        rules: {
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
        },
    },

    // Toggle JSDoc/TSDoc rules for src by commenting/uncommenting these spreads
    ...jsdocRules,
    ...tsdocRules,

    // Allow type definitions in types file
    { files: [typesFile], rules: { 'no-restricted-syntax': 'off' } },
];