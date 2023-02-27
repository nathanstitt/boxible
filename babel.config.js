const config = {
    presets: [
        ['@babel/preset-env', {targets: {node: 'current'}}],
        ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
    ],
    "plugins": [
    ],
};

export default config
