#Requires -Version 5.1
param(
    [Parameter(Mandatory = $true)]
    [string]$RepoPath,
    [string]$Branch = "main",
    [switch]$Push
)

$ErrorActionPreference = "Stop"
Set-Location (Resolve-Path $RepoPath).Path

git fetch origin $Branch
git pull origin $Branch

if ($Push) {
    $status = git status --porcelain
    if ($status) {
        Write-Host "Uncommitted changes; commit before push:"
        git status -sb
        exit 1
    }
    git push origin HEAD
    Write-Host "Pushed to origin."
} else {
    Write-Host "Pulled latest from origin/$Branch."
}
