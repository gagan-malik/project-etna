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
