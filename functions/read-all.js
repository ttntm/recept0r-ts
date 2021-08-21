const faunadb = require('faunadb')
const fnHeaders = require('./_shared/headers.js')

module.exports = (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
    domain: 'db.us.fauna.com'
  })
  const q = faunadb.query

  console.log("Function 'readAll' invoked")

  const headers = { ...fnHeaders }
  const origin = event.headers.Origin || event.headers.origin
  headers['Access-Control-Allow-Origin'] = origin ? origin : '*'

  return client.query(q.Paginate(q.Match(q.Index('all_recipes'), false), { size: 500 }))
    .then((response) => {
      const listRefs = response.data
      console.log(`${listRefs.length} entries found`)
      // create new query out of list refs. http://bit.ly/2LG3MLg
      const getListDataQuery = listRefs.map(ref => q.Get(ref))
      // then query the refs
      return client.query(getListDataQuery).then((records) => {
        return { statusCode: 200, headers: headers, body: JSON.stringify(records) }
      })
    }).catch((error) => {
      console.log('error', error)
      return { statusCode: 400, headers: headers, body: JSON.stringify(error) }
    })
}