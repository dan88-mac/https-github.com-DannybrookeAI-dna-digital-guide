import pytest

from hybrid_matrix.assembly_line import AssemblyLine, AssemblyStep
from hybrid_matrix.security import scrub_payload, sign_find_me_token, verify_find_me_token


@pytest.mark.asyncio
async def test_assembly_line_runs_steps():
    events = []

    async def emit(ev):
        events.append(ev)

    line = AssemblyLine(
        execution_id="test-exec",
        steps=[
            AssemblyStep(
                id="a",
                module_id="m1",
                function_call="geo.resolve",
                runtime="python",
            )
        ],
    )
    summary = await line.run(emit)
    assert summary["executionId"] == "test-exec"
    assert len(summary["steps"]) == 1
    assert any(e.get("event") == "start" for e in events)


def test_scrub_masks_keys():
    out = scrub_payload({"apiKey": "sk-live-abcdefghijklmnop", "note": "ok"})
    assert "sk-" not in str(out["apiKey"])
    assert out["note"] == "ok"


def test_find_me_token():
    sig = sign_find_me_token("payload", "secret")
    assert verify_find_me_token("payload", sig, "secret")
