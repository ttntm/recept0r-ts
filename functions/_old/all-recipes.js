const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = (event, context, callback) => {
  console.log('Function `all-recipes` invoked')
  return client
    .query(q.Paginate(q.Match(q.Ref('indexes/all_recipes'))))
    .then((response) => {
      const recipeRefs = response.data
      console.log('Recipe refs', recipeRefs)
      console.log(`${recipeRefs.length} recipes found`)
      // create new query out of recipe refs. http://bit.ly/2LG3MLg
      const getAllRecipeDataQuery = recipeRefs.map((ref) => {
        return q.Get(ref)
      })
      // then query the refs
      return client.query(getAllRecipeDataQuery).then((ret) => {
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify(ret)
        })
      })
    })
    .catch((error) => {
      console.log('error', error)
      return callback(null, {
        statusCode: 400,
        body: JSON.stringify(error)
      })
    })
}
