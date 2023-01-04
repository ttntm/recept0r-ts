const fetch = require('node-fetch')

const fnHeaders = {
  'Content-Type': 'text/xml'
}
const readAll = process.env.VITE_APP_READALL
const site = 'https://recept0r.com'
const sitemapTemplate = {
  start: `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  mid: `<url>
    <loc>${site}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url><url>
    <loc>${site}/about</loc>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`,
  end: `</urlset>`
}

exports.handler = async (event, context) => {
  console.log("Function 'sitemap' invoked")

  try {
    const rRequest = await fetch(`${site}${readAll}`, { method: 'GET' })

    let rResponse = await rRequest.json()

    if (rResponse && rResponse.length > 0) {
      rResponse.forEach(el => {
        const itemURL = `${site}/recipe/${el.data.id}/${el.ref['@ref'].id}`
        
        sitemapTemplate.mid += `<url>
          <loc>${itemURL}</loc>
          <changefreq>yearly</changefreq>
          <priority>0.7</priority>
        </url>`
      })
    }

    let sitemapXML = `${sitemapTemplate.start}${sitemapTemplate.mid}${sitemapTemplate.end}`

    return {
      statusCode: 200,
      headers: fnHeaders,
      body: sitemapXML
    }
  } catch (error) {
    console.log('error', error)
    
    return {
      statusCode: 400,
      headers: fnHeaders,
      body: JSON.stringify(error)
    }
  }
}