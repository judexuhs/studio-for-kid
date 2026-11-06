#!/bin/zsh
cd -- "${0:A:h}"
if ! command -v node >/dev/null; then
  print 'Pebli needs Node.js. Install it, then open this file again.'
  read
  exit 1
fi
if lsof -nP -iTCP:4175 -sTCP:LISTEN >/dev/null 2>&1; then
  print 'Port 4175 is already in use. If Pebli is running, open http://127.0.0.1:4175. Otherwise close that server and try again.'
  read
  exit 1
fi
print 'Pebli is opening at http://127.0.0.1:4175'
print 'Keep this window open while creating. Press Control-C to stop.'
exec npm run dev -- --open
