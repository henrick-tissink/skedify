# Database Setup

## Prerequisites

Make sure PostgreSQL is installed and running on your system.

## Local Development Setup

1. Create the database:
```sql
CREATE DATABASE skedify;
```

2. Run the schema:
```bash
psql -d skedify -f schema.sql
```

## Production Setup

For production, use a managed PostgreSQL service like:
- Supabase (recommended for MVP)
- Neon
- Railway
- AWS RDS

## Environment Variables

Copy `.env.example` to `.env` and update the DATABASE_URL:

```
DATABASE_URL=postgresql://username:password@localhost:5432/skedify
```