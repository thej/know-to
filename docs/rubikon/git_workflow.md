![Git Workflow](img/git_workflow.png)

# Branches

- **master** — this is the version that will be deployed to live-clients
- **develop** — here most of the work happens, including bugfixes, enhancements and polish
- **feature(s)** — bigger features should be developed in individual branches, named after the feature itself. Each feature should get its won branch, to be merged by the developer
- **releases/staging** — this branch will be created and heavily tested closer to a new release. While it exists, it should be seen as a freeze of the development-branch
- **hotfixes** — dramatic bugs or security problems should be implemented in this branch, to be merged with master, asap

## master and develop
- only production ready in master
- develop reflects latest development changes for the next release

## feature branch
+ branch off from *develop*
+ must merge back to *develop*

#### create a feature branch
```
git checkout -b feature-blablub develop
```

#### merge back
```
git checkout develop
git merge --no-ff feature-blablub
git branch -d feature-blablub
git push origin develop
```

## release branch
+ branch off *develop*
+ merge back into *master*
+ naming convention: *release-x*
- branch from development when it reaches near release ready state
- "freezes" develop, all changes go into the release branch if one exists

#### create release branch
```
git checkout -b release-1.2 develop
./bump-version.sh 1.2
git commit -a -m "Bump to version 1.2" 
```

#### finish release
```
git checkout master
git merge --no-ff release-1.2
git tag -a 1.2
git push --tags
```

#### merge back into develop
```
git checkout develop
git merge --no-ff release-1.2
```
Resolve potential merge conflicts

#### delete branch
`git branch -d release-x` (locally)
`git push -d origin release-x` (remotely)


## hotfix branch
+ may branch off from *master*
+ must merge back into *develop* and *master*
+ naming convention: *hotfix-x*

#### create hotfix branch
```
git checkout -b hotfix-1.2.1 master
./bump-version.sh 1.2.1
git commit -a -m "Bump to version 1.2.1" 
```

#### finish fix
```
git checkout master
git merge --no-ff hotfix-1.2.1
git tag -a 1.2.1
```

#### merge back into develop
```
git checkout develop
git merge --no-ff hotfix-1.2.1
```

#### remove branch
`git branch -d hotfix-1.2.1` (locally)
`git push -d origin hotfix-1.2.1` (remotely)

#### update remote branches
```
git remote update origin --prune
```
