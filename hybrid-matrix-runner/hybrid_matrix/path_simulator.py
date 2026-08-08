from __future__ import annotations

import random
from typing import Any

from hybrid_matrix.timestamps import utc_iso

NODE_TYPES = ("edge", "cdn", "fiber", "satellite", "cloud", "platform")


def simulate_hop(origin: str, destination: str, hop_index: int) -> dict[str, Any]:
    node = random.choice(NODE_TYPES)
    latency = round(random.uniform(8, 120), 2)
    return {
        "hop": hop_index,
        "from": origin,
        "to": destination,
        "nodeType": node,
        "latencyMs": latency,
        "frequencyHz": round(random.uniform(2.4e9, 5.8e9), 0),
        "telemetryUtc": utc_iso(),
    }


def build_path_trace(
    *,
    client_ip: str,
    target_host: str,
    hops: int = 6,
) -> list[dict[str, Any]]:
    trace: list[dict[str, Any]] = []
    prev = client_ip or "0.0.0.0"
    for i in range(hops):
        nxt = f"node-{node_label(i)}.{target_host}"
        trace.append(simulate_hop(prev, nxt, i + 1))
        prev = nxt
    trace.append(
        {
            "hop": hops + 1,
            "from": prev,
            "to": target_host,
            "nodeType": "platform",
            "latencyMs": round(random.uniform(2, 40), 2),
            "frequencyHz": 0,
            "telemetryUtc": utc_iso(),
        }
    )
    return trace


def node_label(i: int) -> str:
    labels = ("syd", "akl", "sin", "nrt", "lax", "fra", "lon")
    return labels[i % len(labels)]
