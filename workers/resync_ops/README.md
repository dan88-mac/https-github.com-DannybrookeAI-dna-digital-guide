# Resync ops Python worker

Allowlisted tools only. Invoke via stdin JSON + optional HMAC:

```bash
export RESYNC_OPS_HMAC=...
export RESYNC_OPS_SIG=$(python3 - <<'PY'
import hmac,hashlib,os
body=b'{"tool":"price_snapshot"}'
print(hmac.new(os.environ["RESYNC_OPS_HMAC"].encode(), body, hashlib.sha256).hexdigest())
PY
)
echo '{"tool":"price_snapshot"}' | python3 worker.py
```

Tools: `health_summary`, `price_snapshot`, `competitor_digest_stub`.
