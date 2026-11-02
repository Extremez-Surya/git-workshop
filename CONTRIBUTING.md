# Contributing: add your Top 4

Your first pull request: add a card with your four favourite movies to the [wall](https://exitflynn.github.io/git-workshop/wall/).

Not set up yet? → [SETUP.md](SETUP.md). Stuck? → [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## 1. Fork

On <https://github.com/exitflynn/git-workshop> click **Fork** → **Create fork**.
You now have your own copy: `github.com/<you>/git-workshop`.

## 2. Clone your fork

Replace `<you>` with your GitHub username:

```sh
cd ~
git clone https://github.com/<you>/git-workshop.git
cd git-workshop
```

## 3. Branch

```sh
git switch -c add-<you>
```

## 4. Add your card

Copy the example and edit it. The file name **must be your GitHub username**:

```sh
cp participants/exitflynn.md participants/<you>.md
code participants/<you>.md
```

```md
---
name: Your Name
top4:
  - Movie One
  - Movie Two
  - Movie Three
  - Movie Four
---
Optional one-liner (max 140 characters).
```

Only add your own file. Don't edit anyone else's.

## 5. Commit and push

```sh
git status
git add participants/<you>.md
git commit -m "Add <you>'s top 4"
git push -u origin add-<you>
```

First push on Windows: a browser window opens. Sign in.

## 6. Open the pull request

Open your fork on GitHub. Click **Compare & pull request** → **Create pull request**.

A bot checks your card within a minute.
- ✅ It gets merged and appears on the wall.
- ❌ Read the bot's comment, fix the file, then `git add`, `git commit`, `git push` again. The same PR updates.

## 7. Bonus: get everyone else's cards

```sh
git remote add upstream https://github.com/exitflynn/git-workshop.git
git pull upstream main
ls participants
```

## Other contributions

Found a typo in the slides or docs? Fix it and open a PR. That's open source.
