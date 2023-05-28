import { sql } from '../database/database.js';

const create = async (dits) => {
  await sql`INSERT INTO messages (sender, message) VALUES (${dits.sender},${dits.msg})`;
};

const findLastFive = async () => {
  const msgs = await sql`SELECT *
  FROM messages
  ORDER BY id DESC
  LIMIT 5`;
  return msgs;
};

const deleteById = async (id) => {
  await sql`DELETE FROM songs WHERE id = ${id}`;
};

export { create, findLastFive, deleteById };
