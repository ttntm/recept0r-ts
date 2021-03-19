# About recept0r

If you're into cooking, you may find some inspiration here 😁

recept0r is a minimal recipes app based on vue.js and Fauna DB. It's a serverless web application making use of Netlify functions to handle all backend functionality like  database access and user authentication.

At the moment, recept0r is a semi-public personal service. That means, that even though public signup is technically possible, it's currently disabled in favor of an invite only signup process.

## Credits

**Design**: Sahar Heumesser | [website](https://sahar.design)

**Code**: ttntm | [website](https://ttntm.me)

## Tech Stack

recept0r is built based on these tools:

- faunadb
- gotrue-js (Netlify identity)
- tailwindcss
- tiptap Editor
- vue
- vue-router
- vuex

The exact specifications can be found in `package.json` at [GitHub](https://github.com/ttntm/recept0r/blob/master/package.json)

Large parts of the user signup and authentication process are based on this project: [vue-netlify-fauna-starter-kit](https://github.com/chiubaca/vue-netlify-fauna-starter-kit)