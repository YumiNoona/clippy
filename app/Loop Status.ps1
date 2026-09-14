# Probe IPv4 directly, bypassing system proxies and IPv6 localhost delays.
function Get-LoopStatus {
  param([int]$Port = 4317)
  $request = [Net.HttpWebRequest]::Create("http://127.0.0.1:$Port/api/health")
  $request.Proxy = $null; $request.Timeout = 1000; $request.ReadWriteTimeout = 1000
  try {
    $response = $request.GetResponse()
    try {
      $reader = [IO.StreamReader]::new($response.GetResponseStream())
      try { $info = $reader.ReadToEnd() | ConvertFrom-Json } finally { $reader.Dispose() }
      if ($info.app -eq 'loop-clipboard' -and $info.protocol -eq 1) { return 'Running' }
      return 'Port busy'
    } finally { $response.Dispose() }
  } catch [Net.WebException] {
    if ($_.Exception.Response) { $_.Exception.Response.Dispose(); return 'Port busy' }
    return 'Stopped'
  } catch { return 'Port busy' }
}
