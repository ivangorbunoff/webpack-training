const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

// проверка на режим dev (при помощи пакета cross-env, который определяет ОС, можно установить системную переменную,
// например NODE_ENV, если передать параметр в package.json в scripts)
const devMode = process.env.NODE_ENV === 'development';

const cssLoaders = (additional) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {},
        },
        'css-loader',
    ];

    if (additional) loaders.push(additional);

    return loaders;
}

const babelOptions = (preset) => {
    const opt = {
        // пресеты можно комбинировать, добавлять новые к уже существующим
        presets: ['@babel/preset-env'],
        // можно добавлять плагины (строка с названием плагина)
        plugins: []
    }

    if (preset) {
        opt.presets.push(preset);
    }

    return opt;
}

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                // для минимизации HTML
                collapseWhitespace: !devMode,
            }
        }),
        new CleanWebpackPlugin(),
        // плагин для копирования файлов
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({ // собирает стили в отдельный файл
            filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
        })
    ];

    if (!devMode) {
        // для открытия анализатора приложения
        base.push(new BundleAnalyzerPlugin());
    }

    return base;
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: './index.jsx',
        analitycs: './analitycs.ts',
    },
    output: {
        filename: devMode ? 'js/[name].js' : 'js/[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|jpg|sbg|gif)$/,
                use: ['file-loader'],
            },
            {
                test: /\.xml$/,
                use: ['xml-loader'],
            },
            {
                test: /\.csv$/,
                use: ['csv-loader'],
            },
            {
                // babel
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions(),
                }
            },
            {
                // babel
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript'),
                }
            },
            {
                // babel
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react'),
                }
            }
        ]
    },
    resolve: {
        extensions: ['.csv', '.xml', '.png', '.js', '.json'], // при импорте теперь можно не записывать расширения
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all', // чтобы не грузить библиотеки повторно, если более одной точки входа в приложение, и в них подключается одна и та-же библиотека
        },
        runtimeChunk: 'single', // для автообновления страницы при изменении файлов
        minimizer: [
            new CssMinimizerPlugin(), // минимизация CSS
            new TerserPlugin(), // минимизация JS
        ]
    },
    // dev-server тоже собирает бандл, но кладет их в оперативку, для производительности
    devServer: {
        port: 8080,
        //для автоматического открытия страницы
        // open: true,
    },
    // для инструмента разработчика
    devtool: devMode && 'source-map',
}