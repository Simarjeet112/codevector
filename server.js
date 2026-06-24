require('dotenv').config();
const express = require('express');
const { getProducts } = require('./db/queries');

const app = express();

function encodeCursor(row) {
  const payload = JSON.stringify({ createdAt: row.created_at, id: row.id });
  return Buffer.from(payload).toString('base64');
}

function decodeCursor(token) {
  try {
    const json = Buffer.from(token, 'base64').toString('utf-8');
    const { createdAt, id } = JSON.parse(json);
    return { createdAt, id };
  } catch {
    return null;
  }
}

app.get('/products', async (req, res) => {
  const { category, cursor: cursorToken, limit } = req.query;

  const cursor = cursorToken ? decodeCursor(cursorToken) : null;
  if (cursorToken && !cursor) {
    return res.status(400).json({ error: 'Invalid cursor' });
  }

  const parsedLimit = Math.min(parseInt(limit, 10) || 50, 100);

  try {
    const rows = await getProducts({ category, cursor, limit: parsedLimit });
    const nextCursor = rows.length === parsedLimit ? encodeCursor(rows[rows.length - 1]) : null;

    res.json({ data: rows, next_cursor: nextCursor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(3000, () => console.log('Listening on port 3000'));