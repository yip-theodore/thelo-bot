const { Pool } = require('pg')

const pool = new Pool(
  process.env.NODE_ENV === 'production'
    ? { database: 'theaulait', connectionString: process.env.DATABASE_URL, ssl: true }
    : { database: 'thelotest' }
)

class Member {
  
  async count () {
    const { rows: [ { count } ] } = await pool.query(`
      SELECT count(*) FROM member
    `)
    return +count
  }

  async insertAll (members) {
    const data = await pool.query(`
      INSERT INTO Member (id, username)
      VALUES ${
        members.map(({ id, username }) =>
          '(' + id + ', \'' + username + '\')'
        ).join(', ')
      }
    `)
    console.log('insertAll', data)
  }

  async insert (id, username) {
    const { rows: [ member ] } = await pool.query(`
      INSERT INTO Member (id, username)
      VALUES ($1, $2)
      RETURNING *
    `, [id, username])
    return member
  }

  async get (id) {
    const { rows: [ member ] } = await pool.query(`
      SELECT m.*, c.emoji
      FROM Member AS m
      LEFT JOIN Cosmetic AS c ON m.id = c.memberid  
      WHERE m.id = $1
    `, [id])
    return member
  }

  setMoney (id, money) {
    return pool.query(`
      UPDATE member
      SET money = $2
      WHERE id = $1
    `, [id, money])
  }

  async getTop10 () {
    const { rows } = await pool.query(`
      SELECT * FROM Member
      ORDER BY money DESC LIMIT 10
    `)
    return rows
  }

  async getCosmetics () {
    const { rows } = await pool.query(`
      SELECT emoji
      FROM Cosmetic
      WHERE memberid IS NULL AND available
    `)
    return rows.map(({ emoji }) => emoji)
  }

  async buyCosmetic (id, cosmetic) {
    const { rowCount } = await pool.query(`
      UPDATE Cosmetic
      SET memberid = $1
      WHERE emoji = $2 AND memberid IS NULL
    `, [id, cosmetic])
    return rowCount
  }

}

exports.member = new Member()
