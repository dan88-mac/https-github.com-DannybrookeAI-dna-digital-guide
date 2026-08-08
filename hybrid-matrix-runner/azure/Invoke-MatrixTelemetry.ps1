#Requires -Version 7.0
param(
    [Parameter(Mandatory = $true)][string]$ExecutionId,
    [string]$RunnerUrl = "http://localhost:8765"
)

$stamp = Get-Date -Format "o"
$body = @{ execution_id = $ExecutionId } | ConvertTo-Json
try {
    $resp = Invoke-RestMethod -Method Post -Uri "$RunnerUrl/api/execute" -ContentType "application/json" -Body $body
    Write-Output (@{ timestampUtc = $stamp; executionId = $ExecutionId; ok = $true; summary = $resp.summary } | ConvertTo-Json -Depth 8)
} catch {
    Write-Error "[$stamp] Telemetry invoke failed: $_"
    exit 1
}
