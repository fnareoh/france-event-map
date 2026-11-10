# Issue 5: Cursor-Based Pagination

**Priority**: Medium  
**Epic**: Performance & Scalability  
**Status**: Not Started  
**Depends On**: Issue 4 (Search)

## Goal
Implement cursor-based pagination to handle large datasets efficiently. Users can load more events without performance degradation.

## Acceptance Criteria
- [ ] API supports cursor-based pagination on the `date` field
- [ ] Frontend has a "Load more" button
- [ ] Clicking "Load more" fetches the next batch of events
- [ ] New events are appended to the existing list
- [ ] No duplicate events across pagination requests
- [ ] Button is hidden when no more events are available
- [ ] All existing functionality continues to work

---

## Backend Tasks (`packages/backend`)

### API Update
- [ ] Add `cursor` query parameter (date string in ISO 8601 format)
- [ ] Add `limit` query parameter (number, default: 100)
- [ ] Modify query to use cursor-based pagination:
  - `WHERE date > :cursor ORDER BY date ASC LIMIT :limit`
- [ ] Return `nextCursor` in response (date of the last returned event)
- [ ] If no more results, return `nextCursor: null` or omit it

### Query Implementation
```typescript
const limit = parseInt(req.query.limit) || 100;
const cursor = req.query.cursor; // ISO date string

const query = repository.createQueryBuilder("event");

// Apply existing filters (includePast, search)
if (includePast === false) {
  query.andWhere("event.date >= date('now')");
}
if (search) {
  query.andWhere("(event.name LIKE :search OR event.city LIKE :search)", {
    search: `%${search}%`
  });
}

// Apply cursor
if (cursor) {
  query.andWhere("event.date > :cursor", { cursor });
}

query.orderBy("event.date", "ASC");
query.limit(limit);

const events = await query.getMany();

// Set next cursor
const nextCursor = events.length > 0 ? events[events.length - 1].date : null;

return { events, nextCursor };
```

### Response Format Update
```json
{
  "events": [...],
  "nextCursor": "2025-02-01"
}
```

### Validation
- [ ] Validate `limit` is a positive integer
- [ ] Validate `cursor` is a valid ISO date string
- [ ] Return `VALIDATION_ERROR` for invalid parameters

---

## Frontend Tasks (`packages/frontend`)

### UI Components
- [ ] Add "Load more" button below the map or results
- [ ] Button should be visible only when there are more results
- [ ] Add loading state to button (e.g., spinner + "Loading...")

### State Management
- [ ] Add `nextCursor` state (string or null)
- [ ] Add `allEvents` state to store all fetched events
- [ ] Add `isLoadingMore` state for button loading indicator

### Fetch Logic
- [ ] On "Load more" click, fetch with `?cursor=<nextCursor>&limit=100`
- [ ] Append new events to existing list
- [ ] Update `nextCursor` with response's `nextCursor`
- [ ] Hide button if `nextCursor` is null
- [ ] Combine with existing query parameters (`includePast`, `search`)

### Data Management
- [ ] Store all events in state (don't replace on pagination)
- [ ] Ensure no duplicate events (cursor-based should prevent this)

---

## API Examples

**First request (no cursor):**
```
GET /api/events?limit=100
```
Response:
```json
{
  "events": [/* first 100 events */],
  "nextCursor": "2025-03-15"
}
```

**Second request (with cursor):**
```
GET /api/events?cursor=2025-03-15&limit=100
```
Response:
```json
{
  "events": [/* next 100 events */],
  "nextCursor": "2025-04-20"
}
```

**Last request:**
```
GET /api/events?cursor=2025-05-01&limit=100
```
Response:
```json
{
  "events": [/* final events */],
  "nextCursor": null
}
```

---

## Testing Instructions

1. Seed database with more than 100 events
2. Run `pnpm dev`
3. Open browser and verify first 100 events appear
4. Click "Load more" and verify next batch appears
5. Continue clicking until all events are loaded
6. Verify "Load more" button disappears when no more results
7. Verify pagination works with search filter
8. Verify pagination works with date filter
9. Verify no duplicate events across pages

---

## Sample Test Data

Create a seed script that generates 150+ test events with dates spread across several months.

---

## Edge Cases to Consider

- [ ] Fewer than `limit` events in total
- [ ] Exactly `limit` events in total
- [ ] Pagination with search filter applied
- [ ] Pagination with date filter applied
- [ ] Invalid cursor value
- [ ] Cursor with future date (should return empty)
- [ ] Very large limit values
- [ ] Negative limit values
