const { Client } = require('pg')

const client = new Client(
  process.env.NODE_ENV === 'production'
    ? { database: 'theaulait', connectionString: process.env.DATABASE_URL, ssl: true }
    : { database: 'thelotest' }
)

const run = async () => {
  await client.connect()

  await client.query(`
    UPDATE Cosmetic
    SET memberid = NULL, available = false
  `)

  await client.query(`
    UPDATE COSMETIC
    SET available = true
    WHERE id IN (SELECT id
      FROM Cosmetic
      ORDER BY random()
      LIMIT 5)
  `)

  client.end()
}

run()