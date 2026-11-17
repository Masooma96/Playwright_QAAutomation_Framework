# QA Automation Framework: UI + API

![QA Automation Pipeline](https://github.com/Masooma96/Playwright_QAAutomation_Framework/actions/workflows/playwright.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A test automation framework built with **Playwright** and **TypeScript**. It covers two layers of a product:

- **UI tests** for [SauceDemo](https://www.saucedemo.com/), an e-commerce demo site: login, logout, sorting, cart and checkout.
- **API tests** for [JSONPlaceholder](https://jsonplaceholder.typicode.com/) and [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html), public practice APIs: REST methods, filters, schema validation, authentication, negative and security checks.

It shows how I structure a maintainable test suite: page objects, API clients, data-driven tests, fixtures, contract testing, flaky-test controls and a CI pipeline.

**[See the latest pipeline runs](https://github.com/Masooma96/Playwright_QAAutomation_Framework/actions)**. The HTML report is attached to each run as an artifact.

---

## What this framework demonstrates

| Concept                                                    | Where to look                                                                                                                    |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Page Object Model (UI)                                     | [`tests/ui/pages/`](tests/ui/pages)                                                                                              |
| API client layer (the API version of POM)                  | [`tests/api/clients/`](tests/api/clients)                                                                                        |
| Data-driven testing, with no hardcoded values in tests     | `data/` folders in [`tests/ui`](tests/ui/data) and [`tests/api`](tests/api/data)                                                 |
| Custom fixtures, setup and teardown                        | `fixtures/` in [`tests/ui`](tests/ui/fixtures) and [`tests/api`](tests/api/fixtures)                                             |
| Contract testing with JSON Schema                          | [`tests/api/data/*/schemas`](tests/api/data), [`schema.ts`](tests/api/utils/schema.ts)                                           |
| End-to-end API flow (create, read, update, delete, verify) | [`tests/api/specs/restful-booker/booking-flow.spec.ts`](tests/api/specs/restful-booker/booking-flow.spec.ts)                     |
| Positive, negative and security tests                      | tagged `@negative`                                                                                                               |
| Flaky-test controls                                        | [Flaky test strategy](#flaky-test-strategy)                                                                                      |
| Code quality gate                                          | ESLint, Prettier and TypeScript, run first in CI                                                                                 |
| CI/CD                                                      | [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml): quality gate, full regression, nightly cross-browser run |

---

## Tech stack

| Area             | Choice                                                   |
| ---------------- | -------------------------------------------------------- |
| Test runner      | Playwright Test                                          |
| Language         | TypeScript (strict mode)                                 |
| UI pattern       | Page Object Model with a shared `BasePage`               |
| API pattern      | Client classes built on Playwright's `APIRequestContext` |
| Contract testing | Ajv (JSON Schema)                                        |
| Test data        | JSON files                                               |
| Code quality     | ESLint (with `eslint-plugin-playwright`) and Prettier    |
| CI/CD            | GitHub Actions                                           |

---

## Project structure

```
.
├── tests/
│   ├── ui/                         # everything for the UI layer (SauceDemo)
│   │   ├── specs/                  # login, sorting, cart, checkout
│   │   ├── pages/                  # page objects (Base, Login, Inventory, Cart, Checkout...)
│   │   ├── fixtures/               # page fixtures and the logged-in session
│   │   ├── data/                   # JSON test data: users, login, products, sorting, cart, checkout, routes
│   │   └── utils/                  # catalog and calculation helpers
│   └── api/                        # everything for the API layer
│       ├── specs/
│       │   ├── jsonplaceholder/    # collections, single, filters, nested, CRUD
│       │   └── restful-booker/     # auth, CRUD, negative, end-to-end flow
│       ├── clients/                # API clients, retry helper, types
│       ├── fixtures/               # client fixtures, auth token, auto-cleanup booking
│       ├── data/                   # JSON test data and JSON schemas per service
│       └── utils/                  # JSON-schema validator
├── .github/workflows/              # CI pipeline
└── playwright.config.ts            # projects: UI browsers and the two API suites
```

---

## How it works

### UI: Page Object Model and data-driven tests

Each page of the site is a class holding its locators and actions. Page URLs and titles come from [`tests/ui/data/pages.json`](tests/ui/data/pages.json), and every page can check itself with `expectLoaded()`. A test reads like a description of what a user does:

```ts
await loginPage.open();
await loginPage.login(user.username, user.password);
await inventoryPage.expectLoaded();
```

Each row in a JSON file becomes its own test. To add a login case, add one row to [`tests/ui/data/login.json`](tests/ui/data/login.json) and write no code.

### API: client layer, schemas and data

A client class wraps each endpoint, so tests never build URLs or headers:

```ts
const response = await api.get('/posts', { userId: '1' });
expect(response.status()).toBe(status.ok);
```

Responses are checked for the status code, response time, JSON content type and **JSON Schema**, so a changed or missing field fails the test:

```ts
expect(validateSchema('post', item)).toEqual([]);
```

### Fixtures: setup and teardown

`createdBooking` creates a booking before a test and deletes it afterwards, so every test is independent and leaves no data behind. `loggedInInventory` gives a UI test an already logged-in session.

---

## Flaky test strategy

A flaky test passes and fails without a code change. These tests depend on live public websites, so I handle flakiness on purpose and never hide it:

| Control                           | How it works                                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Independent tests**             | Each test creates and cleans up its own data, so tests never depend on each other or on run order.                                                            |
| **Auto-waiting, no fixed sleeps** | Playwright web-first assertions wait for the page. There is no `waitForTimeout` anywhere.                                                                     |
| **Explicit timeouts**             | Assertions wait up to 10s, actions 10s, navigation 30s. Slow enough for public sites, fast enough to fail clearly.                                            |
| **Retries in CI only**            | Failing tests are retried twice in CI. A test that fails and then passes is reported as **flaky** in the run, not as green, and its trace is kept.            |
| **Safe API retries**              | Read-only GET calls retry on network errors, 5xx and 429, with backoff ([`retry.ts`](tests/api/clients/retry.ts)). A 4xx result is real and is never retried. |
| **Diagnostics**                   | Trace on retry, screenshot and video on failure, and GitHub annotations in CI.                                                                                |
| **Stability check**               | A nightly job runs the whole suite 5 times without retries (`npm run test:stability`) to expose flaky tests before they spread.                               |
| **Quarantine**                    | A test that proves flaky gets the `@quarantine` tag. CI skips it, so it stops blocking the team, and it stays visible until it is fixed.                      |

---

## Test coverage

| Layer | Suite            | Tests | What is checked                                                                                                        |
| ----- | ---------------- | ----- | ---------------------------------------------------------------------------------------------------------------------- |
| UI    | Login and logout | 5     | 1 valid user logs in, 3 invalid users get the expected error, the valid user logs out                                  |
| UI    | Product sorting  | 5     | Full catalog, name A-Z / Z-A, price low-high / high-low                                                                |
| UI    | Cart             | 6     | Add 1, 2 or all products, remove from the inventory page and from the cart page                                        |
| UI    | Checkout         | 6     | Missing-field errors, full orders with item total, tax and total calculated from the catalog, confirmation message     |
| API   | JSONPlaceholder  | 28    | 5 collections with schema checks, single resources, query filters, nested resources, 404s, POST / PUT / PATCH / DELETE |
| API   | Restful-Booker   | 23    | Authentication, full CRUD, schema validation, filters, missing token (403), invalid payloads, end-to-end lifecycle     |

The UI tests use one valid user, `standard_user`. The data is in [`tests/ui/data/login.json`](tests/ui/data/login.json).

---

## Getting started

```bash
git clone https://github.com/Masooma96/Playwright_QAAutomation_Framework.git
cd Playwright_QAAutomation_Framework
npm install
npx playwright install
```

## Running tests

```bash
npm test                    # everything: UI + both API suites
npm run test:ui             # all 22 UI tests in Chrome (login, sorting, cart, checkout)
npm run test:ui:headed      # UI tests with the browser visible
npm run test:api            # both API suites
npm run test:api:jsonplaceholder
npm run test:api:booker
npm run test:ci             # what CI runs (same as npm test)
npm run test:smoke          # only @smoke tests
npm run test:negative       # only @negative tests
npm run test:cross-browser  # UI tests in Chromium, Firefox and WebKit
npm run test:stability      # whole suite x5, to detect flaky tests
npm run lint                # ESLint
npm run format              # Prettier
npm run typecheck           # TypeScript check
npm run report              # open the last HTML report
```

Point the suites at another environment with `BASE_URL`, `API_BASE_URL` or `BOOKER_BASE_URL` (see [`.env.example`](.env.example)).

---

## Known limitations

- The tests run against **public demo sites**, so a slow or unavailable site can fail a run. The flaky-test controls above reduce this but cannot remove it.
- **JSONPlaceholder fakes write operations.** It answers POST, PUT, PATCH and DELETE like a real API but stores nothing, so those tests check the response contract and not saved data. The Restful-Booker tests do check real persistence.
- Public sites can change without notice. The tests would then need their data or locators updated in one place: a page object, an API client or a JSON file.

---

## Author

**Masooma Fatima**, QA Automation Engineer

Released under the [MIT license](LICENSE).
