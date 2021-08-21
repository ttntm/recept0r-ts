const faunadb = require('faunadb')
const fnHeaders = require('../_shared/headers.js')

module.exports = (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET,
    domain: 'db.us.fauna.com'
  })
  const q = faunadb.query

  const { user } = event

  console.log("Function 'readUser' invoked")

  if (!user) {
    return { statusCode: 400, headers: { ...fnHeaders }, body: 'Bad Request' }
  } else {
    return client.query(q.Paginate(q.Match(q.Index('recipes_user'), `${user}`), { size: 500 }))
      .then((response) => {
        const listRefs = response.data
        console.log(`${listRefs.length} entries found`)
        // create new query out of list refs. http://bit.ly/2LG3MLg
        const getListDataQuery = listRefs.map(ref => q.Get(ref))
        // then query the refs
        return client.query(getListDataQuery).then((records) => {
          return { statusCode: 200, headers: { ...fnHeaders }, body: JSON.stringify(records) }
        })
      })
      .catch((error) => {
        console.log('error', error)
        return { statusCode: 400, headers: { ...fnHeaders }, body: JSON.stringify(error) }
      })
  }
}