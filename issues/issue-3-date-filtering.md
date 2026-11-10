# Issue 3: Date Filtering

**Priority**: High  
**Epic**: Filtering & Search  
**Status**: Not Started  
**Depends On**: Issue 2 (Database Integration)

## Goal
Allow users to toggle between viewing only future events and viewing all events (including past ones).

## Acceptance Criteria
- [ ] Only future events are shown by default
- [ ] Checking "Include past events" shows events with dates in the past
- [ ] Unchecking the box hides past events again
- [ ] All existing functionality continues to work

---

## Backend Tasks (`packages/backend`)

### API Update
- [ ] Update GET `/api/events` endpoint to accept `includePast` query parameter
- [ ] Parameter type: boolean (accept `true`, `false`, `1`, `0`)
- [ ] Default value: `false`
- [ ] Modify query:
  - If `includePast=false`: `WHERE date >= date('now')`
  - If `includePast=true`: Remove date filter (or use `WHERE 1=1`)

### Validation
- [ ] Validate `includePast` parameter is a boolean
- [ ] Return `VALIDATION_ERROR` if invalid value provided

---

## Frontend Tasks (`packages/frontend`)

### UI Components
- [ ] Add checkbox input with label "Include past events"
- [ ] Position checkbox in a visible location (e.g., above map or in a sidebar)
- [ ] Default state: unchecked

### State Management
- [ ] Add `includePast` state (boolean)
- [ ] Update fetch URL when `includePast` changes
- [ ] Trigger re-fetch when checkbox state changes

### Fetch Logic
- [ ] Modify event fetch to include `includePast` query parameter
- [ ] Example: `/api/events?includePast=true` or `/api/events?includePast=false`

### UX
- [ ] Show loading state during re-fetch
- [ ] Maintain other filters when toggling (if any exist)

---

## Monorepo Tasks

No changes required.

---

## API Examples

**Request (default - future only):**
```
GET /api/events
```

**Request (include past):**
```
GET /api/events?includePast=true
```

**Response (same format as Issue 1 & 2):**
```json
{
  "events": [
    {
      "id": 1,
      "date": "2024-12-15",
      ...
    },
    {
      "id": 4,
      "date": "2024-11-01",  // past event
      ...
    }
  ]
}
```

---

## Testing Instructions

1. Ensure database has events with both past and future dates
2. Run `pnpm dev`
3. Open browser and verify only future events appear
4. Check "Include past events" box
5. Verify past events now appear on the map
6. Uncheck the box
7. Verify past events disappear, only future events remain

---

## Sample Test Data

Add to your seed data:
```json
{
  "id": 4,
  "date": "2024-10-01",  // Past date
  "name": "Past Event Test",
  "location": "Test Venue",
  "city": "Paris",
  "details": "This event is in the past",
  "lat": 48.8566,
  "lng": 2.3522
}
```

---

## Edge Cases to Consider

- [ ] Empty result set when no future events exist
- [ ] Empty result set when no past events exist
- [ ] All events are in the past
- [ ] All events are in the future
