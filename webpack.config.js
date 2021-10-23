const path = require('path');
module.exports = {
	entry: './src/index.ts',
	devtool: 'inline-source-map',
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