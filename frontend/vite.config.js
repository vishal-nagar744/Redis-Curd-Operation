import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { StrictMode } from 'react';

export default defineConfig({
	jsx: 'react', // Specify 'react' to enable JSX parsing
	plugins: [react()],
	server: {
		host: true,
		StrictPort: true,
		port: 5174,
		historyApiFallback: true,
	},
	factory: 'React.createElement',
	fragment: 'React.Fragment',
});
