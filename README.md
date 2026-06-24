# Product Browser — Backend Take-Home

## Stack
- Node.js + Express
- PostgreSQL (local for dev, Neon for deployment)
- Raw SQL via `pg` — no ORM

## Why keyset (cursor) pagination instead of OFFSET/LIMIT
OFFSET/LIMIT requires Postgres to scan and discard all skipped rows on every request —
cost grows linearly with page depth. Keyset pagination instead remembers the last seen
`(created_at, id)` and asks for rows strictly before that point. Because there's a
composite index on `(created_at, id)`, Postgres can jump directly to that position in
the index and read forward — performance stays flat regardless of depth.

## Why (created_at, id), not created_at alone
created_at can collide (multiple rows inserted in the same millisecond, especially
under bulk seeding). id is unique and monotonically increasing (BIGSERIAL), so using
it as a tiebreaker guarantees every row has a unique position in the sort order —
no two rows ever tie completely.

## Indexes
- `idx_products_created_at_id` on `(created_at DESC, id DESC)` — serves unfiltered,
  newest-first pagination.
- `idx_products_category_created_at_id` on `(category, created_at DESC, id DESC)` —
  serves category-filtered pagination. category is first because it's an equality
  filter; equality-filtered columns must lead a composite index so Postgres can jump
  to a contiguous slice of the index.

Verified via EXPLAIN ANALYZE that both queries use Index Scan / Index Cond on the
relevant index, not a Seq Scan.

## Seeding
200,000 rows generated via `seed.js`, inserted in batches of 1,000 using multi-row
INSERT statements (not a row-by-row loop) — reduces 200,000 network round trips +
transaction commits down to 200, batching also keeps bound-parameter count under
Postgres's 65,535-per-query limit.

## Concurrency correctness
`concurrency-test.js` runs the real pagination logic while concurrently inserting 50
new rows, tracking every seen id in a Set and asserting no duplicates and no rows
missing from the original snapshot. New rows get a created_at newer than anything the
paginator has reached (since pagination moves backward in time), so they never land
in an already-passed page — and the strict `<` comparison means already-seen rows are
never re-included.

## API
`GET /products?category=<optional>&cursor=<optional>&limit=<optional, max 100>`
Returns `{ data: [...], next_cursor: <string|null> }`. next_cursor is null once the
last page is reached.

## What I'd improve with more time
- Use COPY instead of multi-row INSERT for even faster seeding at larger scale.
- Add stricter cursor validation (verify decoded createdAt is a real date).
- Add a simple HTML browsing UI.

## AI usage
Used Claude to learn the concepts (keyset pagination mechanics, composite index
design, bulk insert tradeoffs) before implementing. [Be honest here about exactly
what you understood vs what you'd still want to double check.]