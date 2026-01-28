# Project Etna - Pricing Strategy

## Waveform File Size Reference

### VCD Files (Uncompressed)

| Design Complexity | Simulation Time | Typical VCD Size |
|-------------------|-----------------|------------------|
| Small testbench (100s of signals) | 1ms | 1-10 MB |
| Medium IP block (1K signals) | 10ms | 10-100 MB |
| Large subsystem (10K signals) | 100ms | 100MB - 1GB |
| Full SoC (100K+ signals) | 1ms | 1-10+ GB |

### FST Files (Compressed)

| VCD Size | FST Equivalent |
|----------|----------------|
| 100 MB | ~5-15 MB |
| 1 GB | ~50-150 MB |
| 10 GB | ~500MB - 1.5GB |

FST provides ~10-20x compression over VCD.

## User Segments & Typical Usage

| User Type | Typical File Size | Expected Tier |
|-----------|-------------------|---------------|
| Students/Learning | 1-10 MB | Free |
| Hobbyist FPGA | 5-50 MB | Free |
| Professional (targeted debug) | 10-100 MB | Free/Pro |
| Professional (full regression) | 100MB - 10GB+ | Pro/Enterprise |

## Pricing Tiers

### Free Tier

**Target:** Students, hobbyists, evaluation

| Feature | Limit |
|---------|-------|
| Waveform file size | Up to 25 MB |
| Stored waveform files | 5 files |
| Waveform formats | VCD only |
| RTL file uploads | 10 files |
| AI queries | 50/day |
| Debug sessions | 10 active |
| Model access | Standard models |

### Pro Tier - $19/month

**Target:** Professional engineers, power users

| Feature | Limit |
|---------|-------|
| Waveform file size | Up to 200 MB |
| Stored waveform files | 50 files |
| Waveform formats | VCD + FST |
| RTL file uploads | Unlimited |
| AI queries | 500/day |
| Debug sessions | Unlimited |
| Model access | All models including premium |
| **BYOK (Bring Your Own Key)** | ✓ Unlimited queries with your keys |
| Priority support | Email support |
| Session history | 90 days |

### Team Tier - $49/user/month

**Target:** Verification teams

| Feature | Limit |
|---------|-------|
| Everything in Pro | ✓ |
| Waveform file size | Up to 500 MB |
| Shared workspaces | ✓ |
| Team collaboration | ✓ |
| Admin dashboard | ✓ |
| SSO/SAML | ✓ |
| Audit logs | ✓ |

### Enterprise - Custom Pricing

**Target:** Large organizations, on-prem needs

| Feature | Description |
|---------|-------------|
| Unlimited file sizes | Server mode with streaming |
| On-premise deployment | Self-hosted option |
| Custom integrations | API access, CI/CD integration |
| Dedicated support | Slack channel, SLA |
| Custom AI training | Fine-tuned models for your codebase |
| Compliance | SOC2, custom security requirements |

## Upsell Triggers

| Trigger | Upsell To |
|---------|-----------|
| File size > 25 MB | Pro |
| > 5 stored files | Pro |
| FST file upload | Pro |
| > 50 AI queries/day | Pro |
| Want to use own API keys (BYOK) | Pro |
| Want specific model (GPT-4, Claude, etc.) | Pro |
| Team invite | Team |
| SSO requirement | Team/Enterprise |
| File > 500 MB | Enterprise |
| On-prem request | Enterprise |

## Infrastructure Cost Considerations

### Vercel Costs (Current Architecture)

| Resource | Free | Pro ($20/mo) |
|----------|------|--------------|
| Blob Storage | 1 GB | 100 GB |
| Blob File Size | 500 MB | 500 MB |
| Serverless Functions | 100GB-hrs | 1000GB-hrs |
| Bandwidth | 100 GB | 1 TB |

### Cost Per User Estimate

| Tier | Storage/User | AI Cost/User | Infra/User |
|------|--------------|--------------|------------|
| Free | ~50 MB | ~$0.10/mo | ~$0.05/mo |
| Pro | ~500 MB | ~$1.00/mo | ~$0.50/mo |

### Margin Analysis

| Tier | Price | Est. Cost | Margin |
|------|-------|-----------|--------|
| Free | $0 | $0.15 | -$0.15 |
| Pro | $19 | $2-5 | 75-90% |
| Team | $49 | $5-10 | 80-90% |

## MVP Launch Strategy

### Phase 1: Free Only
- Validate product-market fit
- Gather usage data for tier boundaries
- Build user base

### Phase 2: Introduce Pro
- Gate advanced features
- File size limits as natural paywall
- FST format as Pro feature

### Phase 3: Team/Enterprise
- After proving individual value
- When teams request collaboration
- Custom contracts for large deals

## Competitive Pricing Reference

| Product | Pricing |
|---------|---------|
| Cadence Verisium | $50K+/year (enterprise) |
| GitHub Copilot | $10-19/month |
| Cursor Pro | $20/month |
| Replit | $7-20/month |
| Linear | $8/user/month |

Project Etna's $19/month Pro tier is competitive with developer tools while being dramatically cheaper than traditional EDA tools.

---

## AI Model Strategy

### MVP Model Selection (Vercel-Compatible)

For MVP, prioritize models that are:
1. **Fast** - Low latency for good UX
2. **Cheap** - Sustainable at scale
3. **Vercel-compatible** - Works with serverless architecture

**Recommended MVP Stack:**

| Use Case | Default Model | Why |
|----------|---------------|-----|
| **Free Tier** | DeepSeek V3 (via OpenRouter) | Best price/performance, $0.14/M input |
| **Ask Mode** | DeepSeek V3 | Good for explanations, cheap |
| **Agent Mode** | DeepSeek V3 | Strong reasoning, cost-effective |
| **Debug Mode** | DeepSeek V3 | Excellent at analysis |
| **Quick tasks** | Llama 3.3 70B | Fast, cheap fallback |

**Cost Comparison:**

| Model | Input (per 1M) | Output (per 1M) | Speed |
|-------|----------------|-----------------|-------|
| DeepSeek V3 | $0.14 | $0.28 | Fast |
| Llama 3.3 70B | $0.10 | $0.40 | Fast |
| GPT-4o | $2.50 | $10.00 | Medium |
| Claude 3.5 Sonnet | $3.00 | $15.00 | Medium |

**MVP Recommendation:** Use **OpenRouter** as the unified gateway:
- Single API integration
- Access to all models
- Automatic fallbacks
- Pay-as-you-go (5.5% platform fee)
- Works perfectly with Vercel serverless

### BYOK (Bring Your Own Key) - Pro Feature

**What is BYOK?**
Pro users can add their own API keys to:
- Remove query limits (use as much as their key allows)
- Access premium models (GPT-4, Claude, etc.)
- Control costs directly
- Use enterprise API agreements

**Supported BYOK Providers:**

| Provider | Key Type | Models Unlocked |
|----------|----------|-----------------|
| **OpenRouter** | API Key | 400+ models (recommended) |
| **OpenAI** | API Key | GPT-4o, GPT-4, O1, O3 |
| **Anthropic** | API Key | Claude 3.5/4 Sonnet, Opus |
| **Google** | API Key | Gemini Pro, Ultra |

**Implementation Priority:**
1. OpenRouter (covers 90% of use cases with one integration)
2. OpenAI (enterprise customers often have keys)
3. Anthropic (popular for coding tasks)

**BYOK UX:**

```
Settings > AI Models

┌─────────────────────────────────────────────────────────────────┐
│ AI MODEL SETTINGS                                    [Pro ✓]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ DEFAULT MODEL                                                   │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ DeepSeek V3 (Recommended)                              ▼   ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ BRING YOUR OWN KEY (BYOK)                                      │
│ ─────────────────────────────────────────────────────────────  │
│ Add your API keys to unlock unlimited queries and more models. │
│                                                                 │
│ OpenRouter    [sk-or-v1-••••••••••••]  ✓ Connected  [Remove]  │
│ OpenAI        [Add Key]                                        │
│ Anthropic     [Add Key]                                        │
│ Google AI     [Add Key]                                        │
│                                                                 │
│ 💡 Tip: OpenRouter gives you access to 400+ models with one   │
│    key. Get yours at openrouter.ai                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Mode-Specific Model Recommendations:**

When BYOK is enabled, suggest optimal models per mode:

| Mode | Recommended Model | Why |
|------|-------------------|-----|
| **Ask** | DeepSeek V3, Llama 3.3 | Cheap, good for Q&A |
| **Agent** | Claude 3.5 Sonnet, GPT-4o | Best at following complex instructions |
| **Debug** | DeepSeek V3, Claude | Strong reasoning for hypothesis |
| **Manual** | Any (simple edits) | Doesn't need advanced model |

### Cost Impact of BYOK

**For Etna (Business):**
- Pro users with BYOK = $0 AI cost to Etna
- Pure margin on $19/month subscription
- Encourages heavy users to upgrade

**For Users:**
- Control their own spend
- Use existing enterprise API budgets
- Access to latest models immediately

### Margin Analysis (Updated with BYOK)

| Tier | Price | AI Cost | Other Cost | Margin |
|------|-------|---------|------------|--------|
| Free | $0 | ~$0.10/mo | ~$0.05/mo | -$0.15 |
| Pro (no BYOK) | $19 | ~$1-2/mo | ~$0.50/mo | 85-90% |
| Pro (with BYOK) | $19 | **$0** | ~$0.50/mo | **97%** |
| Team | $49 | Varies | ~$1/mo | 90-98% |
