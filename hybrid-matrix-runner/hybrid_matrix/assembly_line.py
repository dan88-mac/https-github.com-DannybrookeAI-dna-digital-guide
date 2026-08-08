from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from typing import Any, AsyncIterator, Callable, Awaitable

from hybrid_matrix.find_me import find_me_registry
from hybrid_matrix.function_registry import invoke
from hybrid_matrix.path_simulator import build_path_trace
from hybrid_matrix.security import scrub_payload
from hybrid_matrix.timestamps import stamp_module, utc_iso

EmitFn = Callable[[dict[str, Any]], Awaitable[None]]


@dataclass
class AssemblyStep:
    id: str
    module_id: str
    function_call: str
    runtime: str  # python | powershell | www
    params: dict[str, Any] = field(default_factory=dict)
    label: str = ""


@dataclass
class AssemblyLine:
    execution_id: str
    steps: list[AssemblyStep]
    client_ip: str = "0.0.0.0"
    target_host: str = "matrix.resync.local"
    client_geo: dict[str, Any] | None = None

    async def run(self, emit: EmitFn) -> dict[str, Any]:
        await emit(stamp_module("assembly", "start", {"executionId": self.execution_id}))
        context: dict[str, Any] = {
            "executionId": self.execution_id,
            "clientGeo": self.client_geo,
        }
        step_results: list[dict[str, Any]] = []

        trace = build_path_trace(client_ip=self.client_ip, target_host=self.target_host)
        for hop in trace:
            await emit({"type": "path_hop", **hop})

        for index, step in enumerate(self.steps):
            started = stamp_module(
                step.module_id,
                "step_start",
                {
                    "executionId": self.execution_id,
                    "stepIndex": index,
                    "runtime": step.runtime,
                    "functionCall": step.function_call,
                    "label": step.label or step.id,
                },
            )
            await emit({"type": "assembly_step", **started})

            merged_params = {**step.params, **context}
            if step.function_call:
                result = await invoke(step.function_call, merged_params)
            else:
                result = {"skipped": True}

            context[f"step_{step.id}"] = result
            finished = stamp_module(
                step.module_id,
                "step_complete",
                {
                    "executionId": self.execution_id,
                    "stepIndex": index,
                    "output": scrub_payload(result),
                },
            )
            await emit({"type": "assembly_step", **finished})
            step_results.append(
                {
                    "stepId": step.id,
                    "functionCall": step.function_call,
                    "runtime": step.runtime,
                    "result": scrub_payload(result),
                    "timestampUtc": utc_iso(),
                }
            )

            find_me_registry.ping(
                execution_id=self.execution_id,
                url=step.params.get("url"),
                folder=step.params.get("folder") or step.params.get("contentFolder"),
                lat=(self.client_geo or {}).get("latitude"),
                lng=(self.client_geo or {}).get("longitude"),
                label=step.label or step.function_call,
            )
            await emit(
                {
                    "type": "find_me",
                    "dots": find_me_registry.latest(self.execution_id, limit=5),
                }
            )

            await asyncio.sleep(0.05)

        await emit(stamp_module("assembly", "complete", {"executionId": self.execution_id}))
        return {
            "executionId": self.execution_id,
            "completedUtc": utc_iso(),
            "steps": step_results,
            "pathTrace": trace,
        }


def default_pipeline(execution_id: str, client_geo: dict[str, Any] | None) -> AssemblyLine:
    return AssemblyLine(
        execution_id=execution_id,
        client_ip="127.0.0.1",
        target_host="hybrid.resync.ai",
        client_geo=client_geo,
        steps=[
            AssemblyStep(
                id="s1",
                module_id="mod-geo",
                function_call="geo.resolve",
                runtime="python",
                label="Geolocation lock",
            ),
            AssemblyStep(
                id="s2",
                module_id="mod-security",
                function_call="security.scrub",
                runtime="python",
                params={"payload": {"apiKey": "REDACTED_IN_UI", "note": "pre-flight"}},
                label="Key mask & scrub",
            ),
            AssemblyStep(
                id="s3",
                module_id="mod-domains",
                function_call="web.domains.connector",
                runtime="www",
                params={"domains": ["resync.ai", "github.com"]},
                label="Domain connector",
            ),
            AssemblyStep(
                id="s4",
                module_id="mod-fetch",
                function_call="python.http.fetch",
                runtime="python",
                params={"url": "https://httpbin.org/get", "folder": "/library/scrape-cache"},
                label="Live scrape sample",
            ),
            AssemblyStep(
                id="s5",
                module_id="mod-ps",
                function_call="powershell.echo",
                runtime="powershell",
                params={"message": "Azure-ready PowerShell hop"},
                label="PowerShell bridge",
            ),
        ],
    )
