from __future__ import annotations

import hashlib
import hmac
import os
import re
from typing import Any

_SECRET_PATTERN = re.compile(
    r"(api[_-]?key|secret|token|password|authorization|bearer)\s*[:=]\s*['\"]?\S+",
    re.IGNORECASE,
)
_BEARER = re.compile(r"Bearer\s+[A-Za-z0-9\-._~+/]+=*", re.IGNORECASE)


def mask_string(value: str) -> str:
    if len(value) <= 4:
        return "****"
    return value[:2] + "*" * (len(value) - 4) + value[-2:]


def scrub_payload(data: Any) -> Any:
    if isinstance(data, dict):
        out: dict[str, Any] = {}
        for k, v in data.items():
            lk = k.lower()
            if any(x in lk for x in ("key", "secret", "token", "password", "auth")):
                out[k] = mask_string(str(v)) if v is not None else None
            else:
                out[k] = scrub_payload(v)
        return out
    if isinstance(data, list):
        return [scrub_payload(x) for x in data]
    if isinstance(data, str):
        s = _BEARER.sub("Bearer ****", data)
        s = _SECRET_PATTERN.sub(r"\1=****", s)
        return s
    return data


def sign_find_me_token(payload: str, secret: str | None = None) -> str:
    key = (secret or os.environ.get("HYBRID_FIND_ME_SECRET") or "dev-find-me-change-me").encode()
    return hmac.new(key, payload.encode(), hashlib.sha256).hexdigest()[:32]


def verify_find_me_token(payload: str, signature: str, secret: str | None = None) -> bool:
    expected = sign_find_me_token(payload, secret)
    return hmac.compare_digest(expected, signature)
