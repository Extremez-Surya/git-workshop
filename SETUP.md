# Setup

Do steps 1–3 now. They take a while; the workshop continues while they run.

## 1. GitHub account

1. Sign up at <https://github.com/signup>.
2. **Verify your email** (check spam).
3. Turn on 2FA: Settings → Password and authentication → Enable two-factor authentication. GitHub requires it before you can contribute.

Already have an account? Make sure you can log in and know which email it uses.

## 2. Install Git

### Windows

Download from <https://git-scm.com/download/win> (64-bit installer), run it.

Click **Next** on everything **except these screens**:

| Screen | Choose |
|---|---|
| Choosing the default editor | **Use Visual Studio Code as Git's default editor** (or **Nano** if you don't have VS Code). Not Vim. |
| Adjusting the name of the initial branch | **Override the default branch name** → `main` |
| Choose a credential helper | **Git Credential Manager** (default, keep it) |

After installing: open **Git Bash** from the Start menu. Use Git Bash for the whole workshop.

<details><summary>Prefer the command line?</summary>

In PowerShell: `winget install --id Git.Git -e --source winget`, then close and reopen your terminal.
</details>

### macOS

Open **Terminal** and run:

```sh
git --version
```

If a popup asks to install **Command Line Tools**, click **Install**. It's a large download, start it now. If it prints a version, you're done.

### Linux

```sh
sudo apt install git        # Debian / Ubuntu
sudo dnf install git        # Fedora
sudo pacman -S git          # Arch
```

macOS and Linux: also install the GitHub CLI for login: <https://cli.github.com>.

## 3. Configure Git

In Git Bash (Windows) or Terminal (macOS/Linux). Use **the same email as your GitHub account**:

```sh
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"     # or: nano
```

## 4. Log in to GitHub

- **Windows:** nothing to do. A browser window opens the first time you `git push`. Sign in there.
- **macOS / Linux:** run `gh auth login` → GitHub.com → HTTPS → Yes (authenticate Git) → Login with a web browser.

You'll use HTTPS, not SSH. (SSH is optional, see the end of this file.)

## 5. Verify

```sh
git --version
git config --global user.name
git config --global user.email
```

Three lines, no errors? You're ready. Errors → [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## Nothing works?

Use a **Codespace**: a computer in your browser with Git already set up.
Fork this repo → on your fork click **Code → Codespaces → Create codespace on main**.
Then follow [CONTRIBUTING.md](CONTRIBUTING.md) in its terminal.

---

## Optional: SSH instead of HTTPS

Only if you want it. Not needed today.

```sh
ssh-keygen -t ed25519 -C "you@example.com"     # press Enter for defaults
cat ~/.ssh/id_ed25519.pub                        # copy the output
```

GitHub → Settings → SSH and GPG keys → New SSH key → paste. Test:

```sh
ssh -T git@github.com
```

If port 22 is blocked on your network, see <https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port>.
