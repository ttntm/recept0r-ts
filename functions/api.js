const api = require('./api-methods')
const fnHeaders = require('./_shared/headers.js')

// get the last element from the URL, i.e. example.com/last => 'last'
const getPath = (urlPath) => urlPath.match(/([^\/]*)\/*$/)[0]

// get the last 2 elements from the URL, i.e. example.com/one/two => [one,two]
const getMethodPath = (urlPath) => urlPath.match(/\w+\/([^\/]*)\/*$/)[0].split('/')

const pathError = {
  statusCode: 500,
  headers: { ...fnHeaders },
  body: 'No path specified'
}

exports.handler = async (event, context) => {
  const claims = context.clientContext && context.clientContext.user

  if (!claims) {
    return {
      statusCode: 401,
      headers: { ...fnHeaders },
      body: 'NOT ALLOWED'
    }
  }

  const target = getPath(event.path)

  if (target) {
    event.target = target
  }

  switch (event.httpMethod) {
    case 'GET':
      // only used for getting user specific recipes - single read has to be public
      const [tgt, usr] = getMethodPath(event.path)

      if (tgt !== 'owner' || !usr) {
        return pathError
      }

      event.target = tgt // target = sub-path for method distinction
      event.user = usr // user id for the DB index

      return api.readUser(event, context)

    case 'POST':
      return api.create(event, context)

    case 'PUT':
      // target = recipe id
      return event.target
        ? api.update(event, context)
        : pathError

    case 'DELETE':
      // target = recipe id
      return event.target
        ? api.delete(event, context)
        : pathError

    default:
      return {
        statusCode: 500,
        headers: { ...fnHeaders },
        body: 'Unrecognized HTTP Method, must be one of GET/POST/PUT/DELETE'
      }
  }
}
