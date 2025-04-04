const fields = require('./_shared/fields.js')
const fnHeaders = require('./_shared/headers.js')
const spb = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  console.log("Function 'readAll' invoked")

  const headers = { ...fnHeaders }
  const origin = event.headers.Origin || event.headers.origin
  const supabase = spb.createClient(process.env.SPB_URL, process.env.SPB_API_KEY)

  headers['Access-Control-Allow-Origin'] = origin ? origin : '*'

  try {
    const { data, error } = await supabase
      .from(process.env.SPB_TABLE)
      .select(fields.recipe_full)
      .eq('status', 'published')
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
