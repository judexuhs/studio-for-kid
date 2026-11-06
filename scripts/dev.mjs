// Environment files are loaded only by the server runtime; never sent to the browser.
import {existsSync} from 'node:fs';
import {execFile} from 'node:child_process';
import {createServer,preview} from 'vite';
for(const path of [process.env.PEBLI_ENV_FILE,new URL('../.env.local',import.meta.url)].filter(Boolean)){if(existsSync(path))process.loadEnvFile(path)}
const server=process.argv.includes('--preview')?await preview():await createServer();
if(server.listen)await server.listen();server.printUrls();
if(process.argv.includes('--open'))execFile('open',['http://127.0.0.1:4175']);
