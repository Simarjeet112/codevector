const { Pool, types } = require('pg');

// Postgres TIMESTAMPTZ has microsecond precision, but pg's default conversion
// to JS Date truncates to millisecond precision. Since our cursor depends on
// exact created_at equality/ordering for tie-breaking with id, we keep the raw
// string instead of letting pg convert it to a Date (which would lose precision
// and silently corrupt keyset pagination across rows that share a timestamp).
types.setTypeParser(1184, (val) => val); // 1184 = OID for timestamptz

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getProducts({ category, cursor, limit = 50 }) {
  const conditions = [];
  const values = [];

  if (category) {
    values.push(category);
    conditions.push(`category = $${values.length}`);
  }

  if (cursor) {
    values.push(cursor.createdAt, cursor.id);
    conditions.push(`(created_at, id) < ($${values.length - 1}, $${values.length})`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  values.push(limit);

  const sql = `
    SELECT id, name, category, price, created_at, updated_at
    FROM products
    ${whereClause}
    ORDER BY created_at DESC, id DESC
    LIMIT $${values.length}
  `;

  const { rows } = await pool.query(sql, values);
  return rows;
}

module.exports = { getProducts, pool };