# API test report

- **Run date:** 2026-11-17 16:05:09 UTC
- **Result:** 51 / 51 passed, 0 failed
- **Duration:** 12.7 s
- **Command:** `npm run test:api`

| Suite | Tests | Passed | Failed |
| --- | --- | --- | --- |
| JSONPlaceholder | 28 | 28 | 0 |
| Restful-Booker | 23 | 23 | 0 |

## JSONPlaceholder

| Result | Spec file | Test | Time |
| --- | --- | --- | --- |
| ✅ | crud.spec.ts | creates a post: short post @smoke | 0.4 s |
| ✅ | crud.spec.ts | creates a post: post by another user @smoke | 0.7 s |
| ✅ | crud.spec.ts | replaces a post with PUT | 0.3 s |
| ✅ | crud.spec.ts | partially updates a post with PATCH: change title only | 0.4 s |
| ✅ | crud.spec.ts | partially updates a post with PATCH: change body only | 1.3 s |
| ✅ | crud.spec.ts | deletes a post | 0.3 s |
| ✅ | filter.spec.ts | filters posts by user 1 | 0.2 s |
| ✅ | filter.spec.ts | filters posts by user 7 | 0.1 s |
| ✅ | filter.spec.ts | filters comments on post 1 | 0.1 s |
| ✅ | filter.spec.ts | filters albums by user 2 | 0.1 s |
| ✅ | filter.spec.ts | filters todos by user 1 | 0.1 s |
| ✅ | filter.spec.ts | GET /posts/1/comments returns comments of post 1 | 0.1 s |
| ✅ | filter.spec.ts | GET /users/1/posts returns posts of user 1 | 0.1 s |
| ✅ | filter.spec.ts | GET /users/1/albums returns albums of user 1 | 0.1 s |
| ✅ | filter.spec.ts | GET /users/1/todos returns todos of user 1 | 0.1 s |
| ✅ | read.spec.ts | GET /posts returns 100 posts matching the schema @smoke | 0.1 s |
| ✅ | read.spec.ts | GET /comments returns 500 comments matching the schema @smoke | 0.3 s |
| ✅ | read.spec.ts | GET /albums returns 100 albums matching the schema @smoke | 0.2 s |
| ✅ | read.spec.ts | GET /todos returns 200 todos matching the schema @smoke | 0.2 s |
| ✅ | read.spec.ts | GET /users returns 10 users matching the schema @smoke | 0.1 s |
| ✅ | read.spec.ts | GET /posts/1 returns post 1 | 0.1 s |
| ✅ | read.spec.ts | GET /posts/100 returns post 100 | 0.4 s |
| ✅ | read.spec.ts | GET /comments/7 returns comment 7 | 0.1 s |
| ✅ | read.spec.ts | GET /todos/10 returns todo 10 | 0.1 s |
| ✅ | read.spec.ts | GET /users/5 returns user 5 | 0.1 s |
| ✅ | read.spec.ts | GET /posts/99999 returns 404 (missing post) | 0.1 s |
| ✅ | read.spec.ts | GET /users/99999 returns 404 (missing user) | 0.1 s |
| ✅ | read.spec.ts | GET /comments/99999 returns 404 (missing comment) | 0.1 s |

## Restful-Booker

| Result | Spec file | Test | Time |
| --- | --- | --- | --- |
| ✅ | auth.spec.ts | valid credentials return a token @smoke | 0.8 s |
| ✅ | auth.spec.ts | rejects wrong password @negative | 0.8 s |
| ✅ | auth.spec.ts | rejects unknown user @negative | 0.8 s |
| ✅ | auth.spec.ts | rejects empty credentials @negative | 0.8 s |
| ✅ | booking-flow.spec.ts | create -> read -> update -> patch -> delete -> verify gone @smoke | 2.4 s |
| ✅ | booking-negative.spec.ts | GET a booking that does not exist returns 404 | 1.0 s |
| ✅ | booking-negative.spec.ts | PUT without a token is forbidden | 1.4 s |
| ✅ | booking-negative.spec.ts | PATCH without a token is forbidden | 2.6 s |
| ✅ | booking-negative.spec.ts | DELETE without a token is forbidden, and the booking is not removed | 1.7 s |
| ✅ | booking-negative.spec.ts | POST rejects empty body | 2.5 s |
| ✅ | booking-negative.spec.ts | POST rejects missing last name | 0.7 s |
| ✅ | booking.spec.ts | creates booking with breakfast @smoke | 1.4 s |
| ✅ | booking.spec.ts | creates booking without deposit @smoke | 1.4 s |
| ✅ | booking.spec.ts | creates booking with zero price @smoke | 1.4 s |
| ✅ | booking.spec.ts | lists booking ids @smoke | 0.9 s |
| ✅ | booking.spec.ts | returns a booking that matches the schema | 1.4 s |
| ✅ | booking.spec.ts | filters bookings by first name | 1.4 s |
| ✅ | booking.spec.ts | filters bookings by last name | 2.4 s |
| ✅ | booking.spec.ts | full update replaces every field | 1.4 s |
| ✅ | booking.spec.ts | partial update: change names | 1.4 s |
| ✅ | booking.spec.ts | partial update: change price and deposit | 1.4 s |
| ✅ | booking.spec.ts | partial update: change dates | 2.1 s |
| ✅ | booking.spec.ts | deletes a booking and it can no longer be read @smoke | 1.6 s |

The interactive HTML report is in [`html/`](html/index.html). Clone the repo and open `reports/api/html/index.html` in a browser.
