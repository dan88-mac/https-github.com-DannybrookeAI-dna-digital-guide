#Requires -Version 5.1
<#
.SYNOPSIS
  Prepares visible ResyncDev folders and optionally enables OpenSSH Server for Cursor Remote SSH.
.DESCRIPTION
  See docs/CLOUD-LOCAL-REMOTE-ACCESS-GUIDE.md — Path 3.
#>
param(
    [switch]$EnableSsh
)

$ErrorActionPreference = "Stop"
$base = Join-Path $env:USERPROFILE "Documents\ResyncDev"
$dirs = @("logs", "scripts-copies")

foreach ($d in $dirs) {
    $p = Join-Path $base $d
    if (-not (Test-Path $p)) {
        New-Item -ItemType Directory -Path $p -Force | Out-Null
    }
}

$readme = Join-Path $base "README.txt"
@"
Resync Dev workspace (visible, user-owned)
==========================================
Logs:     $base\logs
Guide:    docs/CLOUD-LOCAL-REMOTE-ACCESS-GUIDE.md in your git clone

Remote access: use Tailscale + OpenSSH + Cursor Remote SSH (not hidden tunnels).
Remove this folder anytime; uninstall task with Unregister-ResyncDevAtLogon.ps1
"@ | Set-Content -Path $readme -Encoding UTF8

Write-Host "Created ResyncDev layout at: $base"

if ($EnableSsh) {
    $sshCapability = Get-WindowsCapability -Online | Where-Object { $_.Name -like "OpenSSH.Server*" }
    if ($sshCapability.State -ne "Installed") {
        Write-Host "Installing OpenSSH Server (requires Administrator)..."
        Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
    }
    Start-Service sshd -ErrorAction SilentlyContinue
    Set-Service -Name sshd -StartupType Automatic
    Write-Host "OpenSSH Server enabled. Pair with Tailscale; connect via Cursor Remote SSH."
} else {
    Write-Host "Skipped OpenSSH. Re-run with -EnableSsh as Administrator if you need Remote SSH."
}

Write-Host "Done."
