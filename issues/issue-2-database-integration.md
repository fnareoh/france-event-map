# Issue 2: Database Integration

**Priority**: High  
**Epic**: Core Functionality  
**Status**: Not Started  
**Depends On**: Issue 1 (Static Map with Hardcoded Events)

## Goal
Replace the hardcoded event data with a real SQLite database using TypeORM. The API should query events from the database instead of returning static data.

## Acceptance Criteria
- [ ] Events are fetched from SQLite database
- [ ] Map displays events from the database
- [ ] Database file is created at the configured path
- [ ] All existing functionality from Issue 1 still works

---

## Backend Tasks (`packages/backend`)

### Setup
- [ ] Add TypeORM dependencies
- [ ] Add SQLite3 driver
- [ ] Add `better-sqlite3` for native SQLite support (optional, faster)

### Database Configuration
- [ ] Create `src/data-source.ts` to configure TypeORM DataSource
- [ ] Support `DATABASE_PATH` environment variable for database file location
- [ ] Configure SQLite connection options
- [ ] Set up entity synchronization or migrations

### Event Entity
- [ ] Create `src/entity/Event.ts`
- [ ] Define entity with all required fields:
  - `id`: primary key, auto-increment
  - `date`: string (ISO 8601 date)
  - `name`: string
  - `location`: string
  - `city`: string
  - `details`: string, nullable
  - `lat`: number
  - `lng`: number
- [ ] Add TypeORM decorators (`@Entity`, `@PrimaryGeneratedColumn`, `@Column`)

### Repository & Service
- [ ] Create `src/repository/EventRepository.ts` or use TypeORM's built-in repository
- [ ] Create `src/service/EventService.ts` (optional, for business logic)
- [ ] Implement method to fetch all future events

### API Update
- [ ] Update GET `/api/events` endpoint to query from database
- [ ] Query: `SELECT * FROM event WHERE date >= date('now')`
- [ ] Maintain the same response format as Issue 1

### Data Seeding
- [ ] Create seed script to insert test events
- [ ] Seed data should include the same 3-4 events from Issue 1
- [ ] Run seed script automatically on first startup or via separate command

---

## Frontend Tasks (`packages/frontend`)

No changes required. The API contract remains the same.

---

## Monorepo Tasks

No changes required.

---

## Environment Variables

Add to backend `.env.example`:
```
DATABASE_PATH=./data/events.db
```

---

## Database Schema

```sql
CREATE TABLE event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    details TEXT,
    lat REAL NOT NULL,
    lng REAL NOT NULL
);
```

---

## TypeORM Entity Example

```typescript
// src/entity/Event.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: string;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column()
    city: string;

    @Column({ nullable: true })
    details: string | null;

    @Column("real")
    lat: number;

    @Column("real")
    lng: number;
}
```

---

## Testing Instructions

1. Ensure database file exists at configured path
2. Run `pnpm dev` at project root
3. Open browser to `http://localhost:5173`
4. Verify map loads with markers at correct locations
5. Verify events are fetched from database (check database file)
6. Stop server, delete database file, restart, and verify it's recreated with seed data

---

## Dependencies

```bash
pnpm add typeorm sqlite3
pnpm add -D @types/node
```

Or for better performance:
```bash
pnpm add typeorm better-sqlite3
```
