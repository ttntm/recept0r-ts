const faunadb = require('faunadb')
const fnHeaders = require('../_shared/headers.js')

module.exports = (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
    domain: 'db.us.fauna.com'
  })
  const q = faunadb.query

  const { body, target } = event
  const data = JSON.parse(body)  // don't do this inline @ the `q.Update` call!

  console.log(`Function 'update' invoked. update id: ${target}`)

  if (!data || !target) {
    return { statusCode: 400, headers: { ...fnHeaders }, body: 'Bad Request' }
  } else {
    return client.query(q.Update(q.Ref(`collections/recipes/${target}`), { data }))
      .then((response) => {
        console.log("success", response)
        return { statusCode: 200, headers: { ...fnHeaders }, body: JSON.stringify(response) }
      }).catch((error) => {
        console.log("error", error)
        return { statusCode: 400, headers: { ...fnHeaders }, body: JSON.stringify(error) }
      })
  }
}