$port = 5000
$portUsed = Test-NetConnection -ComputerName localhost -Port $port
if ($portUsed.TcpTestSucceeded) {
    Write-Host "Port $port is in use."
} else {
    Write-Host "Port $port is available."
}
