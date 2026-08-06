#Requires -Version 5.1
$taskName = "ResyncDev-LocalNextServer"
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue
Write-Host "Removed scheduled task '$taskName' (if it existed)."
