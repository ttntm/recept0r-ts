# Database Data Model

This application is currently using Fauna for data storage.

## Collections

Collections hold documents, they're Fauna's equivalent of tables.

Fauna documentation: 

- https://docs.fauna.com/fauna/current/learn/understanding/collections
- https://docs.fauna.com/fauna/current/learn/understanding/documents?lang=javascript

### Remarks

`image` -> path to an image uploaded to Cloudinary

`ref['@ref'].id` -> unique ID for Fauna records

`user` -> GUID obtained from Netlify Identity via [gotrue-js](https://github.com/netlify/gotrue-js)

### Recipes

This collection stores the recipes.

These records are typed as `RecipeDB` and `Recipe` in [types.d.ts](/src/types.d.ts).

```json
{
  "ref": {
    "@ref": {
      "id": "332732439322427459",
      "collection": {
        "@ref": {
          "id": "recipes",
          "collection": {
            "@ref": {
              "id": "collections"
            }
          }
        }
      }
    }
  },
  "ts": 1653578745010000,
  "data": {
    "id": "sweet-apple-slices",
    "draft": false,
    "title": "Sweet Apple Slices",
    "category": "Dessert",
    "description": "A simple but delicious dessert",
    "diet": "Vegetarian",
    "duration": "30 min",
    "image": "https://res.cloudinary.com/ttntm/image/upload/v1653578590/recept0r/iup1tahggvajx4bym5vc.webp",
    "ingredients": [
      "2 apples",
      "Juice of 1 lemon",
      "etc"
    ],
    "owner": "d77da4db-ecbe-48be-beda-169f9716ec86",
    "portions": "4 portions",
    "body": "HTML recipe body"
  }
}
```