require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const CATEGORIES = ['Electronics', 'Furniture', 'Toys', 'Clothing', 'Books', 'Sports'];
const TOTAL_ROWS = 200000;
const BATCH_SIZE = 1000;

function randomProduct() {
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const name = `Product ${Math.floor(Math.random() * 1000000)}`;
  const price = (Math.random() * 1000).toFixed(2);
  return { name, category, price };
}

function buildInsertQuery(rows) {
  const columnsPerRow = 3;
  const values = [];
  const placeholders = rows.map((row, i) => {
    const base = i * columnsPerRow;
    values.push(row.name, row.category, row.price);
    return `($${base + 1}, $${base + 2}, $${base + 3})`;
  });

  const sql = `INSERT INTO products (name, category, price) VALUES ${placeholders.join(', ')}`;
  return { sql, values };
}

async function insertBatch(rows) {
  const { sql, values } = buildInsertQuery(rows);
  await pool.query(sql, values);
}

async function seed() {
  const start = Date.now();
  for (let i = 0; i < TOTAL_ROWS; i += BATCH_SIZE) {
    const batch = Array.from({ length: BATCH_SIZE }, randomProduct);
    await insertBatch(batch);
    if ((i / BATCH_SIZE) % 20 === 0) {
      console.log(`Inserted ${i + BATCH_SIZE} / ${TOTAL_ROWS}`);
    }
  }
  console.log(`Done in ${(Date.now() - start) / 1000}s`);
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});