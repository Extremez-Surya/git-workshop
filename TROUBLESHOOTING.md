# Troubleshooting

| You see | Fix |
|---|---|
| `git: command not found` / `'git' is not recognized` | Close the terminal and open a new one. Windows: use **Git Bash**. Still broken: reinstall. |
| `Author identity unknown` / `Please tell me who you are` | `git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"` |
| `Password authentication is not supported` | GitHub doesn't take passwords in the terminal. Windows: reinstall Git with **Git Credential Manager**. macOS/Linux: `gh auth login`. |
| `Permission denied (publickey)` | Your remote uses SSH. Switch to HTTPS: `git remote set-url origin https://github.com/<you>/git-workshop.git` |
| `remote: Permission to exitflynn/git-workshop.git denied` | You cloned the original, not your fork. `git remote set-url origin https://github.com/<you>/git-workshop.git` |
| `fatal: not a git repository` | You're in the wrong folder. `pwd` to check, `cd` into the repo. |
| A screen full of `~` and you can't type / exit | You're in Vim. Press `Esc`, type `:wq`, press `Enter`. Then: `git config --global core.editor "code --wait"` |
| Editor opened and git is "waiting" | Write the message, **save and close the tab**. Git continues. |
| `CONFLICT (content): Merge conflict in ...` | Expected in the practice! Open the file, keep what you want, delete the `<<<<<<<` `=======` `>>>>>>>` lines, then `git add <file>` and `git commit`. |
| `error: src refspec main does not match any` | You haven't committed yet. `git add .` then `git commit -m "..."` first. |
| `Your branch is behind` / push rejected | `git pull`, then push again. |
| `LF will be replaced by CRLF` (Windows) | Just a warning. Ignore it. |
| macOS popup: "install command line developer tools" | Click Install, wait for it to finish, run the command again. |
| Accidentally ran `git init` in your home folder | `ls -a ~` shows `.git` → `rm -rf ~/.git` (only that folder!). |
| Bot says your file name is wrong | Rename to your exact GitHub username: `git mv participants/old.md participants/<you>.md`, commit, push. |

Still stuck: ask your neighbour, or use a Codespace (see [SETUP.md](SETUP.md#nothing-works)).
