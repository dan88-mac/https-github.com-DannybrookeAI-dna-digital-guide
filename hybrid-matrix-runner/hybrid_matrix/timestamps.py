from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


def utc_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def stamp_module(module_id: str, event: str, extra: dict[str, Any] | None = None) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "moduleId": module_id,
        "event": event,
        "timestampUtc": utc_iso(),
        "epochMs": int(datetime.now(timezone.utc).timestamp() * 1000),
    }
    if extra:
        payload.update(extra)
    return payload
