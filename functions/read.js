const faunadb = require('faunadb')
const fnHeaders = require('./_shared/headers.js')

// get the last element from the URL, i.e. example.com/last => 'last'
const getPath = (urlPath) => urlPath.match(/([^\/]*)\/*$/)[0]

exports.handler = (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
    domain: 'db.us.fauna.com'
  })
  const q = faunadb.query
  
  const target = getPath(event.path)
  
  console.log(`Function 'read' invoked. Read id: ${target}`)

  const headers = { ...fnHeaders }
  const origin = event.headers.Origin || event.headers.origin
  headers['Access-Control-Allow-Origin'] = origin ? origin : '*'

  if (!target) {
    return { statusCode: 400, headers: headers, body: 'Bad Request' }
  } else {
    return client.query(q.Get(q.Ref(`collections/recipes/${target}`)))
      .then((response) => {
        console.log('success', response)
        return { statusCode: 200, headers: headers, body: JSON.stringify(response) }
      })
      .catch((error) => {
        console.log('error', error)
        return { statusCode: 400, headers: headers, body: JSON.stringify(error) }
      })
  }
}
