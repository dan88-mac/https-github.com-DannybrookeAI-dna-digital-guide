/**
 * Curated index of top Python, JavaScript, and cloud libraries
 * linked to workflow module IDs in moduleCatalog.ts.
 */

export type LibraryEcosystem = "python" | "js" | "cloud";

export interface LibraryEntry {
  name: string;
  ecosystem: LibraryEcosystem;
  category: string;
  relatedModuleIds: string[];
  docsUrl: string;
  summary: string;
}

export const LIBRARY_INDEX: LibraryEntry[] = [
  // ── Python AI / LLM ──────────────────────────────────────────────────────
  {
    name: "openai",
    ecosystem: "python",
    category: "ai",
    relatedModuleIds: ["text", "vision", "voice", "lib_py_openai_chat", "lib_py_openai_embed", "lib_py_openai_image", "lib_py_openai_audio", "lib_py_openai_moderation", "lib_js_openai_chat", "lib_js_openai_embed"],
    docsUrl: "https://platform.openai.com/docs/api-reference",
    summary: "Official OpenAI Python SDK for chat, embeddings, images, audio, and moderation APIs.",
  },
  {
    name: "anthropic",
    ecosystem: "python",
    category: "ai",
    relatedModuleIds: ["lib_py_anthropic_messages", "lib_py_anthropic_vision", "lib_js_anthropic_message"],
    docsUrl: "https://docs.anthropic.com/en/api/getting-started",
    summary: "Anthropic Claude API client for messages and vision workloads.",
  },
  {
    name: "langchain",
    ecosystem: "python",
    category: "ai",
    relatedModuleIds: ["text_summarize", "lib_py_langchain_chain", "lib_py_langchain_agent", "lib_py_langchain_retriever", "lib_js_langchain_chain", "lib_js_langchain_agent", "agent_react", "agent_rag", "ml_rag_retrieve"],
    docsUrl: "https://python.langchain.com/docs/introduction/",
    summary: "Framework for building LLM chains, agents, and retrieval pipelines.",
  },
  {
    name: "llamaindex",
    ecosystem: "python",
    category: "ai",
    relatedModuleIds: ["lib_py_llamaindex_query", "lib_py_llamaindex_index", "lib_py_llamaindex_ingest", "ml_rag_retrieve", "ml_chunk"],
    docsUrl: "https://docs.llamaindex.ai/",
    summary: "Data framework for LLM applications with indexing and query engines.",
  },
  {
    name: "transformers",
    ecosystem: "python",
    category: "ml",
    relatedModuleIds: ["vision_classify", "text_classify", "lib_py_transformers_pipeline", "lib_py_transformers_train", "ml_classify", "ml_summarize"],
    docsUrl: "https://huggingface.co/docs/transformers/index",
    summary: "HuggingFace Transformers for NLP and vision model inference and training.",
  },
  {
    name: "sentence-transformers",
    ecosystem: "python",
    category: "ml",
    relatedModuleIds: ["lib_py_sentence_transformers_encode", "lib_py_sentence_transformers_similarity", "ml_embed", "ml_vector_search"],
    docsUrl: "https://www.sbert.net/docs/installation.html",
    summary: "Semantic text embeddings and similarity scoring.",
  },
  {
    name: "torch",
    ecosystem: "python",
    category: "ml",
    relatedModuleIds: ["vision_classify", "lib_py_torch_infer", "lib_py_torch_train", "ml_batch_infer", "ml_fine_tune"],
    docsUrl: "https://pytorch.org/docs/stable/index.html",
    summary: "PyTorch deep learning framework for training and inference.",
  },
  {
    name: "tensorflow",
    ecosystem: "python",
    category: "ml",
    relatedModuleIds: ["lib_py_tensorflow_infer", "lib_py_tensorflow_train", "ml_batch_infer"],
    docsUrl: "https://www.tensorflow.org/api_docs",
    summary: "TensorFlow for large-scale ML training and serving.",
  },
  {
    name: "scikit-learn",
    ecosystem: "python",
    category: "ml",
    relatedModuleIds: ["text_classify", "lib_py_sklearn_predict", "lib_py_sklearn_train", "ml_classify"],
    docsUrl: "https://scikit-learn.org/stable/documentation.html",
    summary: "Classical ML algorithms for classification, regression, and clustering.",
  },
  {
    name: "whisper",
    ecosystem: "python",
    category: "voice",
    relatedModuleIds: ["voice", "voice_translate", "lib_py_whisper_transcribe", "lib_py_whisper_translate"],
    docsUrl: "https://github.com/openai/whisper",
    summary: "OpenAI Whisper local speech recognition and translation.",
  },
  {
    name: "spacy",
    ecosystem: "python",
    category: "nlp",
    relatedModuleIds: ["text_extract", "lib_py_spacy_nlp", "lib_py_spacy_ner"],
    docsUrl: "https://spacy.io/usage",
    summary: "Industrial-strength NLP with tokenization, parsing, and NER.",
  },
  {
    name: "nltk",
    ecosystem: "python",
    category: "nlp",
    relatedModuleIds: ["lib_py_nltk_tokenize", "lib_py_nltk_sentiment"],
    docsUrl: "https://www.nltk.org/",
    summary: "Natural Language Toolkit for tokenization and sentiment analysis.",
  },

  // ── Python data / web ────────────────────────────────────────────────────
  {
    name: "pandas",
    ecosystem: "python",
    category: "data",
    relatedModuleIds: ["transform", "lib_py_pandas_read", "lib_py_pandas_transform", "lib_py_pandas_aggregate", "analytics_export", "analytics_cohort"],
    docsUrl: "https://pandas.pydata.org/docs/",
    summary: "Tabular data manipulation, aggregation, and ETL.",
  },
  {
    name: "numpy",
    ecosystem: "python",
    category: "data",
    relatedModuleIds: ["lib_py_numpy_compute", "lib_py_numpy_reshape"],
    docsUrl: "https://numpy.org/doc/",
    summary: "Fundamental array computing and linear algebra.",
  },
  {
    name: "fastapi",
    ecosystem: "python",
    category: "web",
    relatedModuleIds: ["trigger_webhook", "lib_py_fastapi_route", "lib_py_fastapi_middleware"],
    docsUrl: "https://fastapi.tiangolo.com/",
    summary: "High-performance async Python web framework for APIs.",
  },
  {
    name: "httpx",
    ecosystem: "python",
    category: "http",
    relatedModuleIds: ["httpRequest", "webhookOut", "lib_py_httpx_get", "lib_py_httpx_post", "notify_webhook"],
    docsUrl: "https://www.python-httpx.org/",
    summary: "Modern async/sync HTTP client for Python.",
  },
  {
    name: "requests",
    ecosystem: "python",
    category: "http",
    relatedModuleIds: ["httpRequest", "lib_py_requests_get", "lib_py_requests_post"],
    docsUrl: "https://requests.readthedocs.io/",
    summary: "Simple synchronous HTTP library for Python.",
  },
  {
    name: "aiohttp",
    ecosystem: "python",
    category: "http",
    relatedModuleIds: ["http_batch", "lib_py_aiohttp_client", "lib_py_aiohttp_server"],
    docsUrl: "https://docs.aiohttp.org/",
    summary: "Async HTTP client/server for Python.",
  },
  {
    name: "sqlalchemy",
    ecosystem: "python",
    category: "database",
    relatedModuleIds: ["data_query", "data_store", "lib_py_sqlalchemy_query", "lib_py_sqlalchemy_migrate"],
    docsUrl: "https://docs.sqlalchemy.org/",
    summary: "SQL toolkit and ORM for relational databases.",
  },
  {
    name: "pymongo",
    ecosystem: "python",
    category: "database",
    relatedModuleIds: ["data_store", "lib_py_pymongo_find", "lib_py_pymongo_aggregate"],
    docsUrl: "https://pymongo.readthedocs.io/",
    summary: "Official MongoDB driver for Python.",
  },
  {
    name: "redis",
    ecosystem: "python",
    category: "cache",
    relatedModuleIds: ["lib_py_redis_get", "lib_py_redis_pubsub", "storage_cache"],
    docsUrl: "https://redis.readthedocs.io/",
    summary: "Redis client for caching, pub/sub, and queues.",
  },
  {
    name: "pydantic",
    ecosystem: "python",
    category: "validation",
    relatedModuleIds: ["transform", "data_validate", "lib_py_pydantic_validate", "lib_py_pydantic_model"],
    docsUrl: "https://docs.pydantic.dev/",
    summary: "Data validation and settings management using Python type hints.",
  },
  {
    name: "jsonschema",
    ecosystem: "python",
    category: "validation",
    relatedModuleIds: ["data_validate", "lib_py_jsonschema_validate"],
    docsUrl: "https://python-jsonschema.readthedocs.io/",
    summary: "JSON Schema validation for Python objects.",
  },
  {
    name: "celery",
    ecosystem: "python",
    category: "queue",
    relatedModuleIds: ["lib_py_celery_task", "lib_py_celery_chain", "queue_publish", "queue_consume"],
    docsUrl: "https://docs.celeryq.dev/",
    summary: "Distributed task queue for async background jobs.",
  },
  {
    name: "apscheduler",
    ecosystem: "python",
    category: "schedule",
    relatedModuleIds: ["trigger_schedule", "schedule_cron", "schedule_interval", "lib_py_apscheduler_cron", "lib_py_apscheduler_interval"],
    docsUrl: "https://apscheduler.readthedocs.io/",
    summary: "Advanced Python scheduler for cron and interval jobs.",
  },

  // ── Python media / vision ────────────────────────────────────────────────
  {
    name: "pillow",
    ecosystem: "python",
    category: "media",
    relatedModuleIds: ["vision_ocr", "lib_py_pillow_resize", "lib_py_pillow_convert", "media_thumbnail", "media_watermark"],
    docsUrl: "https://pillow.readthedocs.io/",
    summary: "Python Imaging Library for image processing.",
  },
  {
    name: "opencv-python",
    ecosystem: "python",
    category: "vision",
    relatedModuleIds: ["vision_ocr", "vision_detect", "lib_py_opencv_detect", "lib_py_opencv_filter", "media_compress"],
    docsUrl: "https://docs.opencv.org/",
    summary: "Computer vision library for detection, filtering, and video.",
  },
  {
    name: "librosa",
    ecosystem: "python",
    category: "audio",
    relatedModuleIds: ["lib_py_librosa_features", "lib_py_librosa_analyze", "media_spectrogram"],
    docsUrl: "https://librosa.org/doc/latest/index.html",
    summary: "Audio and music analysis including MFCC and beat tracking.",
  },
  {
    name: "pydub",
    ecosystem: "python",
    category: "audio",
    relatedModuleIds: ["lib_py_pydub_convert", "lib_py_pydub_slice", "media_audio_mix", "media_format_convert"],
    docsUrl: "https://github.com/jiaaro/pydub",
    summary: "Simple audio manipulation: convert, slice, and concatenate.",
  },
  {
    name: "speechrecognition",
    ecosystem: "python",
    category: "voice",
    relatedModuleIds: ["lib_py_speechrecognition_listen"],
    docsUrl: "https://pypi.org/project/SpeechRecognition/",
    summary: "Library for performing speech recognition via multiple engines.",
  },

  // ── Python vector / search ───────────────────────────────────────────────
  {
    name: "pinecone-client",
    ecosystem: "python",
    category: "vector",
    relatedModuleIds: ["lib_py_pinecone_upsert", "lib_py_pinecone_query", "ml_vector_upsert", "ml_vector_search"],
    docsUrl: "https://docs.pinecone.io/",
    summary: "Managed vector database for similarity search.",
  },
  {
    name: "chromadb",
    ecosystem: "python",
    category: "vector",
    relatedModuleIds: ["lib_py_chromadb_add", "lib_py_chromadb_query", "ml_rag_retrieve"],
    docsUrl: "https://docs.trychroma.com/",
    summary: "Open-source embedding database for AI applications.",
  },
  {
    name: "weaviate-client",
    ecosystem: "python",
    category: "vector",
    relatedModuleIds: ["lib_py_weaviate_search", "lib_py_weaviate_schema", "ml_hybrid_search"],
    docsUrl: "https://weaviate.io/developers/weaviate",
    summary: "Vector database with hybrid search and schema management.",
  },
  {
    name: "qdrant-client",
    ecosystem: "python",
    category: "vector",
    relatedModuleIds: ["lib_py_qdrant_upsert", "lib_py_qdrant_search", "ml_vector_search"],
    docsUrl: "https://qdrant.tech/documentation/",
    summary: "High-performance vector similarity search engine.",
  },
  {
    name: "elasticsearch",
    ecosystem: "python",
    category: "search",
    relatedModuleIds: ["lib_py_elasticsearch_search", "lib_py_elasticsearch_index", "ml_hybrid_search"],
    docsUrl: "https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html",
    summary: "Distributed search and analytics engine.",
  },

  // ── Python scraping ──────────────────────────────────────────────────────
  {
    name: "playwright",
    ecosystem: "python",
    category: "scraping",
    relatedModuleIds: ["lib_py_playwright_scrape", "lib_py_playwright_screenshot"],
    docsUrl: "https://playwright.dev/python/docs/intro",
    summary: "Browser automation for scraping and screenshots.",
  },
  {
    name: "selenium",
    ecosystem: "python",
    category: "scraping",
    relatedModuleIds: ["lib_py_selenium_scrape", "lib_py_selenium_wait"],
    docsUrl: "https://www.selenium.dev/documentation/",
    summary: "Browser automation framework for web scraping.",
  },
  {
    name: "beautifulsoup4",
    ecosystem: "python",
    category: "scraping",
    relatedModuleIds: ["lib_py_beautifulsoup4_parse", "ml_parse"],
    docsUrl: "https://www.crummy.com/software/BeautifulSoup/bs4/doc/",
    summary: "HTML/XML parsing library for web scraping.",
  },
  {
    name: "scrapy",
    ecosystem: "python",
    category: "scraping",
    relatedModuleIds: ["lib_py_scrapy_crawl"],
    docsUrl: "https://docs.scrapy.org/",
    summary: "High-level web crawling and scraping framework.",
  },

  // ── Python resilience / observability ────────────────────────────────────
  {
    name: "tenacity",
    ecosystem: "python",
    category: "resilience",
    relatedModuleIds: ["selfHeal", "selfHeal_retry", "lib_py_tenacity_retry"],
    docsUrl: "https://tenacity.readthedocs.io/",
    summary: "Retry library with exponential backoff and jitter.",
  },
  {
    name: "circuitbreaker",
    ecosystem: "python",
    category: "resilience",
    relatedModuleIds: ["selfHeal_circuit", "lib_py_circuitbreaker_protect"],
    docsUrl: "https://pypi.org/project/circuitbreaker/",
    summary: "Circuit breaker pattern for fault tolerance.",
  },
  {
    name: "prometheus-client",
    ecosystem: "python",
    category: "observability",
    relatedModuleIds: ["devops_monitor", "lib_py_prometheus_counter", "lib_py_prometheus_histogram", "analytics_metric", "analytics_dashboard"],
    docsUrl: "https://github.com/prometheus/client_python",
    summary: "Prometheus instrumentation library for Python.",
  },

  // ── Python cloud / payments ──────────────────────────────────────────────
  {
    name: "boto3",
    ecosystem: "python",
    category: "cloud",
    relatedModuleIds: ["devops_deploy", "integrate_s3", "lib_py_boto3_s3", "lib_py_boto3_sqs", "lib_py_boto3_lambda", "storage_s3", "storage_archive", "storage_sync", "storage_signed_url", "storage_multipart"],
    docsUrl: "https://boto3.amazonaws.com/v1/documentation/api/latest/index.html",
    summary: "AWS SDK for Python — S3, SQS, Lambda, and more.",
  },
  {
    name: "stripe",
    ecosystem: "python",
    category: "payments",
    relatedModuleIds: ["commerce_checkout", "integrate_stripe", "lib_py_stripe_charge", "lib_py_stripe_subscription"],
    docsUrl: "https://stripe.com/docs/api",
    summary: "Stripe payments, subscriptions, and billing.",
  },
  {
    name: "twilio",
    ecosystem: "python",
    category: "communications",
    relatedModuleIds: ["integrate_twilio", "notify_sms", "lib_py_twilio_sms", "lib_py_twilio_call"],
    docsUrl: "https://www.twilio.com/docs/libraries/python",
    summary: "SMS, voice, and messaging APIs.",
  },
  {
    name: "sendgrid",
    ecosystem: "python",
    category: "communications",
    relatedModuleIds: ["integrate_email", "integrate_sendgrid", "notify_email", "notify_digest", "lib_py_sendgrid_email"],
    docsUrl: "https://docs.sendgrid.com/api-reference",
    summary: "Transactional email delivery API.",
  },

  // ── JavaScript / TypeScript ──────────────────────────────────────────────
  {
    name: "@anthropic-ai/sdk",
    ecosystem: "js",
    category: "ai",
    relatedModuleIds: ["lib_js_anthropic_message"],
    docsUrl: "https://github.com/anthropics/anthropic-sdk-typescript",
    summary: "Official Anthropic TypeScript SDK for Claude.",
  },
  {
    name: "ai",
    ecosystem: "js",
    category: "ai",
    relatedModuleIds: ["lib_js_vercel_ai_stream", "lib_js_vercel_ai_generate"],
    docsUrl: "https://sdk.vercel.ai/docs",
    summary: "Vercel AI SDK for streaming text and structured generation.",
  },
  {
    name: "sharp",
    ecosystem: "js",
    category: "media",
    relatedModuleIds: ["lib_js_sharp_resize", "lib_js_sharp_optimize", "media_thumbnail", "media_compress"],
    docsUrl: "https://sharp.pixelplumbing.com/",
    summary: "High-performance Node.js image processing.",
  },
  {
    name: "ffmpeg",
    ecosystem: "js",
    category: "media",
    relatedModuleIds: ["lib_js_ffmpeg_transcode", "lib_js_ffmpeg_extract", "media_video_extract", "media_video_transcode"],
    docsUrl: "https://ffmpeg.org/documentation.html",
    summary: "Video/audio transcoding and frame extraction.",
  },
  {
    name: "nodemailer",
    ecosystem: "js",
    category: "communications",
    relatedModuleIds: ["integrate_email", "notify_template", "lib_js_nodemailer_send"],
    docsUrl: "https://nodemailer.com/about/",
    summary: "Send emails from Node.js via SMTP or transports.",
  },
  {
    name: "bullmq",
    ecosystem: "js",
    category: "queue",
    relatedModuleIds: ["queue_publish", "queue_consume", "lib_js_bullmq_queue", "lib_js_bullmq_worker"],
    docsUrl: "https://docs.bullmq.io/",
    summary: "Redis-backed job queue for Node.js.",
  },
  {
    name: "node-cron",
    ecosystem: "js",
    category: "schedule",
    relatedModuleIds: ["trigger_schedule", "schedule_cron", "lib_js_node_cron_schedule"],
    docsUrl: "https://www.npmjs.com/package/node-cron",
    summary: "Cron-based job scheduler for Node.js.",
  },
  {
    name: "zod",
    ecosystem: "js",
    category: "validation",
    relatedModuleIds: ["data_validate", "lib_js_zod_parse", "lib_js_zod_safe"],
    docsUrl: "https://zod.dev/",
    summary: "TypeScript-first schema validation.",
  },
  {
    name: "axios",
    ecosystem: "js",
    category: "http",
    relatedModuleIds: ["httpRequest", "lib_js_axios_request"],
    docsUrl: "https://axios-http.com/docs/intro",
    summary: "Promise-based HTTP client for Node.js and browsers.",
  },
  {
    name: "prisma",
    ecosystem: "js",
    category: "database",
    relatedModuleIds: ["data_query", "data_store", "lib_js_prisma_query", "lib_js_prisma_migrate"],
    docsUrl: "https://www.prisma.io/docs",
    summary: "Next-generation ORM for Node.js and TypeScript.",
  },
  {
    name: "drizzle-orm",
    ecosystem: "js",
    category: "database",
    relatedModuleIds: ["data_query", "lib_js_drizzle_query", "lib_js_drizzle_migrate"],
    docsUrl: "https://orm.drizzle.team/docs/overview",
    summary: "Lightweight TypeScript ORM with SQL-like syntax.",
  },

  // ── Cloud / SaaS integrations ────────────────────────────────────────────
  {
    name: "slack",
    ecosystem: "cloud",
    category: "integration",
    relatedModuleIds: ["integrate_slack", "notify_slack"],
    docsUrl: "https://api.slack.com/",
    summary: "Slack Web API for messaging and workflow automation.",
  },
  {
    name: "github",
    ecosystem: "cloud",
    category: "integration",
    relatedModuleIds: ["integrate_github"],
    docsUrl: "https://docs.github.com/en/rest",
    summary: "GitHub REST API for repos, issues, and Actions.",
  },
  {
    name: "notion",
    ecosystem: "cloud",
    category: "integration",
    relatedModuleIds: ["integrate_notion"],
    docsUrl: "https://developers.notion.com/",
    summary: "Notion API for pages, databases, and blocks.",
  },
  {
    name: "hubspot",
    ecosystem: "cloud",
    category: "integration",
    relatedModuleIds: ["integrate_crm", "integrate_hubspot"],
    docsUrl: "https://developers.hubspot.com/docs/api/overview",
    summary: "HubSpot CRM API for contacts, deals, and companies.",
  },
  {
    name: "salesforce",
    ecosystem: "cloud",
    category: "integration",
    relatedModuleIds: ["integrate_salesforce"],
    docsUrl: "https://developer.salesforce.com/docs/apis",
    summary: "Salesforce REST API for CRM objects and automation.",
  },
  {
    name: "shopify",
    ecosystem: "cloud",
    category: "integration",
    relatedModuleIds: ["integrate_shopify", "commerce_checkout", "commerce_inventory"],
    docsUrl: "https://shopify.dev/docs/api",
    summary: "Shopify Admin API for products, orders, and customers.",
  },
  {
    name: "gcs",
    ecosystem: "cloud",
    category: "storage",
    relatedModuleIds: ["integrate_gcs", "storage_gcs"],
    docsUrl: "https://cloud.google.com/storage/docs",
    summary: "Google Cloud Storage object storage.",
  },
  {
    name: "cloudflare-r2",
    ecosystem: "cloud",
    category: "storage",
    relatedModuleIds: ["integrate_r2", "storage_r2"],
    docsUrl: "https://developers.cloudflare.com/r2/",
    summary: "Cloudflare R2 S3-compatible object storage.",
  },
  {
    name: "zapier",
    ecosystem: "cloud",
    category: "integration",
    relatedModuleIds: ["integrate_zapier", "webhookOut"],
    docsUrl: "https://platform.zapier.com/docs",
    summary: "Zapier webhook triggers for no-code automation.",
  },
  {
    name: "n8n",
    ecosystem: "cloud",
    category: "integration",
    relatedModuleIds: ["integrate_n8n", "webhookOut"],
    docsUrl: "https://docs.n8n.io/",
    summary: "n8n workflow automation via webhooks.",
  },
];

/** Look up a library entry by name (case-insensitive). */
export function getLibrary(name: string): LibraryEntry | undefined {
  const lower = name.toLowerCase();
  return LIBRARY_INDEX.find((l) => l.name.toLowerCase() === lower);
}

/** Return all module IDs related to a given library name. */
export function getModuleIdsForLibrary(name: string): string[] {
  return getLibrary(name)?.relatedModuleIds ?? [];
}

/** List libraries filtered by ecosystem. */
export function librariesByEcosystem(ecosystem: LibraryEcosystem): LibraryEntry[] {
  return LIBRARY_INDEX.filter((l) => l.ecosystem === ecosystem);
}
