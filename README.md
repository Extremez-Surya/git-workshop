# Intro to FOSS & Git

Workshop by Akshit Tyagi ([@exitflynn](https://github.com/exitflynn)).

- **Slides:** <https://exitflynn.github.io/git-workshop/>
- **Wall:** <https://exitflynn.github.io/git-workshop/wall/>

## Attendees

1. [SETUP.md](SETUP.md): install Git, make a GitHub account. **Start now.**
2. [practice/](practice/README.md): lab stage 1, your first repo.
3. [CONTRIBUTING.md](CONTRIBUTING.md): lab stage 2, your first pull request.
4. [TROUBLESHOOTING.md](TROUBLESHOOTING.md): when something breaks.

## Maintainers

```
slides/        Slidev deck: slides.md (text, diagrams, speaker notes)
participants/  one card per attendee: <github-username>.md
wall/          card parser + wall page; build: node wall/build.cjs
.github/       validate-pr.yml (checks + auto-merges cards), pages.yml (deploys slides + wall)
.devcontainer/ Codespaces fallback
```

**Edit slides:**

```sh
cd slides
npm install
npm run dev        # live preview at http://localhost:3030, presenter view at /presenter
npm run build      # static HTML → ../dist
npm run export     # PDF (needs: npx playwright install chromium)
```

**Preview the wall:** `node wall/build.cjs && npx serve dist/wall`

**One-time GitHub setup:**
1. Settings → Pages → Source: **GitHub Actions**.
2. For auto-merge: Settings → Secrets and variables → Actions → Variables → `AUTO_MERGE` = `true`. Leave unset to merge by hand.
3. Settings → General → Pull Requests: allow **squash merging**.

## License

[MIT](LICENSE), except the third-party images below.

Third-party images in `slides/public/`, both non-commercial:
- `carmena/*.png`: Rachel M. Carmena, [How to teach Git](https://rachelcarmena.github.io/2018/12/12/how-to-teach-git.html), CC BY-NC 4.0
- xkcd 2347 (hotlinked): Randall Munroe, CC BY-NC 2.5

Teaching approach for the Git section: [The Git Parable](https://tom.preston-werner.com/2009/05/19/the-git-parable), Tom Preston-Werner.
