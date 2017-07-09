module.exports = function (ob) {
    console.log(ob)
    return {
        devtool: 'inline-source-map',
        entry: ob.entry,
        output: {
            path: ob.outputPath,
            filename: ob.outputFilenam,
            library: ob.name,
            libraryTarget: 'umd'
        },

        // Enable sourcemaps for debugging webpack's output.
        devtool: "source-map",

        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
        },

        module: {
            rules: [
                // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
                {test: /\.tsx?$/, loader: "ts-loader"}
            ]
        },

        plugins: [].concat(ob.plugins || [])
    };
}