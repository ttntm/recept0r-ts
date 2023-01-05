const fetch = require('node-fetch')
const jsonHeaders = require('./_shared/headers.js')

const xmlHeaders = {
  'Content-Type': 'text/xml',
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Frame-Options': 'DENY'
}
const readAll = process.env.VITE_APP_READALL
const site = 'https://recept0r.com'

const initSitemap = () => {
  return {
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
}

exports.handler = async (event, context) => {
  console.log("Function 'sitemap' invoked")

  const sitemap = initSitemap()

  try {
    console.log('Fetching database content')

    const rRequest = await fetch(`${site}${readAll}`, { method: 'GET' })
    let rResponse = await rRequest.json()

    // Process dynamic content from the db (if there is any)
    if (rResponse && rResponse.length > 0) {
      console.log('Processing database content')
      
      // Processing type RecipeDB[] here; see: ./src/types.d.ts
      rResponse.forEach(el => {
        const itemURL = `${site}/recipe/${el.data.id}/${el.ref['@ref'].id}`
        
        sitemap.mid += `<url>
          <loc>${itemURL}</loc>
          <changefreq>yearly</changefreq>
          <priority>0.7</priority>
        </url>`
      })
    } else {
      console.log('No database content received')
    }
  } catch (error) {
    console.log('Error building sitemap: ', error)
    
    return {
      statusCode: 400,
      headers: jsonHeaders,
      body: JSON.stringify(error)
    }
  } finally {
    const sitemapFinal = `${sitemap.start}${sitemap.mid}${sitemap.end}`
    
    console.log('Sitemap complete: ', sitemapFinal)

    return {
      statusCode: 200,
      headers: xmlHeaders,
      body: sitemapFinal
    }
  }
}