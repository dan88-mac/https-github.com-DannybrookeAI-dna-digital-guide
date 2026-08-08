from __future__ import annotations

import socket
from typing import Any

from hybrid_matrix.timestamps import utc_iso


def resolve_public_hints() -> dict[str, Any]:
    """Best-effort host metadata (no external GPS hardware required)."""
    hostname = socket.gethostname()
    try:
        ip = socket.gethostbyname(hostname)
    except OSError:
        ip = "127.0.0.1"
    return {
        "hostname": hostname,
        "resolvedIp": ip,
        "geoSource": "host-resolver",
        "note": "Attach browser Geolocation API on frontend for GPS-grade find-me.",
        "timestampUtc": utc_iso(),
    }


def merge_client_geo(client: dict[str, Any] | None, server: dict[str, Any]) -> dict[str, Any]:
    merged = {**server}
    if client:
        merged["client"] = client
        if "latitude" in client and "longitude" in client:
            merged["lat"] = client["latitude"]
            merged["lng"] = client["longitude"]
    return merged
