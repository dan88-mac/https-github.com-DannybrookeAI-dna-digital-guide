# Windows helper scripts (Resync / DNA Digital Guide)

These scripts support **Path 2–3** in [docs/CLOUD-LOCAL-REMOTE-ACCESS-GUIDE.md](../../docs/CLOUD-LOCAL-REMOTE-ACCESS-GUIDE.md).

- All paths are under **`%USERPROFILE%\Documents\ResyncDev\`** (visible, easy to delete).
- Scheduled tasks use the name **`ResyncDev-LocalNextServer`** (visible in Task Scheduler).
- Run PowerShell **as Administrator** only when installing OpenSSH (`Install-ResyncDevRemote.ps1`).

## Prerequisites

- [Node.js LTS](https://nodejs.org/) (20+)
- [Git for Windows](https://git-scm.com/download/win)
- Repo cloned locally, e.g. `C:\Users\You\source\dna-digital-guide`

## Usage

```powershell
cd C:\Users\You\source\dna-digital-guide

# Optional: OpenSSH + ResyncDev folders
.\scripts\windows\Install-ResyncDevRemote.ps1

# Optional: start `npm run dev` at Windows logon
.\scripts\windows\Register-ResyncDevAtLogon.ps1 -RepoPath "C:\Users\You\source\dna-digital-guide"

# Sync with GitHub before/after local edits
.\scripts\windows\Sync-ResyncRepo.ps1 -RepoPath "C:\Users\You\source\dna-digital-guide" -Push

# Remove logon dev server
.\scripts\windows\Unregister-ResyncDevAtLogon.ps1
```

## Uninstall

1. `Unregister-ResyncDevAtLogon.ps1`
2. Delete `%USERPROFILE%\Documents\ResyncDev\`
3. Optional: disable OpenSSH Server in Windows Optional Features
