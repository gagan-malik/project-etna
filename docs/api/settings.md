---
title: Settings API
description: Get and update user preferences
---

# Settings API

User preferences for Cursor-like settings (theme, notifications, privacy mode, etc.). Persisted in `users.userPreferences`. Privacy mode is allowed only for paid plans.

**Reference:** [docs/product/SETTINGS_PLAN.md](../product/SETTINGS_PLAN.md)

---

## GET /api/settings

Returns the current user's preferences and plan (for gating paid-only features like Privacy Mode).

### Authentication

Required. Session cookie.

### Response

```json
{
  "preferences": {
    "theme": "system",
    "syncLayouts": true,
    "systemNotifications": true,
    "menuBarIcon": true,
    "completionSound": false,
    "privacyMode": "off",
    "includeThirdPartyConfig": true
  },
  "plan": "pro"
}
```

- `preferences`: Object; may contain only allowed keys (see PATCH). Omitted keys use app defaults.
- `plan`: `"free"` | `"pro"` | `"enterprise"` (or similar); used to show/hide Privacy Mode.

### Status Codes

| Code | Description |
|:-----|:------------|
| 200 | Success |
| 401 | Unauthorized |
| 404 | User not found |
| 500 | Server error |

---

## PATCH /api/settings

Updates user preferences. Only known keys are accepted; unknown keys are rejected (400). `privacyMode` is ignored for free plan users (not stored).

### Authentication

Required. Session cookie.

### Request Body

Partial object; only send keys you want to update. All fields optional.

| Key | Type | Description |
|:----|:-----|:------------|
| theme | `"light"` \| `"dark"` \| `"system"` | UI theme |
| syncLayouts | boolean | Sync layouts across windows |
| systemNotifications | boolean | System notifications when Agent completes |
| menuBarIcon | boolean | Show app in menu bar |
| completionSound | boolean | Play sound when Agent finishes |
| privacyMode | `"off"` \| `"standard"` \| `"strict"` | **Paid plans only**; ignored for free |
| includeThirdPartyConfig | boolean | Include third-party skills/workers configs |

### Example

```json
{
  "theme": "dark",
  "completionSound": true
}
```

### Response

```json
{
  "preferences": { ... },
  "plan": "pro",
  "message": "Settings updated"
}
```

### Status Codes

| Code | Description |
|:-----|:------------|
| 200 | Success |
| 400 | Invalid body (unknown or invalid keys) |
| 401 | Unauthorized |
| 404 | User not found |
| 429 | Rate limit exceeded |
| 500 | Server error |

### Rate Limiting

Uses default limit (see [API Reference](./index.md#rate-limiting)).
