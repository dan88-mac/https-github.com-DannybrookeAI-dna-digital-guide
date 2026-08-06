#!/usr/bin/env python3
"""Resync ops worker — allowlisted tools, HMAC from admin API (fail-safe)."""
from __future__ import annotations

import hashlib
import hmac
import json
import os
import sys
from datetime import datetime, timezone


ALLOWLIST = {
    "health_summary",
    "price_snapshot",
    "competitor_digest_stub",
}


def verify(sig: str, body: bytes, secret: str) -> bool:
    digest = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(digest, sig)


def health_summary(_: dict) -> dict:
    return {
        "ok": True,
        "ts": datetime.now(timezone.utc).isoformat(),
        "note": "Python worker reachable; wire HTTP probes via allowlisted domains only.",
    }


def price_snapshot(_: dict) -> dict:
    return {
        "Community": "$0",
        "Builder": "$39",
        "Pro": "$129",
        "Enterprise": "Custom",
        "marketplace": "20%",
    }


def competitor_digest_stub(_: dict) -> dict:
    return {
        "sources": "docs/competitive-intelligence/competitors/",
        "action": "Read local briefs; no unbounded web scrape.",
    }


HANDLERS = {
    "health_summary": health_summary,
    "price_snapshot": price_snapshot,
    "competitor_digest_stub": competitor_digest_stub,
}


def main() -> int:
    raw = sys.stdin.buffer.read() or b"{}"
    secret = os.environ.get("RESYNC_OPS_HMAC", "")
    sig = os.environ.get("RESYNC_OPS_SIG", "")
    if secret and not verify(sig, raw, secret):
        print(json.dumps({"ok": False, "error": "invalid_hmac"}))
        return 2
    try:
        payload = json.loads(raw.decode() or "{}")
    except json.JSONDecodeError:
        print(json.dumps({"ok": False, "error": "bad_json"}))
        return 1
    tool = payload.get("tool", "health_summary")
    if tool not in ALLOWLIST:
        print(json.dumps({"ok": False, "error": "tool_not_allowlisted"}))
        return 1
    result = HANDLERS[tool](payload.get("args") or {})
    print(json.dumps({"ok": True, "tool": tool, "result": result}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
