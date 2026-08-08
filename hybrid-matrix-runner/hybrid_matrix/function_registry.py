from __future__ import annotations

import asyncio
import json
import random
from pathlib import Path
from typing import Any, Awaitable, Callable

from hybrid_matrix.geo import merge_client_geo, resolve_public_hints
from hybrid_matrix.security import scrub_payload
from hybrid_matrix.timestamps import stamp_module, utc_iso

RegistryFn = Callable[[dict[str, Any]], Awaitable[dict[str, Any]]]

_REGISTRY: dict[str, RegistryFn] = {}


def register(name: str):
    def deco(fn: RegistryFn):
        _REGISTRY[name] = fn
        return fn

    return deco


@register("python.http.fetch")
async def _http_fetch(ctx: dict[str, Any]) -> dict[str, Any]:
    import httpx

    url = str(ctx.get("url", "https://httpbin.org/get"))
    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.get(url)
    return {"status": r.status_code, "bytes": len(r.content), "url": url}


@register("python.transform.json_parse")
async def _json_parse(ctx: dict[str, Any]) -> dict[str, Any]:
    raw = ctx.get("text", "{}")
    return {"data": json.loads(str(raw))}


@register("powershell.echo")
async def _ps_echo(ctx: dict[str, Any]) -> dict[str, Any]:
    msg = str(ctx.get("message", "Hybrid matrix runner"))
    proc = await asyncio.create_subprocess_exec(
        "pwsh",
        "-NoProfile",
        "-Command",
        f"Write-Output '{msg.replace(chr(39), chr(39)+chr(39))}'",
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    out, err = await proc.communicate()
    return {
        "exitCode": proc.returncode,
        "stdout": out.decode()[:2000],
        "stderr": err.decode()[:500] if err else "",
        "simulated": proc.returncode != 0,
    }


@register("web.domains.connector")
async def _domain_connector(ctx: dict[str, Any]) -> dict[str, Any]:
    domains = ctx.get("domains") or ["resync.ai", "github.com", "microsoft.com"]
    return {
        "connected": list(domains),
        "analyticsChannel": "incoming-multimodal",
        "timestampUtc": utc_iso(),
    }


@register("security.scrub")
async def _security_scrub(ctx: dict[str, Any]) -> dict[str, Any]:
    return {"scrubbed": scrub_payload(ctx.get("payload") or {})}


@register("geo.resolve")
async def _geo_resolve(ctx: dict[str, Any]) -> dict[str, Any]:
    server = resolve_public_hints()
    return merge_client_geo(ctx.get("clientGeo"), server)


async def invoke(name: str, ctx: dict[str, Any]) -> dict[str, Any]:
    fn = _REGISTRY.get(name)
    if not fn:
        return {"error": f"Unknown function: {name}", "available": sorted(_REGISTRY.keys())}
    return await fn(ctx)


def list_functions() -> list[str]:
    return sorted(_REGISTRY.keys())


def load_built_implementations() -> list[dict[str, Any]]:
    path = Path(__file__).resolve().parent / "built_implementations.json"
    if not path.exists():
        return []
    return json.loads(path.read_text())
