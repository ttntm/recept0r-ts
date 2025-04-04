const fields = require('../_shared/fields.js')
const fnHeaders = require('../_shared/headers.js')
const spb = require('@supabase/supabase-js')

module.exports = async (event, context) => {
  console.log("Function 'readUser' invoked")

  const headers = { ...fnHeaders }
  const origin = event.headers.Origin || event.headers.origin
  const supabase = spb.createClient(process.env.SPB_URL, process.env.SPB_API_KEY)
  const { user } = event

  headers['Access-Control-Allow-Origin'] = origin ? origin : '*'

  if (!user) {
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
        .eq('owner', user)
        .order('updated', { ascending: false })

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
