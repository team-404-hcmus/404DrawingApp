const path = require('path');
process.NODE
module.exports = {
	mode:'development',
	entry: './src/index.ts',
	devtool: 'inline-source-map',
	devServer: {
		static: './dist',
	},
	module: {
	  rules: [
	    	{
	     		test: /\.tsx?$/,
	     		use: 'ts-loader',
	      		exclude: /node_modules/,
	   	},
		{
			test: /\.glsl$/,
			use: 'raw-loader',
		},
	  ],
	},
	resolve: {
	  extensions: ['.tsx', '.ts', '.js','.glsl'],
	},
	output: {
	  filename: 'bundle.js',
	  path: path.resolve(__dirname, 'dist'),
	},
};