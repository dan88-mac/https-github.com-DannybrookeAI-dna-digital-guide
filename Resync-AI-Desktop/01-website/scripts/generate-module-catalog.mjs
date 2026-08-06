#!/usr/bin/env node
/**
 * Generates lib/engine/moduleCatalog.ts with 200+ modules.
 * Run: node scripts/generate-module-catalog.mjs
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../lib/engine/moduleCatalog.ts");

const CATEGORY_COLORS = {
  trigger: "#6366f1",
  vision: "#8b5cf6",
  voice: "#ec4899",
  text: "#14b8a6",
  http: "#3b82f6",
  transform: "#f59e0b",
  condition: "#a855f7",
  selfHeal: "#ef4444",
  webhook: "#06b6d4",
  human: "#f97316",
  delay: "#64748b",
  commerce: "#10b981",
  devops: "#0ea5e9",
  data: "#7c3aed",
  security: "#dc2626",
  integrate: "#84cc16",
  schedule: "#f472b6",
  library: "#a78bfa",
  agent: "#22d3ee",
  ml: "#4ade80",
  media: "#fb923c",
  notify: "#facc15",
  storage: "#38bdf8",
  analytics: "#c084fc",
};

const CATEGORY_LABELS = {
  trigger: "Triggers",
  vision: "Vision",
  voice: "Voice",
  text: "Text / LLM",
  http: "HTTP",
  transform: "Transform",
  condition: "Conditions",
  selfHeal: "Self-heal",
  webhook: "Webhooks",
  human: "Human loop",
  delay: "Delay",
  commerce: "Commerce",
  devops: "DevOps",
  data: "Data",
  security: "Security",
  integrate: "Integrations",
  schedule: "Schedule / Time",
  library: "Libraries",
  agent: "Agents",
  ml: "ML / RAG",
  media: "Media",
  notify: "Notifications",
  storage: "Storage",
  analytics: "Analytics",
};

/** @type {Array<Record<string, unknown>>} */
const modules = [];

function defineModule(partial) {
  const category = partial.category;
  const mod = {
    purpose: partial.description,
    uses: [],
    libraries: [],
    inputs: [{ name: "payload", type: "object", description: "Upstream context" }],
    outputs: [{ name: "result", type: "object", description: "Module output" }],
    configSchema: {},
    pairingTags: [category],
    instructions: `Configure ${partial.label} via the node inspector JSON fields.`,
    color: CATEGORY_COLORS[category],
    ...partial,
    color: partial.color ?? CATEGORY_COLORS[category],
  };
  modules.push(mod);
  return mod;
}

// ─── Existing core modules (enhanced) ───────────────────────────────────────
const CORE = [
  ["trigger", "Manual Trigger", "trigger", "▶", "Start workflow manually or via API call", { label: "Manual Trigger", triggerType: "manual" }, { purpose: "Kick off a workflow on demand from the builder or API", uses: ["Prototyping", "One-off jobs"], libraries: ["Resync Runtime"], inputs: [], outputs: [{ name: "payload", type: "object" }], pairingTags: ["start", "entry"], instructions: "Place at the left edge. Connect downstream to fetch, transform, or AI nodes.", codeSnippet: 'await runtime.trigger("manual", { userId: ctx.user.id });' }],
  ["trigger_webhook", "Webhook Trigger", "trigger", "⚡", "Start when an inbound webhook is received", { label: "Webhook Trigger", triggerType: "webhook", path: "/hooks/inbound" }, { pairingTags: ["start", "webhook"], libraries: ["fastapi", "httpx"] }],
  ["trigger_schedule", "Schedule Trigger", "trigger", "🕐", "Run on a cron or interval schedule", { label: "Schedule", triggerType: "schedule", cron: "0 * * * *" }, { scheduleCapable: true, pairingTags: ["start", "schedule", "cron"], libraries: ["node-cron", "apscheduler"], codeSnippet: 'cron.schedule("0 * * * *", () => runtime.run(workflowId));' }],
  ["trigger_event", "Event Trigger", "trigger", "📡", "React to platform or bus events", { label: "Event Trigger", triggerType: "event", eventName: "" }, { pairingTags: ["start", "event"] }],
  ["vision", "Vision Analyze", "vision", "👁", "Analyze images with multimodal AI", { label: "Vision Analyze", model: "gpt-4o", prompt: "Describe this image" }, { purpose: "Extract meaning from images using multimodal models", libraries: ["openai", "anthropic"], inputs: [{ name: "image", type: "url|buffer" }], outputs: [{ name: "analysis", type: "string" }], pairingTags: ["multimodal", "vision", "ai"] }],
  ["vision_ocr", "OCR Extract", "vision", "📄", "Extract text from images and documents", { label: "OCR", language: "auto" }, { libraries: ["pillow", "opencv-python"], pairingTags: ["vision", "ocr"] }],
  ["vision_detect", "Object Detect", "vision", "🎯", "Detect objects and regions in images", { label: "Object Detect", confidence: 0.8 }, { libraries: ["opencv-python", "transformers"], pairingTags: ["vision", "detect"] }],
  ["vision_classify", "Image Classify", "vision", "🏷", "Classify images into categories", { label: "Classify", categories: [] }, { libraries: ["transformers", "torch"], pairingTags: ["vision", "classify"] }],
  ["voice", "Voice Transcribe", "voice", "🎤", "Transcribe audio to text", { label: "Transcribe", language: "en", model: "whisper-1" }, { libraries: ["whisper", "openai"], pairingTags: ["voice", "speech"] }],
  ["voice_synthesize", "Voice Synthesize", "voice", "🔊", "Convert text to natural speech", { label: "Synthesize", voice: "alloy", speed: 1.0 }, { libraries: ["openai"], pairingTags: ["voice", "tts"] }],
  ["voice_translate", "Voice Translate", "voice", "🌐", "Translate spoken audio to another language", { label: "Voice Translate", targetLanguage: "en" }, { libraries: ["whisper"], pairingTags: ["voice", "translate"] }],
  ["text", "Text Generate", "text", "✍", "Generate text with LLM", { label: "Generate Text", model: "gpt-4o", prompt: "", maxTokens: 1024 }, { libraries: ["openai", "anthropic"], pairingTags: ["llm", "text", "ai"] }],
  ["text_summarize", "Summarize", "text", "📝", "Summarize long text content", { label: "Summarize", maxLength: 200 }, { libraries: ["openai", "langchain"], pairingTags: ["text", "summarize"] }],
  ["text_classify", "Text Classify", "text", "🔖", "Classify text into labels", { label: "Classify Text", labels: [] }, { libraries: ["scikit-learn", "transformers"], pairingTags: ["text", "classify"] }],
  ["text_extract", "Extract Entities", "text", "🔍", "Extract structured entities from text", { label: "Extract", schema: {} }, { libraries: ["spacy", "nltk"], pairingTags: ["text", "ner"] }],
  ["text_translate", "Translate Text", "text", "🗣", "Translate text between languages", { label: "Translate", targetLanguage: "en" }, { libraries: ["openai", "transformers"], pairingTags: ["text", "translate"] }],
  ["httpRequest", "HTTP Request", "http", "🌐", "Call REST or GraphQL endpoints", { label: "HTTP Request", method: "GET", url: "", headers: {} }, { libraries: ["httpx", "requests", "axios"], pairingTags: ["http", "integration"] }],
  ["http_batch", "HTTP Batch", "http", "📦", "Execute multiple HTTP requests in parallel", { label: "HTTP Batch", requests: [], concurrency: 5 }, { libraries: ["aiohttp", "axios"], pairingTags: ["http", "batch"] }],
  ["transform", "Transform Data", "transform", "⚙", "Map and reshape JSON payloads", { label: "Transform", mapping: {} }, { libraries: ["pandas", "pydantic"], pairingTags: ["transform", "etl"] }],
  ["transform_merge", "Merge Data", "transform", "🔗", "Merge multiple inputs into one object", { label: "Merge", strategy: "deep" }, { pairingTags: ["transform", "merge"] }],
  ["transform_split", "Split Data", "transform", "✂", "Split arrays or objects into branches", { label: "Split", path: "", mode: "array" }, { pairingTags: ["transform", "split"] }],
  ["condition", "Condition", "condition", "⑂", "Branch based on a boolean expression", { label: "If / Else", expression: "", operator: "eq" }, { pairingTags: ["control", "branch"] }],
  ["condition_switch", "Switch", "condition", "🔀", "Multi-way branch on field value", { label: "Switch", field: "", cases: [] }, { pairingTags: ["control", "branch"] }],
  ["condition_filter", "Filter", "condition", "🚰", "Filter arrays by predicate", { label: "Filter", predicate: "", keepMatching: true }, { pairingTags: ["control", "filter"] }],
  ["selfHeal", "Self Heal", "selfHeal", "🩹", "Auto-repair failed API responses with AI", { label: "Self Heal", maxAttempts: 3, strategy: "patch" }, { libraries: ["openai", "tenacity"], pairingTags: ["resilience", "http"] }],
  ["selfHeal_circuit", "Circuit Breaker", "selfHeal", "⚡", "Trip circuit on repeated failures", { label: "Circuit Breaker", threshold: 5, cooldownMs: 60000 }, { libraries: ["circuitbreaker"], pairingTags: ["resilience", "circuit"] }],
  ["selfHeal_retry", "Retry Policy", "selfHeal", "🔁", "Retry with exponential backoff", { label: "Retry", maxAttempts: 5, backoffMs: 1000 }, { libraries: ["tenacity"], pairingTags: ["resilience", "retry"] }],
  ["webhookOut", "Webhook Out", "webhook", "📤", "Send payload to external webhook URL", { label: "Webhook Out", url: "", method: "POST" }, { libraries: ["httpx", "axios"], pairingTags: ["webhook", "outbound"] }],
  ["webhook_receive", "Webhook Receive", "webhook", "📥", "Wait for and validate inbound webhook", { label: "Receive Webhook", timeoutMs: 30000 }, { pairingTags: ["webhook", "inbound"] }],
  ["humanApprove", "Human Approval", "human", "👤", "Pause for human approval before continuing", { label: "Approval", assignee: "", timeoutHours: 24 }, { pairingTags: ["human", "approval"] }],
  ["human_review", "Human Review", "human", "✅", "Request human review with rubric", { label: "Review", rubric: [], required: true }, { pairingTags: ["human", "review"] }],
  ["human_input", "Human Input", "human", "⌨", "Collect structured input from a human", { label: "Human Input", fields: [], formTitle: "" }, { pairingTags: ["human", "input"] }],
  ["delay", "Delay", "delay", "⏳", "Wait for a fixed duration", { label: "Delay", durationMs: 5000 }, { pairingTags: ["control", "delay"] }],
  ["commerce_checkout", "Checkout", "commerce", "🛒", "Process checkout and payment flow", { label: "Checkout", provider: "stripe", currency: "usd" }, { libraries: ["stripe"], pairingTags: ["commerce", "payments"] }],
  ["commerce_inventory", "Inventory Check", "commerce", "📦", "Verify stock levels before fulfillment", { label: "Inventory", skuField: "sku", minQuantity: 1 }, { pairingTags: ["commerce", "inventory"] }],
  ["commerce_pricing", "Dynamic Pricing", "commerce", "💰", "Calculate dynamic price based on rules", { label: "Pricing", rules: [], basePrice: 0 }, { pairingTags: ["commerce", "pricing"] }],
  ["commerce_notify", "Order Notify", "commerce", "📧", "Send order confirmation notifications", { label: "Order Notify", channels: ["email"], template: "order_confirm" }, { pairingTags: ["commerce", "notify"] }],
  ["devops_deploy", "Deploy", "devops", "🚀", "Trigger deployment pipeline", { label: "Deploy", environment: "staging", service: "" }, { libraries: ["boto3"], pairingTags: ["devops", "deploy"] }],
  ["devops_monitor", "Monitor", "devops", "📈", "Query metrics and health endpoints", { label: "Monitor", metric: "latency", threshold: 500 }, { libraries: ["prometheus-client"], pairingTags: ["devops", "monitor"] }],
  ["devops_alert", "Alert", "devops", "🚨", "Fire alerts to on-call channels", { label: "Alert", severity: "warning", channel: "pagerduty" }, { pairingTags: ["devops", "alert"] }],
  ["devops_scale", "Auto Scale", "devops", "📐", "Scale infrastructure based on load", { label: "Scale", minReplicas: 1, maxReplicas: 10 }, { pairingTags: ["devops", "scale"] }],
  ["data_query", "Data Query", "data", "🗄", "Query database or data warehouse", { label: "Query", source: "postgres", query: "" }, { libraries: ["sqlalchemy", "prisma", "drizzle"], pairingTags: ["data", "query"] }],
  ["data_store", "Data Store", "data", "💾", "Persist records to storage", { label: "Store", table: "", mode: "upsert" }, { libraries: ["sqlalchemy", "pymongo"], pairingTags: ["data", "store"] }],
  ["data_validate", "Validate Schema", "data", "✓", "Validate data against JSON schema", { label: "Validate", schema: {}, strict: true }, { libraries: ["pydantic", "jsonschema", "zod"], pairingTags: ["data", "validate"] }],
  ["security_scan", "Security Scan", "security", "🛡", "Scan payloads for vulnerabilities", { label: "Security Scan", scanTypes: ["xss", "injection"] }, { pairingTags: ["security", "scan"] }],
  ["security_encrypt", "Encrypt", "security", "🔐", "Encrypt sensitive fields", { label: "Encrypt", algorithm: "aes-256-gcm", fields: [] }, { pairingTags: ["security", "encrypt"] }],
  ["security_audit", "Audit Log", "security", "📜", "Write immutable audit trail entries", { label: "Audit", action: "", retentionDays: 365 }, { pairingTags: ["security", "audit"] }],
  ["integrate", "Integration Hub", "integrate", "🔌", "Connect to third-party SaaS integrations", { label: "Integrate", provider: "", action: "" }, { pairingTags: ["integrate", "saas"] }],
  ["integrate_slack", "Slack", "integrate", "💬", "Send messages or actions to Slack", { label: "Slack", channel: "", message: "" }, { pairingTags: ["integrate", "slack"] }],
  ["integrate_email", "Email", "integrate", "📨", "Send transactional email", { label: "Email", to: "", subject: "", body: "" }, { libraries: ["sendgrid", "nodemailer"], pairingTags: ["integrate", "email"] }],
  ["integrate_crm", "CRM Sync", "integrate", "🏢", "Sync contacts and deals to CRM", { label: "CRM", provider: "hubspot", entity: "contact" }, { pairingTags: ["integrate", "crm"] }],
];

for (const [id, label, category, icon, description, defaultData, extra = {}] of CORE) {
  defineModule({ id, label, category, icon, description, defaultData, ...extra });
}

// ─── Python library modules ─────────────────────────────────────────────────
const PY_LIBS = [
  ["openai", "OpenAI", [
    ["chat", "Chat Completions", "Generate chat completions via OpenAI API", 'client.chat.completions.create(model="gpt-4o", messages=msgs)'],
    ["embed", "Embeddings", "Create text embeddings for RAG pipelines", "client.embeddings.create(model=text-embedding-3-small, input=text)"],
    ["image", "Image Generation", "Generate images with DALL-E", 'client.images.generate(model="dall-e-3", prompt=prompt)'],
    ["audio", "Audio Transcribe", "Transcribe audio with Whisper API", "client.audio.transcriptions.create(model=whisper-1, file=audio)"],
    ["moderation", "Moderation", "Screen content for policy violations", "client.moderations.create(input=text)"],
  ]],
  ["anthropic", "Anthropic", [
    ["messages", "Messages API", "Send messages to Claude models", 'client.messages.create(model="claude-3-5-sonnet", messages=msgs)'],
    ["vision", "Vision Messages", "Analyze images with Claude vision", "client.messages.create(messages=[image+text])"],
  ]],
  ["langchain", "LangChain", [
    ["chain", "LCEL Chain", "Compose LangChain runnable chains", "chain = prompt | llm | parser; chain.invoke(input)"],
    ["agent", "ReAct Agent", "Tool-calling agent with LangChain", "agent = create_react_agent(llm, tools); agent.invoke(input)"],
    ["retriever", "Vector Retriever", "Retrieve documents from vector store", "retriever = vectorstore.as_retriever(); docs = retriever.invoke(q)"],
  ]],
  ["llamaindex", "LlamaIndex", [
    ["query", "Query Engine", "Query indexed documents", "response = query_engine.query(question)"],
    ["index", "Build Index", "Build vector index from documents", "index = VectorStoreIndex.from_documents(docs)"],
    ["ingest", "Ingest Pipeline", "Ingest and chunk documents", "pipeline.run(documents=docs)"],
  ]],
  ["transformers", "Transformers", [
    ["pipeline", "HF Pipeline", "Run HuggingFace inference pipeline", 'pipe = pipeline("sentiment-analysis"); pipe(text)'],
    ["train", "Fine-tune", "Fine-tune transformer model", "Trainer(model=model, args=args, train_dataset=ds).train()"],
  ]],
  ["torch", "PyTorch", [
    ["infer", "Torch Inference", "Run PyTorch model inference", "with torch.no_grad(): output = model(tensor)"],
    ["train", "Torch Train", "Train PyTorch model loop", "for batch in loader: loss.backward(); optimizer.step()"],
  ]],
  ["tensorflow", "TensorFlow", [
    ["infer", "TF Inference", "Run TensorFlow model prediction", "predictions = model.predict(x)"],
    ["train", "TF Train", "Train TensorFlow model", "model.fit(x_train, y_train, epochs=10)"],
  ]],
  ["sklearn", "scikit-learn", [
    ["predict", "SKLearn Predict", "Run sklearn classifier/regressor", "y_pred = clf.predict(X_test)"],
    ["train", "SKLearn Train", "Fit sklearn model on training data", "clf.fit(X_train, y_train)"],
  ]],
  ["pandas", "pandas", [
    ["read", "Pandas Read", "Load CSV/JSON/Parquet into DataFrame", "df = pd.read_csv(path)"],
    ["transform", "Pandas Transform", "Apply column transforms and filters", "df = df.assign(col=df.a + df.b).query('x > 0')"],
    ["aggregate", "Pandas Aggregate", "Group and aggregate tabular data", "df.groupby('key').agg({'val': 'sum'})"],
  ]],
  ["numpy", "NumPy", [
    ["compute", "NumPy Compute", "Vectorized numeric computation", "result = np.dot(a, b)"],
    ["reshape", "NumPy Reshape", "Reshape and broadcast arrays", "arr = np.reshape(data, (n, m))"],
  ]],
  ["pillow", "Pillow", [
    ["resize", "Pillow Resize", "Resize and crop images", "img = img.resize((w, h), Image.LANCZOS)"],
    ["convert", "Pillow Convert", "Convert image formats and modes", "img.convert('RGB').save(out_path)"],
  ]],
  ["opencv", "OpenCV", [
    ["detect", "OpenCV Detect", "Detect features and objects", "faces = cascade.detectMultiScale(gray)"],
    ["filter", "OpenCV Filter", "Apply image filters and transforms", "blurred = cv2.GaussianBlur(img, (5,5), 0)"],
  ]],
  ["whisper", "Whisper", [
    ["transcribe", "Whisper Transcribe", "Local Whisper speech-to-text", "result = model.transcribe(audio_path)"],
    ["translate", "Whisper Translate", "Translate speech to English", "result = model.transcribe(audio, task='translate')"],
  ]],
  ["librosa", "librosa", [
    ["features", "Librosa Features", "Extract audio features (MFCC, chroma)", "mfcc = librosa.feature.mfcc(y=y, sr=sr)"],
    ["analyze", "Librosa Analyze", "Analyze tempo and beat", "tempo, beats = librosa.beat.beat_track(y=y, sr=sr)"],
  ]],
  ["pydub", "pydub", [
    ["convert", "Pydub Convert", "Convert audio formats", "AudioSegment.from_file(path).export(out, format='mp3')"],
    ["slice", "Pydub Slice", "Slice and concatenate audio", "clip = audio[start_ms:end_ms]"],
  ]],
  ["speechrecognition", "SpeechRecognition", [
    ["listen", "Speech Listen", "Recognize speech from microphone or file", "text = r.recognize_google(audio)"],
  ]],
  ["spacy", "spaCy", [
    ["nlp", "spaCy NLP", "Tokenize and parse text", "doc = nlp(text); tokens = [t.text for t in doc]"],
    ["ner", "spaCy NER", "Named entity recognition", "ents = [(e.text, e.label_) for e in doc.ents]"],
  ]],
  ["nltk", "NLTK", [
    ["tokenize", "NLTK Tokenize", "Tokenize sentences and words", "tokens = word_tokenize(text)"],
    ["sentiment", "NLTK Sentiment", "Sentiment analysis with NLTK", "score = sia.polarity_scores(text)"],
  ]],
  ["sentence_transformers", "sentence-transformers", [
    ["encode", "ST Encode", "Encode sentences to embeddings", "embeddings = model.encode(sentences)"],
    ["similarity", "ST Similarity", "Compute semantic similarity", "sim = util.cos_sim(a_emb, b_emb)"],
  ]],
  ["fastapi", "FastAPI", [
    ["route", "FastAPI Route", "Expose HTTP route handler", '@app.post("/run")\nasync def run(body: Body): return result'],
    ["middleware", "FastAPI Middleware", "Add request middleware", "@app.middleware('http')\nasync def log(request, call_next): ..."],
  ]],
  ["httpx", "httpx", [
    ["get", "HTTPX GET", "Async GET request", "r = await client.get(url, params=params)"],
    ["post", "HTTPX POST", "Async POST request", "r = await client.post(url, json=body)"],
  ]],
  ["requests", "requests", [
    ["get", "Requests GET", "Sync GET request", "r = requests.get(url, params=params)"],
    ["post", "Requests POST", "Sync POST request", "r = requests.post(url, json=body)"],
  ]],
  ["aiohttp", "aiohttp", [
    ["client", "aiohttp Client", "Async HTTP client session", "async with aiohttp.ClientSession() as s: await s.get(url)"],
    ["server", "aiohttp Server", "Async HTTP server handler", "app = web.Application(); web.run_app(app)"],
  ]],
  ["celery", "Celery", [
    ["task", "Celery Task", "Define and dispatch async task", "@app.task\ndef process(x): return x*2"],
    ["chain", "Celery Chain", "Chain Celery tasks", "chain(task_a.s(), task_b.s()).apply_async()"],
  ]],
  ["apscheduler", "APScheduler", [
    ["cron", "APScheduler Cron", "Schedule cron jobs in Python", "scheduler.add_job(fn, 'cron', hour=0)"],
    ["interval", "APScheduler Interval", "Schedule interval jobs", "scheduler.add_job(fn, 'interval', minutes=5)"],
  ]],
  ["sqlalchemy", "SQLAlchemy", [
    ["query", "SQLAlchemy Query", "Query relational database", "rows = session.query(Model).filter_by(id=id).all()"],
    ["migrate", "SQLAlchemy Migrate", "Run Alembic migrations", "alembic upgrade head"],
  ]],
  ["redis", "redis-py", [
    ["get", "Redis Get/Set", "Cache key-value operations", "r.set(key, val, ex=3600); r.get(key)"],
    ["pubsub", "Redis PubSub", "Publish and subscribe messages", "pubsub = r.pubsub(); pubsub.subscribe(channel)"],
  ]],
  ["pymongo", "PyMongo", [
    ["find", "Mongo Find", "Query MongoDB collections", "docs = coll.find(filter).limit(100)"],
    ["aggregate", "Mongo Aggregate", "Run aggregation pipeline", "results = coll.aggregate(pipeline)"],
  ]],
  ["boto3", "boto3", [
    ["s3", "boto3 S3", "Upload/download S3 objects", "s3.upload_file(local, bucket, key)"],
    ["sqs", "boto3 SQS", "Send/receive SQS messages", "sqs.send_message(QueueUrl=url, MessageBody=body)"],
    ["lambda", "boto3 Lambda", "Invoke AWS Lambda function", "lambda.invoke(FunctionName=name, Payload=json)"],
  ]],
  ["stripe", "Stripe Python", [
    ["charge", "Stripe Charge", "Create payment intent", "stripe.PaymentIntent.create(amount=amt, currency='usd')"],
    ["subscription", "Stripe Subscription", "Manage subscriptions", "stripe.Subscription.create(customer=cid, items=[...])"],
  ]],
  ["twilio", "Twilio Python", [
    ["sms", "Twilio SMS", "Send SMS messages", "client.messages.create(to=to, from_=from_, body=body)"],
    ["call", "Twilio Call", "Initiate voice calls", "client.calls.create(to=to, from_=from_, url=twiml_url)"],
  ]],
  ["sendgrid", "SendGrid", [
    ["email", "SendGrid Email", "Send email via SendGrid API", "sg.send(Mail(from_, to, subject, content))"],
  ]],
  ["pinecone", "Pinecone", [
    ["upsert", "Pinecone Upsert", "Upsert vectors to Pinecone", "index.upsert(vectors=[(id, vec, meta)])"],
    ["query", "Pinecone Query", "Query similar vectors", "index.query(vector=q, top_k=10)"],
  ]],
  ["chromadb", "ChromaDB", [
    ["add", "Chroma Add", "Add documents to Chroma collection", "collection.add(documents=docs, ids=ids)"],
    ["query", "Chroma Query", "Query Chroma collection", "collection.query(query_texts=[q], n_results=5)"],
  ]],
  ["weaviate", "Weaviate", [
    ["search", "Weaviate Search", "Semantic search in Weaviate", "client.query.get('Doc').with_near_text({'concepts':[q]})"],
    ["schema", "Weaviate Schema", "Define Weaviate class schema", "client.schema.create_class(class_obj)"],
  ]],
  ["qdrant", "Qdrant", [
    ["upsert", "Qdrant Upsert", "Upsert points to Qdrant", "client.upsert(collection, points=[...])"],
    ["search", "Qdrant Search", "Vector similarity search", "client.search(collection, query_vector=vec)"],
  ]],
  ["elasticsearch", "Elasticsearch", [
    ["search", "ES Search", "Full-text search in Elasticsearch", "es.search(index=idx, body={'query': {'match': {'field': q}}})"],
    ["index", "ES Index", "Index documents in Elasticsearch", "es.index(index=idx, document=doc)"],
  ]],
  ["playwright", "Playwright", [
    ["scrape", "Playwright Scrape", "Scrape pages with Playwright", "page.goto(url); content = page.content()"],
    ["screenshot", "Playwright Screenshot", "Capture page screenshots", "page.screenshot(path='shot.png')"],
  ]],
  ["selenium", "Selenium", [
    ["scrape", "Selenium Scrape", "Browser automation scraping", "driver.get(url); html = driver.page_source"],
    ["wait", "Selenium Wait", "Wait for elements", "WebDriverWait(driver, 10).until(EC.presence_of_element_located(...))"],
  ]],
  ["beautifulsoup4", "BeautifulSoup", [
    ["parse", "BS4 Parse", "Parse HTML/XML documents", "soup = BeautifulSoup(html, 'html.parser'); soup.select('a')"],
  ]],
  ["scrapy", "Scrapy", [
    ["crawl", "Scrapy Crawl", "Run Scrapy spider crawl", "process.crawl(MySpider); process.start()"],
  ]],
  ["pydantic", "Pydantic", [
    ["validate", "Pydantic Validate", "Validate data with Pydantic model", "obj = MyModel.model_validate(data)"],
    ["model", "Pydantic Model", "Define typed data models", "class User(BaseModel): name: str; age: int"],
  ]],
  ["jsonschema", "jsonschema", [
    ["validate", "JSON Schema Validate", "Validate JSON against schema", "jsonschema.validate(instance, schema)"],
  ]],
  ["tenacity", "Tenacity", [
    ["retry", "Tenacity Retry", "Retry with backoff decorator", "@retry(stop=stop_after_attempt(3))\ndef call(): ..."],
  ]],
  ["circuitbreaker", "circuitbreaker", [
    ["protect", "Circuit Protect", "Wrap function with circuit breaker", "@circuit(failure_threshold=5)\ndef call(): ..."],
  ]],
  ["prometheus", "prometheus-client", [
    ["counter", "Prometheus Counter", "Increment Prometheus counter", "REQUESTS.labels(method='GET').inc()"],
    ["histogram", "Prometheus Histogram", "Observe latency histogram", "LATENCY.observe(duration_sec)"],
  ]],
];

for (const [libKey, libName, ops] of PY_LIBS) {
  for (const [opKey, opLabel, desc, snippet] of ops) {
    defineModule({
      id: `lib_py_${libKey}_${opKey}`,
      label: `${libName}: ${opLabel}`,
      category: "library",
      icon: "🐍",
      description: desc,
      purpose: desc,
      libraries: [libKey === "sklearn" ? "scikit-learn" : libKey.replace(/_/g, "-")],
      uses: [`Python ${libName} workflows`, "Backend automation"],
      pairingTags: ["library", "python", libKey],
      codeSnippet: snippet,
      defaultData: { label: opLabel, library: libKey, operation: opKey },
      ratioHints: { cpu: 0.5, latencyMs: 500, costWeight: 0.3 },
    });
  }
}

// ─── JS/TS library modules ──────────────────────────────────────────────────
const JS_LIBS = [
  ["openai", "OpenAI JS", [
    ["chat", "Chat Completions", "OpenAI chat via Node SDK", 'await openai.chat.completions.create({ model: "gpt-4o", messages })'],
    ["embed", "Embeddings", "Create embeddings in Node", "await openai.embeddings.create({ model, input })"],
  ]],
  ["anthropic", "Anthropic SDK", [
    ["message", "Messages", "Claude messages via SDK", 'await anthropic.messages.create({ model: "claude-3-5-sonnet", messages })'],
  ]],
  ["langchain", "LangChain JS", [
    ["chain", "LCEL Chain", "LangChain.js runnable chain", "const chain = prompt.pipe(llm).pipe(parser); await chain.invoke(input)"],
    ["agent", "Tool Agent", "LangChain.js tool agent", "const agent = createToolCallingAgent({ llm, tools }); await agent.invoke(input)"],
  ]],
  ["vercel_ai", "Vercel AI SDK", [
    ["stream", "Stream Text", "Stream LLM text responses", "const { textStream } = await streamText({ model, prompt })"],
    ["generate", "Generate Object", "Generate structured objects", "const { object } = await generateObject({ model, schema, prompt })"],
  ]],
  ["sharp", "sharp", [
    ["resize", "Image Resize", "Resize images with sharp", "await sharp(input).resize(w, h).toFile(output)"],
    ["optimize", "Image Optimize", "Optimize image size", "await sharp(input).webp({ quality: 80 }).toBuffer()"],
  ]],
  ["ffmpeg", "ffmpeg", [
    ["transcode", "Video Transcode", "Transcode video formats", "ffmpeg -i input.mp4 -c:v libx264 output.mp4"],
    ["extract", "Frame Extract", "Extract video frames", "ffmpeg -i video.mp4 -vf fps=1 frame_%04d.png"],
  ]],
  ["nodemailer", "Nodemailer", [
    ["send", "Send Email", "Send email via SMTP", "await transporter.sendMail({ from, to, subject, html })"],
  ]],
  ["bullmq", "BullMQ", [
    ["queue", "Queue Publish", "Add job to BullMQ queue", "await queue.add('job', payload, { attempts: 3 })"],
    ["worker", "Queue Worker", "Process BullMQ jobs", "new Worker('queue', async job => process(job.data))"],
  ]],
  ["node_cron", "node-cron", [
    ["schedule", "Cron Schedule", "Schedule cron job in Node", "cron.schedule('0 * * * *', () => run())"],
  ]],
  ["zod", "Zod", [
    ["parse", "Zod Parse", "Parse and validate with Zod", "const data = schema.parse(input)"],
    ["safe", "Zod SafeParse", "Safe parse without throwing", "const result = schema.safeParse(input)"],
  ]],
  ["axios", "axios", [
    ["request", "HTTP Request", "HTTP client request", "const { data } = await axios.get(url, { params })"],
  ]],
  ["prisma", "Prisma", [
    ["query", "Prisma Query", "Query database with Prisma", "const rows = await prisma.user.findMany({ where })"],
    ["migrate", "Prisma Migrate", "Run Prisma migrations", "npx prisma migrate deploy"],
  ]],
  ["drizzle", "Drizzle ORM", [
    ["query", "Drizzle Query", "Query with Drizzle ORM", "await db.select().from(users).where(eq(users.id, id))"],
    ["migrate", "Drizzle Migrate", "Run Drizzle migrations", "await migrate(db, { migrationsFolder: './drizzle' })"],
  ]],
];

for (const [libKey, libName, ops] of JS_LIBS) {
  for (const [opKey, opLabel, desc, snippet] of ops) {
    defineModule({
      id: `lib_js_${libKey}_${opKey}`,
      label: `${libName}: ${opLabel}`,
      category: "library",
      icon: "📦",
      description: desc,
      purpose: desc,
      libraries: [libKey === "vercel_ai" ? "ai" : libKey.replace(/_/g, "-")],
      uses: [`Node.js ${libName} workflows`, "Serverless functions"],
      pairingTags: ["library", "javascript", libKey],
      codeSnippet: snippet,
      defaultData: { label: opLabel, library: libKey, operation: opKey },
      ratioHints: { cpu: 0.4, latencyMs: 300, costWeight: 0.25 },
    });
  }
}

// ─── Integration modules ────────────────────────────────────────────────────
const INTEGRATIONS = [
  ["integrate_discord", "Discord", "Send messages to Discord channels", "discord"],
  ["integrate_teams", "Microsoft Teams", "Post adaptive cards to Teams", "teams"],
  ["integrate_github", "GitHub", "Create issues, PRs, and dispatch workflows", "github"],
  ["integrate_gitlab", "GitLab", "Trigger pipelines and manage merge requests", "gitlab"],
  ["integrate_jira", "Jira", "Create and transition Jira issues", "jira"],
  ["integrate_linear", "Linear", "Create Linear issues and comments", "linear"],
  ["integrate_notion", "Notion", "Create and update Notion pages", "notion"],
  ["integrate_airtable", "Airtable", "Read and write Airtable records", "airtable"],
  ["integrate_hubspot", "HubSpot", "Sync HubSpot CRM objects", "hubspot"],
  ["integrate_salesforce", "Salesforce", "Create leads and opportunities", "salesforce"],
  ["integrate_shopify", "Shopify", "Manage Shopify orders and products", "shopify"],
  ["integrate_stripe", "Stripe", "Stripe payments and billing events", "stripe"],
  ["integrate_paypal", "PayPal", "PayPal checkout and payouts", "paypal"],
  ["integrate_twilio", "Twilio", "SMS and voice via Twilio", "twilio"],
  ["integrate_sendgrid", "SendGrid", "Transactional email via SendGrid", "sendgrid"],
  ["integrate_s3", "AWS S3", "Upload and download S3 objects", "boto3"],
  ["integrate_gcs", "Google Cloud Storage", "Read/write GCS buckets", "gcs"],
  ["integrate_r2", "Cloudflare R2", "Object storage on Cloudflare R2", "r2"],
  ["integrate_zapier", "Zapier Webhook", "Trigger Zapier zaps via webhook", "zapier"],
  ["integrate_n8n", "n8n Webhook", "Trigger n8n workflows via webhook", "n8n"],
  ["queue_publish", "Queue Publish", "Publish message to job queue", "bullmq"],
  ["queue_consume", "Queue Consume", "Consume and process queue messages", "bullmq"],
];

for (const [id, label, desc, lib] of INTEGRATIONS) {
  defineModule({
    id,
    label,
    category: "integrate",
    icon: "🔌",
    description: desc,
    purpose: desc,
    libraries: [lib],
    pairingTags: ["integrate", "saas", lib],
    defaultData: { label, provider: lib, action: "sync" },
  });
}

// ─── Schedule / time modules ────────────────────────────────────────────────
const SCHEDULE = [
  ["schedule_cron", "Cron Trigger", "Fire on cron expression", { cron: "0 9 * * 1-5" }, true],
  ["schedule_interval", "Interval Trigger", "Fire on fixed interval", { intervalMs: 60000 }, true],
  ["schedule_debounce", "Debounce", "Debounce rapid events", { windowMs: 1000 }, false],
  ["schedule_throttle", "Throttle", "Rate-limit event processing", { maxPerWindow: 10, windowMs: 60000 }, false],
  ["schedule_business_hours", "Business Hours Gate", "Only proceed during business hours", { timezone: "America/New_York", startHour: 9, endHour: 17 }, false],
  ["schedule_timezone", "Timezone Convert", "Convert timestamps across timezones", { fromTz: "UTC", toTz: "America/Los_Angeles" }, false],
  ["schedule_sla_timer", "SLA Timer", "Track SLA deadline and escalate", { slaMinutes: 60, escalateTo: "" }, false],
];

for (const [id, label, desc, data, sched] of SCHEDULE) {
  defineModule({
    id,
    label,
    category: "schedule",
    icon: "🕐",
    description: desc,
    purpose: desc,
    scheduleCapable: sched,
    pairingTags: ["schedule", "time"],
    libraries: sched ? ["node-cron", "apscheduler"] : [],
    defaultData: { label, ...data },
  });
}

// ─── Agent modules ──────────────────────────────────────────────────────────
const AGENTS = [
  ["agent_react", "ReAct Agent", "Reasoning + acting agent loop", "agent.invoke({ input, tools })"],
  ["agent_tool_call", "Tool Call", "Invoke registered tools from LLM", "llm.bind_tools(tools).invoke(messages)"],
  ["agent_function_router", "Function Router", "Route to functions by intent", "router.route(intent) -> handler"],
  ["agent_planner", "Task Planner", "Decompose goals into subtasks", "planner.plan(goal) -> steps[]"],
  ["agent_memory", "Agent Memory", "Persist conversation/working memory", "memory.save(key, value); memory.load(key)"],
  ["agent_supervisor", "Supervisor", "Orchestrate multi-agent workflows", "supervisor.delegate(task, agents)"],
  ["agent_executor", "Agent Executor", "Execute planned agent steps", "executor.run(plan)"],
  ["agent_handoff", "Agent Handoff", "Hand off context between agents", "handoff.to(agentB, context)"],
  ["agent_rag", "RAG Agent", "Agent with retrieval-augmented context", "agent.invoke({ query, retriever })"],
  ["agent_critic", "Critic Agent", "Review and score agent outputs", "critic.evaluate(output) -> score"],
];

for (const [id, label, desc, snippet] of AGENTS) {
  defineModule({
    id,
    label,
    category: "agent",
    icon: "🤖",
    description: desc,
    purpose: desc,
    libraries: ["langchain", "openai"],
    pairingTags: ["agent", "llm", "ai"],
    codeSnippet: snippet,
    defaultData: { label, model: "gpt-4o", maxSteps: 10 },
    ratioHints: { cpu: 0.7, latencyMs: 3000, costWeight: 0.8 },
  });
}

// ─── ML / RAG modules ───────────────────────────────────────────────────────
const ML = [
  ["ml_embed", "Embed Text", "Create vector embeddings", "embeddings = model.encode(texts)"],
  ["ml_rag_retrieve", "RAG Retrieve", "Retrieve relevant documents for context", "docs = retriever.get_relevant_documents(query)"],
  ["ml_rerank", "Rerank Results", "Rerank retrieval results by relevance", "ranked = reranker.rank(query, docs)"],
  ["ml_classify", "ML Classify", "Classify inputs with ML model", "label = classifier.predict(features)"],
  ["ml_summarize", "ML Summarize", "Abstractive/extractive summarization", "summary = summarizer.summarize(text)"],
  ["ml_translate", "ML Translate", "Machine translation", "translated = translator.translate(text, target_lang)"],
  ["ml_batch_infer", "Batch Inference", "Run batch model inference", "results = model.predict_batch(inputs)"],
  ["ml_fine_tune", "Fine-tune Model", "Fine-tune on custom dataset", "trainer.train(dataset)"],
  ["ml_eval", "Model Evaluate", "Evaluate model metrics", "metrics = evaluate(model, test_set)"],
  ["ml_feature_store", "Feature Store", "Read/write ML features", "features = store.get(entity_id)"],
  ["ml_vector_upsert", "Vector Upsert", "Upsert vectors to index", "index.upsert(vectors)"],
  ["ml_vector_search", "Vector Search", "Similarity search over vectors", "hits = index.search(query_vector, k=10)"],
  ["ml_hybrid_search", "Hybrid Search", "Combine keyword + vector search", "hits = hybrid_search(query, alpha=0.5)"],
  ["ml_chunk", "Document Chunk", "Chunk documents for RAG", "chunks = chunker.split(doc, size=512)"],
  ["ml_parse", "Document Parse", "Parse PDF/HTML/Markdown documents", "doc = parser.parse(file_path)"],
  ["ml_tool_call", "LLM Tool Call", "Execute LLM tool/function calls", "result = execute_tool_call(call)"],
  ["ml_function_router", "Function Router", "Route payloads to handler functions", "handler = router.resolve(intent)"],
  ["ml_diarize", "Speaker Diarization", "Identify speakers in audio", "segments = diarizer.diarize(audio)"],
];

for (const [id, label, desc, snippet] of ML) {
  defineModule({
    id,
    label,
    category: "ml",
    icon: "🧠",
    description: desc,
    purpose: desc,
    libraries: ["sentence-transformers", "langchain", "pinecone-client"],
    pairingTags: ["ml", "rag", "ai"],
    codeSnippet: snippet,
    defaultData: { label },
    ratioHints: { cpu: 0.6, latencyMs: 1500, costWeight: 0.5 },
  });
}

// ─── Media modules ──────────────────────────────────────────────────────────
const MEDIA = [
  ["media_image_gen", "Image Generate", "Generate images from text prompts", "image = gen_model.generate(prompt)"],
  ["media_video_extract", "Video Frame Extract", "Extract frames from video", "frames = extract_frames(video, fps=1)"],
  ["media_video_transcode", "Video Transcode", "Transcode video to target format", "ffmpeg transcode input output"],
  ["media_audio_mix", "Audio Mix", "Mix multiple audio tracks", "mixed = mix_tracks(tracks, volumes)"],
  ["media_format_convert", "Format Convert", "Convert media file formats", "convert(input, output_format)"],
  ["media_thumbnail", "Thumbnail Generate", "Generate image/video thumbnails", "thumb = create_thumbnail(media, size)"],
  ["media_watermark", "Watermark", "Apply watermark to images/video", "watermark(media, logo_path)"],
  ["media_compress", "Media Compress", "Compress images and video", "compress(media, quality=80)"],
  ["media_metadata", "Metadata Extract", "Extract EXIF/media metadata", "meta = extract_metadata(file)"],
  ["media_subtitle", "Subtitle Generate", "Generate subtitles for video", "subs = generate_subtitles(video)"],
  ["media_gif", "GIF Create", "Create animated GIFs", "gif = create_gif(frames, duration)"],
  ["media_spectrogram", "Spectrogram", "Generate audio spectrogram", "spec = librosa.specshow(y, sr)"],
];

for (const [id, label, desc, snippet] of MEDIA) {
  defineModule({
    id,
    label,
    category: "media",
    icon: "🎬",
    description: desc,
    purpose: desc,
    libraries: ["pillow", "ffmpeg", "opencv-python", "librosa"],
    pairingTags: ["media", "multimodal"],
    codeSnippet: snippet,
    defaultData: { label },
    ratioHints: { cpu: 0.8, latencyMs: 5000, costWeight: 0.6 },
  });
}

// ─── Notify modules ─────────────────────────────────────────────────────────
const NOTIFY = [
  ["notify_email", "Email Notify", "Send email notifications", "email"],
  ["notify_sms", "SMS Notify", "Send SMS notifications", "twilio"],
  ["notify_push", "Push Notify", "Send mobile push notifications", "fcm"],
  ["notify_slack", "Slack Notify", "Post Slack notification", "slack"],
  ["notify_webhook", "Webhook Notify", "POST notification to webhook", "httpx"],
  ["notify_in_app", "In-App Notify", "Send in-app notification", "resync"],
  ["notify_digest", "Digest Notify", "Batch and send digest notifications", "sendgrid"],
  ["notify_template", "Template Notify", "Render and send templated notification", "nodemailer"],
];

for (const [id, label, desc, lib] of NOTIFY) {
  defineModule({
    id,
    label,
    category: "notify",
    icon: "📣",
    description: `Send notification: ${desc}`,
    purpose: desc,
    libraries: [lib],
    pairingTags: ["notify", "alert"],
    defaultData: { label, channel: lib, template: "" },
  });
}

// ─── Storage modules ────────────────────────────────────────────────────────
const STORAGE = [
  ["storage_s3", "S3 Storage", "Read/write AWS S3 objects", "boto3"],
  ["storage_gcs", "GCS Storage", "Read/write Google Cloud Storage", "gcs"],
  ["storage_r2", "R2 Storage", "Read/write Cloudflare R2 objects", "r2"],
  ["storage_blob", "Blob Storage", "Generic blob read/write", "azure"],
  ["storage_cache", "Cache Storage", "Key-value cache layer", "redis"],
  ["storage_temp", "Temp Storage", "Temporary file staging", "local"],
  ["storage_archive", "Archive Storage", "Cold archive storage operations", "boto3"],
  ["storage_sync", "Storage Sync", "Sync files between storage backends", "boto3"],
  ["storage_signed_url", "Signed URL", "Generate presigned URLs", "boto3"],
  ["storage_multipart", "Multipart Upload", "Large file multipart upload", "boto3"],
];

for (const [id, label, desc, lib] of STORAGE) {
  defineModule({
    id,
    label,
    category: "storage",
    icon: "💾",
    description: desc,
    purpose: desc,
    libraries: [lib],
    pairingTags: ["storage", "data"],
    defaultData: { label, provider: lib, bucket: "", key: "" },
  });
}

// ─── Analytics modules ──────────────────────────────────────────────────────
const ANALYTICS = [
  ["analytics_track", "Track Event", "Track product analytics event", "segment"],
  ["analytics_funnel", "Funnel Analysis", "Analyze conversion funnel", "mixpanel"],
  ["analytics_export", "Export Metrics", "Export metrics to warehouse", "pandas"],
  ["analytics_dashboard", "Dashboard Query", "Query analytics dashboard API", "prometheus-client"],
  ["analytics_metric", "Record Metric", "Record custom metric datapoint", "prometheus-client"],
  ["analytics_segment", "User Segment", "Evaluate user segment membership", "segment"],
  ["analytics_cohort", "Cohort Analysis", "Run cohort retention analysis", "pandas"],
  ["analytics_ab_test", "A/B Test", "Evaluate A/B test variant", "statsig"],
];

for (const [id, label, desc, lib] of ANALYTICS) {
  defineModule({
    id,
    label,
    category: "analytics",
    icon: "📊",
    description: desc,
    purpose: desc,
    libraries: [lib],
    pairingTags: ["analytics", "metrics"],
    defaultData: { label, event: "", properties: {} },
    ratioHints: { cpu: 0.2, latencyMs: 200, costWeight: 0.1 },
  });
}

// ─── Validate unique IDs ────────────────────────────────────────────────────
const ids = modules.map((m) => m.id);
const unique = new Set(ids);
if (unique.size !== ids.length) {
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  console.error("Duplicate module IDs:", [...new Set(dupes)]);
  process.exit(1);
}
if (unique.size < 200) {
  console.error(`Only ${unique.size} modules generated, need >= 200`);
  process.exit(1);
}

// ─── Emit TypeScript ────────────────────────────────────────────────────────
function serializeModule(mod) {
  const lines = [];
  lines.push("  defineModule({");
  lines.push(`    id: ${JSON.stringify(mod.id)},`);
  lines.push(`    label: ${JSON.stringify(mod.label)},`);
  lines.push(`    category: ${JSON.stringify(mod.category)},`);
  lines.push(`    icon: ${JSON.stringify(mod.icon)},`);
  lines.push(`    description: ${JSON.stringify(mod.description)},`);
  if (mod.purpose) lines.push(`    purpose: ${JSON.stringify(mod.purpose)},`);
  if (mod.uses?.length) lines.push(`    uses: ${JSON.stringify(mod.uses)},`);
  if (mod.libraries?.length) lines.push(`    libraries: ${JSON.stringify(mod.libraries)},`);
  if (mod.inputs) lines.push(`    inputs: ${JSON.stringify(mod.inputs)},`);
  if (mod.outputs) lines.push(`    outputs: ${JSON.stringify(mod.outputs)},`);
  if (mod.configSchema && Object.keys(mod.configSchema).length)
    lines.push(`    configSchema: ${JSON.stringify(mod.configSchema)},`);
  if (mod.ratioHints) lines.push(`    ratioHints: ${JSON.stringify(mod.ratioHints)},`);
  if (mod.scheduleCapable) lines.push(`    scheduleCapable: true,`);
  if (mod.pairingTags?.length) lines.push(`    pairingTags: ${JSON.stringify(mod.pairingTags)},`);
  if (mod.instructions) lines.push(`    instructions: ${JSON.stringify(mod.instructions)},`);
  if (mod.codeSnippet) lines.push(`    codeSnippet: ${JSON.stringify(mod.codeSnippet)},`);
  lines.push(`    color: ${JSON.stringify(mod.color)},`);
  lines.push(`    defaultData: ${JSON.stringify(mod.defaultData)},`);
  lines.push("  })");
  return lines.join("\n");
}

const categoryLabelsStr = Object.entries(CATEGORY_LABELS)
  .map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`)
  .join("\n");

const categoryColorsStr = Object.entries(CATEGORY_COLORS)
  .map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`)
  .join("\n");

const ts = `export type ModuleCategory =
${Object.keys(CATEGORY_COLORS).map((c) => `  | ${JSON.stringify(c)}`).join("\n")};

export interface ModuleIO {
  name: string;
  type: string;
  description?: string;
}

export interface ConfigField {
  type: string;
  label: string;
  default?: unknown;
  options?: string[];
}

export interface RatioHints {
  cpu?: number;
  latencyMs?: number;
  costWeight?: number;
}

export interface WorkflowModule {
  id: string;
  label: string;
  category: ModuleCategory;
  icon: string;
  description: string;
  color: string;
  defaultData: Record<string, unknown>;
  purpose: string;
  uses: string[];
  libraries: string[];
  inputs: ModuleIO[];
  outputs: ModuleIO[];
  configSchema: Record<string, ConfigField>;
  ratioHints?: RatioHints;
  scheduleCapable?: boolean;
  pairingTags: string[];
  instructions: string;
  codeSnippet?: string;
}

const CATEGORY_COLORS: Record<ModuleCategory, string> = {
${categoryColorsStr}
};

export const CATEGORY_LABELS: Record<ModuleCategory, string> = {
${categoryLabelsStr}
};

type ModulePartial = Omit<WorkflowModule, "purpose" | "uses" | "libraries" | "inputs" | "outputs" | "configSchema" | "pairingTags" | "instructions" | "color"> &
  Partial<Pick<WorkflowModule, "purpose" | "uses" | "libraries" | "inputs" | "outputs" | "configSchema" | "pairingTags" | "instructions" | "color" | "ratioHints" | "scheduleCapable" | "codeSnippet">>;

export function defineModule(partial: ModulePartial): WorkflowModule {
  const category = partial.category;
  return {
    purpose: partial.description,
    uses: [],
    libraries: [],
    inputs: [{ name: "payload", type: "object", description: "Upstream context" }],
    outputs: [{ name: "result", type: "object", description: "Module output" }],
    configSchema: {},
    pairingTags: [category],
    instructions: \`Configure \${partial.label} via the node inspector JSON fields.\`,
    color: CATEGORY_COLORS[category],
    ...partial,
    color: partial.color ?? CATEGORY_COLORS[category],
  };
}

/** Resolve display purpose for catalog entries. */
export function getModulePurpose(mod: WorkflowModule): string {
  return mod.purpose || mod.description;
}

export const MODULE_CATALOG: WorkflowModule[] = [
${modules.map(serializeModule).join(",\n")}
];

const catalogById = new Map(MODULE_CATALOG.map((m) => [m.id, m]));

export function getModule(id: string): WorkflowModule | undefined {
  return catalogById.get(id);
}

export function modulesByCategory(): Record<ModuleCategory, WorkflowModule[]> {
  const grouped = {} as Record<ModuleCategory, WorkflowModule[]>;
  for (const mod of MODULE_CATALOG) {
    if (!grouped[mod.category]) grouped[mod.category] = [];
    grouped[mod.category].push(mod);
  }
  return grouped;
}

export const MODULE_IDS = MODULE_CATALOG.map((m) => m.id);

export function isValidModuleId(id: string): boolean {
  return catalogById.has(id);
}

export interface ModuleFilterOptions {
  query?: string;
  categories?: ModuleCategory[];
  library?: string;
  scheduleCapableOnly?: boolean;
}

export function filterModules(options: ModuleFilterOptions = {}): WorkflowModule[] {
  const q = options.query?.trim().toLowerCase() ?? "";
  const catSet = options.categories?.length ? new Set(options.categories) : null;

  return MODULE_CATALOG.filter((mod) => {
    if (catSet && !catSet.has(mod.category)) return false;
    if (options.library && !mod.libraries.includes(options.library)) return false;
    if (options.scheduleCapableOnly && !mod.scheduleCapable) return false;
    if (!q) return true;
    const haystack = [
      mod.label,
      mod.id,
      mod.description,
      mod.purpose,
      mod.category,
      ...mod.uses,
      ...mod.libraries,
      ...mod.pairingTags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
`;

writeFileSync(OUT, ts, "utf8");
console.log(`Generated ${unique.size} modules -> ${OUT}`);
