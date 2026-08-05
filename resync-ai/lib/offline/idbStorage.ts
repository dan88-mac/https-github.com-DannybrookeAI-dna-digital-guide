import { openDB, type DBSchema, type IDBPDatabase } from "idb";

interface ResyncDB extends DBSchema {
  pendingWorkflowSaves: {
    key: string;
    value: { id: string; payload: string; createdAt: number };
  };
  pendingTelemetry: {
    key: string;
    value: { id: string; payload: string; createdAt: number };
  };
  draftGraphs: {
    key: string;
    value: { workflowId: string; graph: string; updatedAt: number };
  };
}

let dbPromise: Promise<IDBPDatabase<ResyncDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<ResyncDB>("resync-ai", 1, {
      upgrade(db) {
        db.createObjectStore("pendingWorkflowSaves", { keyPath: "id" });
        db.createObjectStore("pendingTelemetry", { keyPath: "id" });
        db.createObjectStore("draftGraphs", { keyPath: "workflowId" });
      },
    });
  }
  return dbPromise;
}

export async function queueWorkflowSave(id: string, payload: unknown) {
  const db = await getDb();
  await db.put("pendingWorkflowSaves", {
    id,
    payload: JSON.stringify(payload),
    createdAt: Date.now(),
  });
}

export async function flushWorkflowSaves(
  send: (payload: unknown) => Promise<void>
): Promise<number> {
  const db = await getDb();
  const all = await db.getAll("pendingWorkflowSaves");
  let count = 0;
  for (const item of all) {
    await send(JSON.parse(item.payload));
    await db.delete("pendingWorkflowSaves", item.id);
    count += 1;
  }
  return count;
}

export async function saveDraftGraph(workflowId: string, graph: unknown) {
  const db = await getDb();
  await db.put("draftGraphs", {
    workflowId,
    graph: JSON.stringify(graph),
    updatedAt: Date.now(),
  });
}

export async function loadDraftGraph(workflowId: string): Promise<unknown | null> {
  const db = await getDb();
  const row = await db.get("draftGraphs", workflowId);
  if (!row) return null;
  return JSON.parse(row.graph);
}
