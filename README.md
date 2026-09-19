<div align="center">

<img src="app/icon.svg" width="72" alt="Loop clipboard logo">

# Clippy · Loop clipboard

Copy here. Use it over there.

A compact clipboard for your PC, phone, and tablet. Use it in a browser, share a private space over the internet, or run the Windows tray on your own Wi-Fi.

![JavaScript](https://img.shields.io/badge/JavaScript-ES_modules-f7df1e?logo=javascript&logoColor=111)
![Node](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white)
![Platforms](https://img.shields.io/badge/platforms-Web_%2B_Windows-303030)
![Font](https://img.shields.io/badge/font-JetBrains_Mono-8ddbaf)
[![License](https://img.shields.io/github/license/YumiNoona/clippy)](LICENSE)
[![Stars](https://img.shields.io/github/stars/YumiNoona/clippy?style=flat)](https://github.com/YumiNoona/clippy/stargazers)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYumiNoona%2Fclippy&env=UPSTASH_REDIS_REST_URL,UPSTASH_REDIS_REST_TOKEN&envDescription=Writable%20Upstash%20Redis%20REST%20credentials%20for%20private%20clipboard%20spaces&envLink=https%3A%2F%2Fgithub.com%2FYumiNoona%2Fclippy%23deploy-on-vercel)

</div>

## Do people need to install anything?

| How you use it | What you need | PC needs to stay awake? |
| --- | --- | --- |
| Public Vercel website, local clipboard | A browser | No |
| Private shared space on Vercel | A browser; the host configures Redis once | No |
| Nearby Wi-Fi / hotspot sharing | Run Loop on one Windows PC; other devices use a browser | Yes |
| System-wide Windows capture and Ctrl+Alt+V | Run the optional Windows tray | Yes, on the PC doing capture |

Share your **Vercel homepage** publicly. Each visitor starts with their own local clipboard. They can create a shared space and open its private invite on their other devices. There is no global clipboard containing every visitor’s clips.

Android, iPhone, iPad, laptops, and tablets use the responsive web interface. Browsers may offer **Install app / Add to Home Screen**; that is optional. Installing a web shortcut does not grant background clipboard access.

## Features

- Text, links, images, and files; search, pins, favorites, and type filters.
- Shared deletion and pinning; offline changes queue locally and retry when connected.
- Private invite-based spaces for hosted use, with durable Redis storage.
- Local-only use without accounts or backend configuration.
- Windows auto capture for new text, images, and copied files, plus a pause option.
- Compact Ctrl+Alt+V panel with pin, copy, menu actions, swipe-left deletion, and clear unpinned.
- Local JetBrains Mono fonts throughout the UI.

## Deploy on Vercel

1. Import **`YumiNoona/clippy`** into Vercel, or use the Deploy button above.
2. Use the **repository root** as Root Directory and select **Other** as the framework. If your Vercel project is already set to `app`, the compatibility files there also support that layout; redeploy after pulling the fix below.
3. Connect a writable **Upstash Redis** database, directly or through Vercel Marketplace.
4. Set the environment variables below for **Production**. Use a separate namespace/database for previews.
5. Deploy. Open the site, choose **Devices → Create new space**, and copy its invite to another device.

`vercel.json` supplies these settings automatically:

| Setting | Value |
| --- | --- |
| Framework preset | Other |
| Root Directory | Repository root; leave blank/default |
| Node.js | 22.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| API | Vercel Node function at `api/loop.mjs` |

If dashboard overrides already exist, remove them or match these values. Do **not** deploy `app` as the output directory: it contains local server and Windows files.

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `UPSTASH_REDIS_REST_URL` | For shared spaces | Redis HTTPS REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | For shared spaces | Writable, server-only Redis token |
| `LOOP_REDIS_NAMESPACE` | Recommended | Example: `loop-production`; use `loop-preview` for previews |
| `LOOP_SPACE_TTL_SECONDS` | Optional | Default `2592000`: expires after 30 days without successful sync |

Copy names from [.env.example](.env.example). Keep actual values in Vercel’s Environment Variables screen, never in Git or browser JavaScript. After changing environment variables, redeploy.

Without Redis credentials, the site still saves clips in the current browser. **Create space / shared sync** will explain that the host has not configured cloud storage.

Vercel Functions do not keep a durable local clipboard file. Hosted storage uses the [Upstash REST API](https://upstash.com/docs/redis/features/restapi) with atomic writes across concurrent requests. See [Vercel’s guidance on persistent files](https://vercel.com/kb/guide/how-can-i-use-files-in-serverless-functions) and [project configuration](https://vercel.com/docs/project-configuration/vercel-json).

### How to share the hosted app

1. Send people your Vercel homepage URL. They need only a browser.
2. Create a private space and share the **eight-character host code** or choose **Copy link**.
3. On another device, open the same Vercel URL, choose **Devices**, and enter the host code or paste the invite link. This works across different Wi-Fi networks and mobile data.
4. Add a clip. Other open devices pull changes every few seconds.

Creating or joining a space opens a separate clipboard. Existing local clips remain in **Use local clipboard**; they are not silently uploaded. To move a clip into a space, copy it, switch to the space, and paste it there.

An invite is a reusable **access credential**. Anyone holding it has read/write/delete access to that space; there are no viewer/admin roles or end-to-end encryption. Clips are accessible to the database operator. Device removal stops the recorded browser identity syncing until it joins again; it does not revoke the reusable invite. To stop sharing with someone who has the invite, create a new space and share it only with the remaining people.

### Hosted limits

- Images/files: 2 MB each; text: 1 million characters.
- Shared space: 3 MB of serialized data, including deletion records, and 2,000 item records.
- Deleted items retain tombstones so stale offline devices cannot restore them. A full space may require creating a new space.
- Spaces expire after 30 days without successful sync by default. Browser copies remain locally; the cloud space is not a backup service.
- Anonymous space creation and sync have basic request limits. Public hosts should monitor Vercel/Redis usage and configure their platform’s spend and abuse controls.

## Run on Windows / your Wi-Fi

Install [Node.js 22 LTS](https://nodejs.org/en/download), then:

```powershell
git clone https://github.com/YumiNoona/clippy.git
cd clippy
npm --prefix app ci
```

Double-click **Open Loop.vbs**. Look for the green Loop dot beside the Windows clock; double-click the dot to open the full app. **Ctrl+Alt+V** opens the quick clipboard panel. Right-click the tray to pause auto capture, start/stop the server, or open help.

For local PC mode, connect phones/tablets to the same Wi-Fi or hotspot, then use **Devices → Pair a phone or tablet** on the PC and scan the QR code. Run **`app/Enable Wi-Fi.cmd`** once if Windows Firewall prevents connection; it may request administrator access. Local mode cannot cross the public internet. For home/office/mobile-data connections, use the Vercel URL and a hosted shared space instead.

The local PC must be awake during transfers. You can close its browser window. At the office, use the same reachable Wi-Fi or connect the PC to your phone’s hotspot. Hosted spaces do not require the PC to stay on.

For a distributable Windows folder, use **`app/Make office copy.cmd`** after installing dependencies. It creates a ZIP in Downloads without your clips or keys. A Git checkout excludes the bundled `node.exe`; recipients need Node.js installed unless you separately include a properly licensed portable runtime.

The optional Windows tray currently captures into the **local Wi-Fi server**. It does not automatically upload your system clipboard to a Vercel space. On the hosted site, use browser clipboard controls or already-granted foreground clipboard access.

## Clipboard access on phones

Android/iOS browsers cannot continuously watch clipboard changes made in other apps in the background. Use **Paste** in Loop; when the browser requires it, long-press in **New text** and choose Paste. Clipboard capture while the page is focused works only where the browser has already granted the necessary permission.

These limits apply even when the website is installed to the Home Screen. See [browser clipboard security requirements](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) and [Android clipboard restrictions](https://developer.android.com/about/versions/10/privacy/changes#clipboard-data).

## Shortcuts

| Shortcut | Action |
| --- | --- |
| Ctrl+Alt+V | Windows quick panel; tray required |
| Ctrl+K | Search in the web app |
| Ctrl+Shift+L | New text clip |
| Ctrl+Enter | Save text editor |
| ↑ / ↓ | Move through clips |
| Ctrl+C / Enter | Copy focused clip (Enter in Windows panel) |
| Ctrl+P / Delete | Pin or delete in Windows panel |
| Escape | Close panel / editor |
| ? | Web shortcut help |

Use ⌘ instead of Ctrl for supported in-app shortcuts on Mac.

## Project layout

```text
app/                  Browser UI, local server, fonts, Windows tray, developer tests
api/loop.mjs          Hosted private-space API; Redis only, no local data files
scripts/build.mjs     Copies an allowlist of public browser assets to dist/
vercel.json           Vercel build, routing, and response headers
Open Loop.vbs         Everyday Windows launcher
How to use.html       Local Windows/Wi-Fi guide
.env.example          Environment variable names; no real credentials
```

`app/data`, dependencies, build output, logs, access keys, and release ZIPs are ignored. The public build excludes Windows scripts, backend source, local data, and tests. [Developer notes](app/DEVELOPMENT.md) describe the local protocol and existing test commands.

## License

[MIT](LICENSE). Bundled JetBrains Mono fonts retain their [SIL Open Font License](app/fonts/OFL.txt). Third-party dependencies and optional runtimes keep their respective licenses.
