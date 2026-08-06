#Requires -Version 5.1
param(
    [Parameter(Mandatory = $true)]
    [string]$RepoPath
)

$ErrorActionPreference = "Stop"
$RepoPath = (Resolve-Path $RepoPath).Path
$resyncAi = Join-Path $RepoPath "resync-ai"
if (-not (Test-Path (Join-Path $resyncAi "package.json"))) {
    throw "resync-ai not found under RepoPath: $RepoPath"
}

$logDir = Join-Path $env:USERPROFILE "Documents\ResyncDev\logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

$runner = Join-Path $logDir "start-resync-dev.cmd"
@"
@echo off
cd /d "$resyncAi"
echo [%date% %time%] Starting npm run dev >> "$logDir\dev-server.log"
call npm run dev >> "$logDir\dev-server.log" 2>&1
"@ | Set-Content -Path $runner -Encoding ASCII

$taskName = "ResyncDev-LocalNextServer"
$action = New-ScheduledTaskAction -Execute $runner
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null

Write-Host "Registered scheduled task '$taskName' -> $runner"
Write-Host "Logs: $logDir\dev-server.log"
Write-Host "Remove with: .\scripts\windows\Unregister-ResyncDevAtLogon.ps1"
