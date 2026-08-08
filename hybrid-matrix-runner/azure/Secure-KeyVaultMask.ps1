#Requires -Version 7.0
param(
    [Parameter(Mandatory = $true)][string]$VaultName,
    [Parameter(Mandatory = $true)][string]$SecretName
)

function Show-MaskedSecret {
    param([string]$Value)
    if ($Value.Length -le 4) { return "****" }
    return ($Value.Substring(0, 2) + ("*" * ($Value.Length - 4)) + $Value.Substring($Value.Length - 2))
}

$stamp = Get-Date -Format "o"
$secret = Get-AzKeyVaultSecret -VaultName $VaultName -Name $SecretName
$plain = $secret.SecretValue | ConvertFrom-SecureString -AsPlainText
Write-Output (@{
    timestampUtc = $stamp
    vault        = $VaultName
    name         = $SecretName
    masked       = Show-MaskedSecret $plain
} | ConvertTo-Json)
