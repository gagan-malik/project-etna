# Deployment Checklist - Model Selector Enhancement

## Pre-Deployment

- [x] Code committed to GitHub
- [x] Build passes locally (`npm run build`)
- [x] No TypeScript errors
- [x] No linter errors
- [x] Migration file created

## Database Migration

- [ ] Run migration on production database
  ```bash
  npx prisma migrate deploy
  ```
- [ ] Verify migration succeeded
- [ ] Check that existing users have `plan = 'free'`

## Environment Variables

- [ ] Verify `DATABASE_URL` is set in Vercel
- [ ] Verify all API keys are configured (OpenAI, etc.)

## Testing Checklist

### Model Selector Component
- [ ] Model selector opens correctly
- [ ] Search functionality works
- [ ] Models display with brain icons
- [ ] Model selection works (radio button)
- [ ] "Manage Models" button visible

### Auto Mode (Free Feature)
- [ ] Auto Mode toggle works
- [ ] Model auto-selects based on query type
- [ ] Works for code queries (selects code-capable model)
- [ ] Works for math queries (selects math-capable model)
- [ ] Works for creative queries (selects creative-capable model)
- [ ] Toggle state persists in localStorage

### MAX Mode (Premium Feature)
- [ ] MAX Mode toggle visible
- [ ] Upgrade button appears for free users
- [ ] Upgrade button links to `/overview`
- [ ] Toggle disabled for free users
- [ ] Works correctly for premium users
- [ ] Selects highest quality model when enabled
- [ ] API validates premium access

### Use Multiple Models (Premium Feature)
- [ ] Use Multiple Models toggle visible
- [ ] Upgrade button appears for free users
- [ ] Upgrade button links to `/overview`
- [ ] Toggle disabled for free users
- [ ] Works correctly for premium users
- [ ] Streams from multiple models in parallel
- [ ] Combines responses correctly
- [ ] API validates premium access

### Overview/Upgrade Page
- [ ] Page loads at `/overview`
- [ ] Plans display correctly (Free, Pro, Enterprise)
- [ ] Premium features highlighted
- [ ] Upgrade buttons work
- [ ] Current plan displayed correctly

### API Endpoints
- [ ] `/api/messages/stream` accepts `maxMode` and `useMultipleModels`
- [ ] Premium feature validation works (403 for non-premium)
- [ ] MAX Mode selects highest quality model
- [ ] Multiple Models streams from multiple models
- [ ] `/api/account/profile` returns subscription info

### Integration
- [ ] Chat page integrates ModelSelector correctly
- [ ] Premium access check works
- [ ] Toggle states persist across page reloads
- [ ] Error handling works (premium feature without access)
- [ ] Toast notifications work for upgrade prompts

## Post-Deployment

- [ ] Monitor error logs for any issues
- [ ] Check Vercel deployment logs
- [ ] Test with a free user account
- [ ] Test with a premium user account (if available)
- [ ] Verify upgrade flow works end-to-end

## Rollback Plan

If issues occur:
1. Revert the last commit
2. Run rollback migration (if needed)
3. Redeploy previous version

