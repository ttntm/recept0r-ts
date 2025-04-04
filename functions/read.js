const fields = require('./_shared/fields.js')
const fnHeaders = require('./_shared/headers.js')
const spb = require('@supabase/supabase-js')

// get the last element from the URL, i.e. example.com/last => 'last'
const getPath = (urlPath) => urlPath.match(/([^\/]*)\/*$/)[0]

exports.handler = async (event, context) => {
  console.log(`Function 'read' invoked. Read id: ${target}`)

  const headers = { ...fnHeaders }
  const origin = event.headers.Origin || event.headers.origin
  const supabase = spb.createClient(process.env.SPB_URL, process.env.SPB_API_KEY)
  const target = getPath(event.path)

  headers['Access-Control-Allow-Origin'] = origin ? origin : '*'

  if (!target) {
    return {
      statusCode: 400,
      headers: headers,
      body: 'Bad Request'
    }
  } else {
    try {
      const { data, error } = await supabase
        .from(process.env.SPB_TABLE)
        .select(fields.recipe_full)
        .eq('id', target)

      if (error) {
        throw JSON.stringify(error)
      }

      return {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(data)
      }
    } catch (ex) {
      console.log('error', ex)

      return {
        statusCode: 400,
        headers: headers,
        body: typeof ex === 'string'
          ? ex
          : JSON.stringify(ex)
      }
    }
  }
}
