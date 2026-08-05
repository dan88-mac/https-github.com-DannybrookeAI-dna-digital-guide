export class ResyncNodeSDK {
  constructor(
    private baseUrl: string,
    private organizationId: string
  ) {}

  async execute(payload: {
    failedEndpoint: string;
    errorMessage: string;
    expectedOutputSchema: Record<string, unknown>;
    incomingContext: Record<string, unknown>;
  }) {
    const res = await fetch(`${this.baseUrl}/api/runtime/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ organizationId: this.organizationId, ...payload }),
    });
    return res.json();
  }

  async saveWorkflow(payload: Record<string, unknown>) {
    const res = await fetch(`${this.baseUrl}/api/workflows/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  async logTelemetry(payload: Record<string, unknown>) {
    const res = await fetch(`${this.baseUrl}/api/telemetry/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  }
}
