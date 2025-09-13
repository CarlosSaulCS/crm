# 🔐 Development Login Credentials

## Test Accounts for Local Development

### Admin Account (Fallback - No DB required)

- **Email**: `admin@acme.com`
- **Password**: `admin123`
- **Note**: This works even without database connection

### Database Users (Requires SQLite/PostgreSQL)

After running `npm run db:seed`, you can use these accounts:

1. **Admin User**
   - **Email**: `admin@acme.com`
   - **Password**: `admin123`
   - **Role**: Admin

2. **Sales Manager**
   - **Email**: `sarah@acme.com`
   - **Password**: `sarah123`
   - **Role**: Sales Manager

3. **Sales Rep**
   - **Email**: `mike@acme.com`
   - **Password**: `mike123`
   - **Role**: Sales Rep

## Quick Setup for Development

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Setup SQLite database**:

   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

4. **Access the app**:
   - Open http://localhost:3000
   - Use any of the test accounts above

## Environment Configuration

Make sure your `.env` file has:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=5f2bac13df4ffda9d1a05296999094cd1ecc75ae9b7211c1ebc51ef4b11ada30
DATABASE_URL=file:./prisma/dev.db
AUTH_SALT_ROUNDS=12
```

## Troubleshooting

### NextAuth Errors

- Clear browser cookies/localStorage
- Restart the development server
- Check that `NEXTAUTH_SECRET` is set correctly

### Database Errors

- Run `npx prisma db push` to recreate database
- Run `npm run db:seed` to populate with test data

### JWT Errors

- Clear browser cookies (especially `next-auth.session-token`)
- The error usually resolves after clearing cookies
