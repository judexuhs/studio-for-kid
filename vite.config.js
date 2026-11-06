import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {pebliApi} from './server/plugin.js';
export default defineConfig({plugins:[react(),pebliApi()],build:{outDir:'dist'},preview:{host:'127.0.0.1',port:4175,strictPort:true},server:{host:'127.0.0.1',port:4175,strictPort:true,watch:{usePolling:true,interval:500,ignored:["**/.pebli-data/**","**/.agents/**","**/node_modules/**","**/evidence/**"]}}});
