export default {
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['public/js/app/__tests__/**/*.test.js'],
        exclude: ['node_modules'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'public/',
            ]
        }
    }
};