const fields = require('./_shared/fields.js')
const fnHeaders = require('./_shared/headers.js')
const spb = require('@supabase/supabase-js')

function getTimestamp() {
  const d = new Date()
  return d.toISOString().split('T')[0].replaceAll('-', '')
}

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
      .order('updated', { ascending: false })

    if (error) {
      throw JSON.stringify(error)
    }

    if (data) {
      const now = getTimestamp()

      await supabase
        .storage
        .from('backup')
        .upload(
          `${now}_allRecipes.json`,
          JSON.stringify(data),
          { contentType: 'application/json' }
        )
    }

    return {
      statusCode: 200,
      headers: headers
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
