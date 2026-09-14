# Loop internals

Everyday use: open `../Open Loop.vbs` or the desktop Loop shortcut. The short user guide is `../How to use.html`.

Run commands from this `app` directory:

```
npm ci
npm test
npm start
```

Node.js 22+ is required. The launcher prefers installed Node, with `runtime/node.exe` as the portable fallback. Keep the firewall program path consistent with the runtime in use. QR codes are generated locally using qrcode.

`server.mjs` serves the HTML, JS, manifest, and icons through an explicit allowlist; it never serves data, logs, scripts, tests, or dependencies. The default endpoint is `http://localhost:4317`, with LAN listening on all IPv4 interfaces. `HOST` and `PORT` can override listening; changing the port requires a matching firewall change.

`app.js` contains browser behavior, IndexedDB persistence, and sync. `clipsync.html` contains markup and `ui.css` styles; fonts are bundled locally. `sw.js` provides offline shell caching in secure contexts (localhost); ordinary LAN HTTP cannot use service-worker offline installation. Previously loaded LAN pages can still queue local edits while open.

`QuickClipboard.cs` provides the Windows quick panel and an STA clipboard capture timer started by `Loop Tray.ps1`. Capture watches new clipboard sequence numbers, skips the initial clipboard and explicit monitor-excluded content, and supports text, PNG images, and copied files within existing limits. Failed sends retry from a bounded in-memory queue; closing the tray loses that unsent queue. The tray menu can pause capture. Mobile web clipboard access still depends on browser permissions and foreground access.

`data/clipboard.json` and `data/access-key.txt` are private persistent files. Logs go into `data/logs/`. Never bundle `data` into an office copy. Browser storage is scoped to the site address; changing Wi-Fi/IP may require pairing again and does not migrate an old unsent browser queue.

Pairing codes are generated only from authenticated localhost requests, expire in five minutes, are single-use, and lock after ten attempts. Localhost grants this personal PC access automatically. Local-network traffic uses authenticated HTTP, not transport encryption. Avoid untrusted networks and public port forwarding.

The sync server merges independent items, recognizes retried mutations, rejects stale edits, and preserves deletion tombstones. Text/files are stored in plaintext; back up data with the server stopped. Limits: 2 MB per file/image, 1 million text characters, 64 MB total server storage.

Tests use temporary data. `npm test` covers the backend and pairing. `tests/browser.mjs` and `tests/lan-browser.mjs` use Playwright with installed Edge; set `PLAYWRIGHT_MODULE` to an existing module path if Playwright isn't locally installed. The LAN suite needs a private IPv4 interface. Screenshots are generated under ignored `test-results/` and can be deleted.

`Make office copy.cmd` creates a fresh distributable ZIP in Downloads using an explicit allowlist. It includes the launcher, guide, app, dependencies, and bundled Windows runtime, but no user data, screenshots, or development tests.

Windows status: Loop Status.ps1 probes 127.0.0.1/api/health with proxies disabled. Start Loop.ps1 serializes startup with a named mutex and starts one Loop Tray.ps1 monitor. The tray polls every three seconds, displays running/stopped state, and stops only this authenticated local server through POST /api/stop. The browser URL remains localhost so existing browser storage is preserved.
