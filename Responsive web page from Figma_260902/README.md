# Dorota Jarošová — portfolio

Static site. No build step.

## Files
- `index.html` — home (hero + work index, one page)
- `about.html`, `contact.html`
- `site.css`, `site.js` — shared styles and behaviour

## Publish on GitHub Pages
1. Create a repo and push these files to the root of the default branch.
2. Settings → Pages → Source: *Deploy from a branch* → branch `main`, folder `/ (root)`.

## Editing
- Rotating hero word groups: `groups` array in `site.js`.
- Case study links: `href="#"` on each `.project` in `index.html`.
- Colours: `--cream` / `--blue` in `site.css`.
