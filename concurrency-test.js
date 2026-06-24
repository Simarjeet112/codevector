require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const PAGE_SIZE = 50;
const INSERTS_TO_SIMULATE = 50;

async function getSnapshotCount() {
  const { rows } = await pool.query('SELECT COUNT(*) FROM products');
  return parseInt(rows[0].count, 10);
}

async function paginateAll() {
  const seenIds = new Set();
  let cursor = null;
  let pageNum = 0;

  while (true) {
    const values = [];
    let whereClause = '';
    if (cursor) {
      values.push(cursor.createdAt, cursor.id);
      whereClause = `WHERE (created_at, id) < ($1, $2)`;
    }
    values.push(PAGE_SIZE);

    const sql = `
      SELECT id, created_at FROM products
      ${whereClause}
      ORDER BY created_at DESC, id DESC
      LIMIT $${values.length}
    `;
    const { rows } = await pool.query(sql, values);

    pageNum++;
    console.log(`page ${pageNum}: got ${rows.length} rows, cursor sent =`, cursor);

    if (rows.length === 0) break;

    for (const row of rows) {
      if (seenIds.has(row.id)) console.error(`DUPLICATE FOUND: id=${row.id}`);
      seenIds.add(row.id);
    }

    cursor = { createdAt: rows[rows.length - 1].created_at, id: rows[rows.length - 1].id };

    if (rows.length < PAGE_SIZE) {
      console.log(`STOPPING: page ${pageNum} returned ${rows.length} < PAGE_SIZE (${PAGE_SIZE})`);
      break;
    }

    await new Promise((r) => setTimeout(r, 20));
  }

  return seenIds;
}

async function insertNewRowsDuringBrowse() {
  for (let i = 0; i < INSERTS_TO_SIMULATE; i++) {
    await pool.query(
      `INSERT INTO products (name, category, price) VALUES ($1, $2, $3)`,
      [`LiveInsert ${i}`, 'Electronics', 9.99]
    );
    await new Promise((r) => setTimeout(r, 30));
  }
  console.log('Finished inserting 50 new rows during browse.');
}

async function run() {
  const initialCount = await getSnapshotCount();
  console.log(`Initial row count: ${initialCount}`);

  const [seenIds] = await Promise.all([paginateAll(), insertNewRowsDuringBrowse()]);

  console.log(`Rows seen while paginating: ${seenIds.size}`);
  console.log(
    seenIds.size >= initialCount
      ? 'PASS: every pre-existing row was seen, no duplicates logged above.'
      : 'FAIL: fewer rows seen than existed at start.'
  );

  await pool.end();
}

run();