# Database Migration Guide

## Add Subscription Fields

This migration adds subscription fields to the User model to support premium features.

### Migration Steps

1. **Ensure your database is running and connected**
   - Check your `DATABASE_URL` in `.env.local`
   - Verify connection: `npx prisma db pull` (should work without errors)

2. **Run the migration**
   ```bash
   npx prisma migrate dev --name add_subscription_fields
   ```

   Or if you prefer to run the SQL directly:
   ```bash
   psql $DATABASE_URL -f prisma/migrations/20250101000000_add_subscription_fields/migration.sql
   ```

3. **Verify the migration**
   ```bash
   npx prisma studio
   ```
   - Check that the `users` table has the new columns:
     - `plan` (default: 'free')
     - `subscriptionStatus`
     - `subscriptionExpiresAt`

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

### Migration SQL

The migration adds:
- `plan` TEXT DEFAULT 'free' - User's subscription plan
- `subscriptionStatus` TEXT - Status of subscription (active, canceled, expired)
- `subscriptionExpiresAt` TIMESTAMP - When subscription expires

All existing users will be set to 'free' plan automatically.

### Testing Premium Features

To test premium features locally, you can update a user's plan:

```sql
-- Set user to Pro plan
UPDATE users 
SET plan = 'pro', 
    subscriptionStatus = 'active', 
    subscriptionExpiresAt = NOW() + INTERVAL '30 days'
WHERE email = 'your-email@example.com';
```

### Production Deployment

1. **Run migration on production database**
   ```bash
   npx prisma migrate deploy
   ```

2. **Or use Vercel Postgres migration**
   - Vercel will automatically run migrations if configured
   - Or run manually via Vercel dashboard

3. **Verify deployment**
   - Check that the app builds successfully
   - Test model selector with premium features
   - Verify upgrade buttons appear for free users

