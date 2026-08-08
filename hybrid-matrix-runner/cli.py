#!/usr/bin/env python3
"""CLI for hybrid matrix workflow runner."""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
import uuid

from hybrid_matrix.assembly_line import default_pipeline
from hybrid_matrix.function_registry import invoke, list_functions, load_built_implementations


async def cmd_run(args: argparse.Namespace) -> int:
    execution_id = args.execution_id or str(uuid.uuid4())
    geo = None
    if args.lat is not None and args.lng is not None:
        geo = {"latitude": args.lat, "longitude": args.lng, "accuracy": args.accuracy}

    line = default_pipeline(execution_id, geo)
    line.client_ip = args.client_ip
    line.target_host = args.target

    events: list[dict] = []

    async def emit(ev: dict) -> None:
        events.append(ev)
        if args.verbose:
            print(json.dumps(ev, default=str), file=sys.stderr)

    summary = await line.run(emit)
    print(json.dumps({"summary": summary, "eventCount": len(events)}, indent=2, default=str))
    return 0


async def cmd_call(args: argparse.Namespace) -> int:
    ctx = json.loads(args.context or "{}")
    result = await invoke(args.name, ctx)
    print(json.dumps(result, indent=2, default=str))
    return 0 if "error" not in result else 1


def cmd_list(_: argparse.Namespace) -> int:
    print(json.dumps({"functions": list_functions(), "implementations": len(load_built_implementations())}, indent=2))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Hybrid Matrix Runner CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    run_p = sub.add_parser("run", help="Run default assembly line")
    run_p.add_argument("--execution-id", default=None)
    run_p.add_argument("--client-ip", default="127.0.0.1")
    run_p.add_argument("--target", default="hybrid.resync.ai")
    run_p.add_argument("--lat", type=float, default=None)
    run_p.add_argument("--lng", type=float, default=None)
    run_p.add_argument("--accuracy", type=float, default=None)
    run_p.add_argument("-v", "--verbose", action="store_true")
    run_p.set_defaults(func=lambda a: asyncio.run(cmd_run(a)))

    call_p = sub.add_parser("call", help="Invoke registered function")
    call_p.add_argument("name")
    call_p.add_argument("--context", default="{}")
    call_p.set_defaults(func=lambda a: asyncio.run(cmd_call(a)))

    list_p = sub.add_parser("list", help="List functions and implementation count")
    list_p.set_defaults(func=cmd_list)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
