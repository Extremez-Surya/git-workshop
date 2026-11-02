# Lab stage 1: your first repo

Solo, on your laptop. No GitHub needed. Run each line, read the output.
Unsure what's going on? `git status`.

## Make a repo

```sh
cd ~
mkdir git-practice
cd git-practice
git init
git status
```

## First commit

```sh
echo 'print("Hello")' > greet.py
git status            # untracked
git add greet.py
git status            # staged
git commit -m "Add greeting"
```

## Second commit

```sh
echo 'print("Bye")' >> greet.py
git status            # modified
git diff              # what changed
git add greet.py
git commit -m "Add goodbye"
git log
```

## Look inside

```sh
git cat-file -p HEAD          # the commit: tree, parent, author, message
cat .git/refs/heads/main      # the branch: just a hash
```

## Branch

```sh
git switch -c loud
cat .git/refs/heads/loud      # same hash as main
```

Open `greet.py` (`code greet.py`), change line 1 to `print("HELLO!")`, save.

```sh
git commit -am "Shout the greeting"
git switch main
```

Look at `greet.py` again. Your change is gone? It's on the `loud` branch.

Change line 1 to `print("Hello, world")`, save.

```sh
git commit -am "Greet the world"
```

## Merge (and conflict)

```sh
git merge loud
```

You'll get a conflict. That's the point. Open `greet.py`:

```
<<<<<<< HEAD
print("Hello, world")
=======
print("HELLO!")
>>>>>>> loud
print("Bye")
```

Keep the line you want, delete the three marker lines, save. Then:

```sh
git add greet.py
git commit -m "Merge loud"
git cat-file -p HEAD          # two parent lines
git log --oneline
```

Done → [stage 2](../CONTRIBUTING.md).
