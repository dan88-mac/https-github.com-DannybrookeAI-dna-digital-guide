#Requires -Version 7.0
<#
.SYNOPSIS
  Deploy Hybrid Matrix Runner to Azure App Service (Linux + Python).
.PARAMETER ResourceGroup
  Azure resource group name.
.PARAMETER AppName
  Globally unique web app name.
.PARAMETER Location
  Azure region (default: australiaeast).
#>
param(
    [Parameter(Mandatory = $true)][string]$ResourceGroup,
    [Parameter(Mandatory = $true)][string]$AppName,
    [string]$Location = "australiaeast",
    [string]$Sku = "B1"
)

$ErrorActionPreference = "Stop"
$stamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
Write-Host "[$stamp] Starting Hybrid Matrix deploy for $AppName"

if (-not (Get-AzContext)) {
    Connect-AzAccount | Out-Null
}

$planName = "$AppName-plan"
if (-not (Get-AzAppServicePlan -ResourceGroupName $ResourceGroup -Name $planName -ErrorAction SilentlyContinue)) {
    New-AzAppServicePlan -ResourceGroupName $ResourceGroup -Name $planName -Location $Location -Tier $Sku -NumberofWorkers 1 -Linux | Out-Null
}

if (-not (Get-AzWebApp -ResourceGroupName $ResourceGroup -Name $AppName -ErrorAction SilentlyContinue)) {
    New-AzWebApp -ResourceGroupName $ResourceGroup -Name $AppName -Location $Location -AppServicePlan $planName | Out-Null
}

$settings = @{
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "true"
    "WEBSITES_PORT"                   = "8765"
    "HYBRID_FIND_ME_SECRET"           = [guid]::NewGuid().ToString("N")
}
Set-AzWebApp -ResourceGroupName $ResourceGroup -Name $AppName -AppSettings $settings | Out-Null

Write-Host "[$((Get-Date).ToUniversalTime().ToString('o'))] Deploy complete. Set startup: run.sh / gunicorn equivalent."
