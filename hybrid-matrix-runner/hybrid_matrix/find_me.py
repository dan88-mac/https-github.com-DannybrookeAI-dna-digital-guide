from __future__ import annotations

import uuid
from typing import Any

from hybrid_matrix.security import sign_find_me_token
from hybrid_matrix.timestamps import utc_iso


class FindMeRegistry:
    """In-memory scrape / workflow position beeper (use Redis in production)."""

    def __init__(self) -> None:
        self._dots: dict[str, dict[str, Any]] = {}

    def ping(
        self,
        *,
        execution_id: str,
        url: str | None,
        folder: str | None,
        lat: float | None,
        lng: float | None,
        label: str | None,
    ) -> dict[str, Any]:
        token_id = str(uuid.uuid4())
        payload = f"{execution_id}:{token_id}:{utc_iso()}"
        dot = {
            "id": token_id,
            "executionId": execution_id,
            "url": url,
            "contentFolder": folder,
            "latitude": lat,
            "longitude": lng,
            "label": label or "scrape-active",
            "timestampUtc": utc_iso(),
            "signature": sign_find_me_token(payload),
        }
        self._dots[token_id] = dot
        return dot

    def latest(self, execution_id: str | None = None, limit: int = 20) -> list[dict[str, Any]]:
        items = list(self._dots.values())
        if execution_id:
            items = [d for d in items if d.get("executionId") == execution_id]
        items.sort(key=lambda x: x.get("timestampUtc", ""), reverse=True)
        return items[:limit]


find_me_registry = FindMeRegistry()
