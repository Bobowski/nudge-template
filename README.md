# nudge-template

The first commit of every app that [nudgethis](https://github.com/stariodev/nudgethis) makes.

It is a [Stario](https://stario.dev) app, made with `uvx stario-create@latest new starter`. [Yard](https://github.com/stariodev/yard) builds it with no Containerfile. Its `static/js/nudge.js` lets nudgethis work with the app from a phone: when nudgethis asks, the page sends a picture of itself, and it reloads in place when a change is live.

## How nudgethis uses it

nudgethis copies these files into a new private repo, `nudge-<name>`, as one commit. On the way it:

- puts the app's name in place of `starter` in `pyproject.toml`, `app/config.py`, and `uv.lock`;
- puts its own address in place of `NUDGETHIS_ORIGIN` in `static/js/nudge.js`, so that the app answers only that nudgethis;
- leaves out this README and the LICENSE: the new app belongs to the person who made it.

To start apps from your own template, fork this repo and set `NUDGE_TEMPLATE` in nudgethis. Keep `static/js/nudge.js` and `static/js/screenshot.js`, and keep `starter` as the name. A private template works if Yard's GitHub app can read it.

## Run

```bash
just dev
```

## Check

```bash
just check
```

To refresh the Stario files, run `just sync` and push.

## License

[MIT No Attribution](LICENSE). An app made from this template owes no notice.
