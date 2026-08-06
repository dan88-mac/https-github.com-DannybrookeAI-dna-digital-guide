#!/usr/bin/env python3
"""Resync AI Desktop — environment check (optional; called mentally by run.bat)."""
from __future__ import annotations

import shutil
import subprocess
import sys


def ver(cmd: list[str]) -> str:
    try:
        out = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True)
        return out.strip().splitlines()[0]
    except Exception as exc:  # noqa: BLE001
        return f"missing ({exc.__class__.__name__})"


def main() -> int:
    print("Resync AI — environment check")
    print(f"  python : {sys.version.split()[0]}")
    print(f"  node   : {ver(['node', '-v']) if shutil.which('node') else 'NOT FOUND'}")
    print(f"  npm    : {ver(['npm', '-v']) if shutil.which('npm') else 'NOT FOUND'}")
    ok = bool(shutil.which("node") and shutil.which("npm"))
    print("  status :", "READY for run.bat / npm run dev" if ok else "Install Node.js LTS first")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
