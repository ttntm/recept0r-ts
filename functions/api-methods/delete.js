const faunadb = require('faunadb')
const fnHeaders = require('../_shared/headers.js')

module.exports = (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
    domain: 'db.us.fauna.com'
  })
  const q = faunadb.query

  const { target } = event

  console.log(`Function 'delete' invoked. delete id: ${target}`)

  if (!target) {
    return { statusCode: 400, body: 'Bad Request' }
  } else {
    return client.query(q.Delete(q.Ref(`collections/recipes/${target}`)))
      .then((response) => {
        console.log('success', response)
        return { statusCode: 200, headers: { ...fnHeaders },body: JSON.stringify(response) }
      })
      .catch((error) => {
        console.log('error', error)
        return { statusCode: 400, headers: { ...fnHeaders }, body: JSON.stringify(error) }
      })
  }
}