# Issue 4: Search by Name or City

**Priority**: High  
**Epic**: Filtering & Search  
**Status**: Not Started  
**Depends On**: Issue 3 (Date Filtering)

## Goal
Enable users to search for events by name or city using a text input. The search should match any part of the name or city field (contains match).

## Acceptance Criteria
- [ ] Search input field is visible on the page
- [ ] Search button triggers the search
- [ ] Search matches events where name OR city contains the search term
- [ ] Empty search returns all events (respecting date filter)
- [ ] Search results update the map display
- [ ] All existing functionality continues to work

---

## Backend Tasks (`packages/backend`)

### API Update
- [ ] Update GET `/api/events` endpoint to accept `search` query parameter
- [ ] Parameter type: string
- [ ] Default value: none (empty string = no filter)
- [ ] Modify query to add: `AND (name LIKE '%:search%' OR city LIKE '%:search%')`
- [ ] Handle empty/undefined search parameter (return all events)

### Validation
- [ ] Validate `search` parameter is a string
- [ ] Sanitize input to prevent SQL injection (TypeORM handles this with parameters)
- [ ] Return `VALIDATION_ERROR` if invalid type provided

### Query Example
```typescript
// With TypeORM QueryBuilder
const query = repository.createQueryBuilder("event");

if (includePast === false) {
  query.andWhere("event.date >= date('now')");
}

if (search) {
  query.andWhere("(event.name LIKE :search OR event.city LIKE :search)", {
    search: `%${search}%`
  });
}

const events = await query.getMany();
```

---

## Frontend Tasks (`packages/frontend`)

### UI Components
- [ ] Add text input field with label "Search events"
- [ ] Add search button next to input
- [ ] Position search components near other filters
- [ ] Add placeholder text (e.g., "Search by name or city...")

### State Management
- [ ] Add `searchTerm` state (string)
- [ ] Update `searchTerm` on input change
- [ ] Trigger search on button click

### Fetch Logic
- [ ] Modify event fetch to include `search` query parameter
- [ ] Example: `/api/events?search=Paris` or `/api/events?search=Paris&includePast=true`
- [ ] Combine with existing `includePast` parameter

### UX
- [ ] Show loading state during search
- [ ] Clear search input when user wants to reset (optional: add clear button)
- [ ] Handle Enter key press in input field to trigger search

---

## Monorepo Tasks

No changes required.

---

## API Examples

**Request (search for "Paris"):**
```
GET /api/events?search=Paris
```

**Request (search for "meet" with past events):**
```
GET /api/events?search=meet&includePast=true
```

**Response:**
```json
{
  "events": [
    {
      "id": 1,
      "name": "Paris Tech Meetup",
      "city": "Paris",
      ...
    }
  ]
}
```

---

## Testing Instructions

1. Run `pnpm dev`
2. Open browser and verify all events appear
3. Type "Paris" in search box and click search
4. Verify only events with "Paris" in name or city appear
5. Type "meet" and search
6. Verify events with "meet" in name or city appear
7. Clear search and verify all events reappear
8. Try searching for partial strings (e.g., "par" should match "Paris")
9. Try searching for strings that don't match any events
10. Verify date filter still works with search

---

## Sample Test Data

Ensure your database has events with various names and cities:
```json
{
  "id": 5,
  "date": "2025-01-20",
  "name": "Lyon JavaScript Workshop",
  "location": "Tech Hub",
  "city": "Lyon",
  "details": null,
  "lat": 45.7640,
  "lng": 4.8357
},
{
  "id": 6,
  "date": "2025-02-01",
  "name": "Paris React Conference",
  "location": "Grand Palais",
  "city": "Paris",
  "details": null,
  "lat": 48.8600,
  "lng": 2.3373
}
```

---

## Edge Cases to Consider

- [ ] Empty search string
- [ ] Search string with special characters
- [ ] Search string with SQL injection attempts
- [ ] Search that matches no events
- [ ] Search combined with date filter
- [ ] Case sensitivity (SQLite LIKE is case-insensitive by default for ASCII)
