const api = require('./api-methods');
const fnHeaders = require('./_shared/headers.js');

// get the last element from the URL, i.e. example.com/last => 'last'
const getPath = (urlPath) => urlPath.match(/([^\/]*)\/*$/)[0]

// get the last 2 elements from the URL, i.e. example.com/one/two => [one,two]
const getMethodPath = (urlPath) => urlPath.match(/\w+\/([^\/]*)\/*$/)[0].split('/')

const pathError = { statusCode: 500, headers: { ...fnHeaders }, body: 'No path specified' };

exports.handler = async (event, context) => {
  const claims = context.clientContext && context.clientContext.user;

  if (!claims) {
    return { statusCode: 401, headers: { ...fnHeaders }, body: 'NOT ALLOWED' }
  } else {
    const target = getPath(event.path);
    if (target) event.target = target;

    switch (event.httpMethod) {
      case 'GET':
        // need to handle 'get all' and 'get one' differently here
        if (target === 'all-recipes') {
          return api.readAll(event, context)
        } else {
          const [tgt, usr] = getMethodPath(event.path)

          if (tgt === 'author' && usr) {
            event.target = tgt // target = sub-path for method distinction
            event.user = usr // user id for the DB index
            return api.readUser(event, context)
          } else {
            // target = recipe refId
            return event.target ? api.read(event, context) : pathError
          }
        }

      case 'POST':
        // target = listname
        return api.create(event, context)

      case 'PUT':
        // target = recipe refId
        return event.target ? api.update(event, context) : pathError

      case 'DELETE':
        // target = recipe refId
        return event.target ? api.delete(event, context) : pathError

      default:
        return {
          statusCode: 500,
          headers: { ...fnHeaders },
          body: 'Unrecognized HTTP Method, must be one of GET/POST/PUT/DELETE'
        }
    }
  }
}