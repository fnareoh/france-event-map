# Issue 6: Error Handling & Robustness

**Priority**: Medium  
**Epic**: Reliability  
**Status**: Not Started  
**Depends On**: Issue 5 (Pagination)

## Goal
Make the application resilient to failures by implementing proper error handling, retry logic, and user feedback.

## Acceptance Criteria
- [ ] API returns structured error responses with codes
- [ ] Frontend retries failed API calls 2-3 times
- [ ] User sees clear error messages after retries are exhausted
- [ ] Loading states are visible during API calls
- [ ] Network errors are handled gracefully
- [ ] Invalid user input is validated and rejected with helpful messages
- [ ] All existing functionality continues to work

---

## Backend Tasks (`packages/backend`)

### Error Response Format
- [ ] All error responses follow consistent format:
  ```json
  {
    "error": {
      "code": "ERROR_CODE",
      "message": "Human-readable error message"
    }
  }
  ```

### Error Codes
Implement the following error codes:
- [ ] `DB_ERROR` - Database connection/query errors
- [ ] `VALIDATION_ERROR` - Invalid request parameters
- [ ] `NOT_FOUND` - Resource not found
- [ ] `INTERNAL_ERROR` - Unexpected server errors

### Error Handling Middleware
- [ ] Create error handling middleware at `src/middleware/errorHandler.ts`
- [ ] Catch all uncaught errors
- [ ] Return appropriate HTTP status codes:
  - 400 for validation errors
  - 404 for not found
  - 500 for server errors
- [ ] Log errors to console (for development)

### Route-Level Validation
- [ ] Validate all query parameters in `/api/events`:
  - `search`: must be string or undefined
  - `includePast`: must be boolean
  - `dateFrom`, `dateTo`: must be valid ISO date strings
  - `cursor`: must be valid ISO date string
  - `limit`: must be positive integer
- [ ] Return `VALIDATION_ERROR` with specific message for each invalid parameter

### Database Error Handling
- [ ] Catch TypeORM query errors
- [ ] Return `DB_ERROR` for connection failures
- [ ] Return `DB_ERROR` for query execution failures

---

## Frontend Tasks (`packages/frontend`)

### API Client
- [ ] Create reusable API client function with retry logic
- [ ] Retry failed requests 2-3 times
- [ ] Delay between retries: 1-2 seconds
- [ ] Exponential backoff optional (2s, 4s)

### Error Handling
- [ ] Parse error responses from API
- [ ] Extract `error.code` and `error.message`
- [ ] Display user-friendly messages based on error code:
  - `DB_ERROR`: "Database error. Please try again later."
  - `VALIDATION_ERROR`: Show the specific validation message
  - `NOT_FOUND`: "No events found."
  - `INTERNAL_ERROR`: "An error occurred. Please try again."
  - Network errors: "Network error. Please check your connection."

### Loading States
- [ ] Add loading spinner/indicator during API calls
- [ ] Disable UI elements during loading (search button, load more button)
- [ ] Show loading state for initial page load
- [ ] Show loading state for pagination

### UI Feedback
- [ ] Add error message display area (toast, banner, or inline)
- [ ] Clear error messages on successful requests
- [ ] Clear error messages on new user actions
- [ ] Style error messages for visibility

### Retry Logic Implementation
```typescript
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 2000) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Request failed');
    }
    
    return await response.json();
  } catch (error) {
    if (retries <= 0) {
      throw error; // Re-throw after all retries exhausted
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithRetry(url, options, retries - 1, delay * 2);
  }
}
```

---

## API Error Response Examples

**Validation Error (invalid date format):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid date format for parameter 'dateFrom'. Expected ISO 8601 format (YYYY-MM-DD)."
  }
}
```

**Database Error:**
```json
{
  "error": {
    "code": "DB_ERROR",
    "message": "Database connection failed."
  }
}
```

**Not Found:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "No events found matching your criteria."
  }
}
```

---

## Testing Instructions

1. Run `pnpm dev`
2. **Network Error Test**: Disable network and click search/load more
   - Verify retry attempts (2-3 times)
   - Verify error message appears after retries exhausted
3. **Validation Error Test**: Manually construct invalid request (e.g., `/api/events?dateFrom=invalid`)
   - Verify proper error response
4. **Database Error Test**: Stop database and reload page
   - Verify `DB_ERROR` response
   - Verify user sees appropriate message
5. **Loading State Test**:
   - Verify loading indicator appears during fetch
   - Verify buttons are disabled during loading
6. **Success Test**: Re-enable everything and verify normal operation

---

## Edge Cases to Consider

- [ ] Rapid successive clicks on search/load more buttons
- [ ] Network reconnects during retry
- [ ] Server returns 503 Service Unavailable
- [ ] Server returns malformed JSON
- [ ] Very slow network responses
- [ ] CORS errors in development
- [ ] Authentication errors (future consideration)

---

## Dependencies

### Backend
```bash
pnpm add express-validator  # Optional, for validation
```

### Frontend
No new dependencies required (uses native fetch)
