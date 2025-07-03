import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel'
import { resolve } from 'path'

export default defineConfig({
	plugins: [
		babel({
			babelConfig: {
				presets: [['pota/babel-preset']],
			},
		}),
	],
	server: {
		port: 1339,
		open: '/',
	},
	build: {
		target: 'esnext',
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@assets': resolve(__dirname, 'src/assets'),
			'@components': resolve(__dirname, 'src/components'),
			'@js': resolve(__dirname, 'src/js'),
		},
	},
	optimizeDeps: {
		disabled: true,
	},
})
