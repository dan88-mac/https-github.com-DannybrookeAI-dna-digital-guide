from __future__ import annotations

import uuid
from typing import Any

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from hybrid_matrix.assembly_line import AssemblyLine, AssemblyStep, default_pipeline
from hybrid_matrix.find_me import find_me_registry
from hybrid_matrix.function_registry import invoke, list_functions, load_built_implementations
from hybrid_matrix.security import scrub_payload
from hybrid_matrix.timestamps import utc_iso

app = FastAPI(title="Hybrid Matrix Runner", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class GeoInput(BaseModel):
    latitude: float | None = None
    longitude: float | None = None
    accuracy: float | None = None


class ExecuteBody(BaseModel):
    execution_id: str | None = None
    client_geo: GeoInput | None = None
    client_ip: str | None = None
    target_host: str = "hybrid.resync.ai"
    steps: list[dict[str, Any]] | None = None


class FindMeBody(BaseModel):
    execution_id: str
    url: str | None = None
    folder: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    label: str | None = None


class FunctionCallBody(BaseModel):
    name: str
    context: dict[str, Any] = Field(default_factory=dict)


@app.get("/health")
async def health():
    return {"ok": True, "service": "hybrid-matrix-runner", "timestampUtc": utc_iso()}


@app.get("/api/implementations")
async def implementations():
    return {"items": load_built_implementations(), "count": len(load_built_implementations())}


@app.get("/api/functions")
async def functions():
    return {"functions": list_functions()}


@app.post("/api/function/call")
async def function_call(body: FunctionCallBody):
    result = await invoke(body.name, body.context)
    return scrub_payload({"result": result, "timestampUtc": utc_iso()})


@app.post("/api/find-me/ping")
async def find_me_ping(body: FindMeBody):
    dot = find_me_registry.ping(
        execution_id=body.execution_id,
        url=body.url,
        folder=body.folder,
        lat=body.latitude,
        lng=body.longitude,
        label=body.label,
    )
    return scrub_payload(dot)


@app.get("/api/find-me/latest")
async def find_me_latest(execution_id: str | None = None, limit: int = 20):
    return {"dots": find_me_registry.latest(execution_id, limit)}


@app.post("/api/execute")
async def execute(body: ExecuteBody, request: Request):
    execution_id = body.execution_id or str(uuid.uuid4())
    client_geo = body.client_geo.model_dump() if body.client_geo else None
    client_ip = body.client_ip or (request.client.host if request.client else "0.0.0.0")

    if body.steps:
        steps = [
            AssemblyStep(
                id=s.get("id", f"step-{i}"),
                module_id=s.get("moduleId", "custom"),
                function_call=s.get("functionCall", ""),
                runtime=s.get("runtime", "python"),
                params=s.get("params") or {},
                label=s.get("label", ""),
            )
            for i, s in enumerate(body.steps)
        ]
        line = AssemblyLine(
            execution_id=execution_id,
            steps=steps,
            client_ip=client_ip,
            target_host=body.target_host,
            client_geo=client_geo,
        )
    else:
        line = default_pipeline(execution_id, client_geo)
        line.client_ip = client_ip
        line.target_host = body.target_host

    events: list[dict[str, Any]] = []

    async def emit(ev: dict[str, Any]) -> None:
        events.append(scrub_payload(ev))

    summary = await line.run(emit)
    return scrub_payload({"summary": summary, "events": events})


@app.post("/api/execute/stream")
async def execute_stream(body: ExecuteBody, request: Request):
    import asyncio
    import json

    execution_id = body.execution_id or str(uuid.uuid4())
    client_geo = body.client_geo.model_dump() if body.client_geo else None
    client_ip = body.client_ip or (request.client.host if request.client else "0.0.0.0")
    line = default_pipeline(execution_id, client_geo)
    line.client_ip = client_ip
    line.target_host = body.target_host

    queue: asyncio.Queue[dict[str, Any] | None] = asyncio.Queue()

    async def emit(ev: dict[str, Any]) -> None:
        await queue.put(scrub_payload(ev))

    async def runner():
        try:
            summary = await line.run(emit)
            await queue.put({"type": "summary", **scrub_payload(summary)})
        finally:
            await queue.put(None)

    async def event_gen():
        task = asyncio.create_task(runner())
        while True:
            item = await queue.get()
            if item is None:
                break
            yield f"data: {json.dumps(item)}\n\n"
        await task

    return StreamingResponse(event_gen(), media_type="text/event-stream")


def main():
    import os
    import uvicorn

    uvicorn.run(
        "hybrid_matrix.main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", "8765")),
        reload=False,
    )


if __name__ == "__main__":
    main()
