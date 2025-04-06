## About

This is the 2021 version of recept0r, a minimal open source recipes app.

Re-written from scratch using Vue 3 with TypeScript.

A little background info in an article I wrote: [How I Built a Serverless Recipes App with FaunaDB and Vue.js](https://ttntm.me/blog/serverless-recipes-app-faunadb-vuejs/) (a little outdated in terms of the code samples, but the app's architecture is still the same)

**IMPORTANT: Fauna EoL'd their database service, and shuts down on May 30, 2025.**

In response to that, this application has moved to supabase.

## Deployment

If you'd like to fork this repository and deploy your own recipes app:

1. Sign up @ Cloudinary, Netlify, and supabase
2. Create a new database and a table called `recipes` in supabase
    - Refer to everything in `./functions` to see what's required or get in touch
3. Configure necessary environment variables
    - `SPB_API_KEY`: supabase API key (Project > Data API > `service_role`)
    - `SPB_TABLE`: name of your supabase table (i.e. `recipes`)
    - `SPB_URL`: your supabase Project URL
    - `VITE_APP_API`: something like `/.netlify/functions/api`
    - `VITE_APP_CDNRY`: something like `https://api.cloudinary.com/v1_1/USERNAME/image/upload`
    - `VITE_APP_CDNRY_UPRESET`: a short ID generated in Cloudinary
    - `VITE_APP_IDENTITY`: an absolute URL to your site's identity endpoint like `https://your.domain/.netlify/identity`
    - `VITE_APP_READ`: path to the public "read" function `/.netlify/functions/read`
    - `VITE_APP_READALL`: path to the public "readAll" function `/.netlify/functions/read-all`
4. Build and deploy your instance

### User Accounts

**Public=anonymous user signup is disabled by default.**

If you want to enable that, you've got to import and use the `AuthSignup` component in `./src/components/conditional/Auth.vue`.

NB: invite processing and pwd reset are not working atm - the needed routes/views are missing.

Regarding Netlify: any serverless "back end" code (functions) can probably run elsewhere without bigger changes, but re-building the whole user management (Netlify Identity) might end up being a major change.

## Documentation

- Backups: [docs/backups](./docs/backups.md)
- Data Model: [docs/data-model](./docs/data-model.md)

## Contribute

All future development of this project has moved to Codeberg:

[![Contribute on Codeberg](/public/img/contribute_on_codeberg.png)](https://codeberg.org/ttntm/recept0r)

Commits are mirrored to GitHub, this project still utilizes GH > Netlify CI/CD for the time being.
