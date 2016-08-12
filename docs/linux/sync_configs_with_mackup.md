# Sync configs across systems with Mackup

Sources: https://github.com/lra/mackup


Place your .mackup.cfg on a synchronized directory and symlink to the file:

`nn -sf /path/to/your/.mackup.cfg ~/.mackup.cfg`

Example .mackup.cfg:

```
[configuration_files]
.mackup.cfg

[storage]
engine = file_system
path = ownCloud/
directory = mackup

[applications_to_sync]
watson
mackup
sublime-text-3
git
bundler


[applications_to_ignore]
ssh
```

