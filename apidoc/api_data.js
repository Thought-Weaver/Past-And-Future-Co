define({ "api": [
  {
    "type": "get",
    "url": "/admin",
    "title": "Admin Check",
    "name": "Admin",
    "group": "Auth",
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Auth",
    "sampleRequest": [
      {
        "url": "localhost:8000/admin"
      }
    ]
  },
  {
    "type": "post",
    "url": "/login",
    "title": "Login",
    "name": "Login",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The person's username.</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>The persons' password.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Auth",
    "sampleRequest": [
      {
        "url": "localhost:8000/login"
      }
    ]
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "./apidoc/main.js",
    "group": "C:\\Users\\logan\\OneDrive\\Documents\\Caltech\\CS 101-1\\Final\\apidoc\\main.js",
    "groupTitle": "C:\\Users\\logan\\OneDrive\\Documents\\Caltech\\CS 101-1\\Final\\apidoc\\main.js",
    "name": ""
  },
  {
    "type": "post",
    "url": "/contact-form",
    "title": "Contact Form",
    "name": "ContactForm",
    "group": "Contact",
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The person's full name.</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>The person's email.</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>The sent message.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response",
            "description": "<p>A message that the message was successfully recorded.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Contact",
    "sampleRequest": [
      {
        "url": "localhost:8000/contact-form"
      }
    ]
  },
  {
    "type": "post",
    "url": "/checkout",
    "title": "Checkout",
    "name": "Checkout",
    "group": "Items",
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "Array",
            "optional": false,
            "field": "items",
            "description": "<p>An array of dictionaries with category and item keys.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response",
            "description": "<p>A message that the order is on its way.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Items",
    "sampleRequest": [
      {
        "url": "localhost:8000/checkout"
      }
    ]
  },
  {
    "type": "post",
    "url": "/items/:category/:item",
    "title": "Create Item",
    "name": "CreateItem",
    "group": "Items",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>The item's category.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "item",
            "description": "<p>The item's name.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response",
            "description": "<p>A message that the item has been created.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Items",
    "sampleRequest": [
      {
        "url": "localhost:8000/items/:category/:item"
      }
    ]
  },
  {
    "type": "delete",
    "url": "/categories/:category/:item",
    "title": "Delete Item",
    "name": "DeleteItem",
    "group": "Items",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>The item's category.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "item",
            "description": "<p>The item's name.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response",
            "description": "<p>A message that the item has been deleted.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Items",
    "sampleRequest": [
      {
        "url": "localhost:8000/categories/:category/:item"
      }
    ]
  },
  {
    "type": "get",
    "url": "/categories/",
    "title": "Request Item Categories",
    "name": "GetCategories",
    "group": "Items",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "categories",
            "description": "<p>Categories of items.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Items",
    "sampleRequest": [
      {
        "url": "localhost:8000/categories/"
      }
    ]
  },
  {
    "type": "get",
    "url": "/categories/:category",
    "title": "Request Items in Category",
    "name": "GetCategory",
    "group": "Items",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>The name of the category.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "items",
            "description": "<p>Item names in the category.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Items",
    "sampleRequest": [
      {
        "url": "localhost:8000/categories/:category"
      }
    ]
  },
  {
    "type": "get",
    "url": "/categories/:category",
    "title": "Request Item",
    "name": "GetItem",
    "group": "Items",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>The name of the category.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "item",
            "description": "<p>The name of the item.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Title-case name of the item.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "short-description",
            "description": "<p>A short summary of what the item is.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "full-description",
            "description": "<p>A long description of the item.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "quantity",
            "description": "<p>The number of this item in-stock.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "price",
            "description": "<p>How much the item costs.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>The name of the image representing this item, stored in public images.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Items",
    "sampleRequest": [
      {
        "url": "localhost:8000/categories/:category"
      }
    ]
  },
  {
    "type": "get",
    "url": "/items",
    "title": "Request All Items",
    "name": "GetItems",
    "group": "Items",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "items",
            "description": "<p>A dictionary of everything in the categories folder.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Items",
    "sampleRequest": [
      {
        "url": "localhost:8000/items"
      }
    ]
  },
  {
    "type": "post",
    "url": "/categories/:category/:item",
    "title": "Update Item",
    "name": "UpdateItem",
    "group": "Items",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "category",
            "description": "<p>The item's category.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "item",
            "description": "<p>The item's name.</p>"
          }
        ],
        "Request body": [
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>The updated image filename to represent the item.</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "quantity",
            "description": "<p>The updated item quantity.</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "price",
            "description": "<p>The updated item price.</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "short-description",
            "description": "<p>The updated item short summary.</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "full-description",
            "description": "<p>The updated item full description.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "response",
            "description": "<p>A message that the item has been updated.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./app.js",
    "groupTitle": "Items",
    "sampleRequest": [
      {
        "url": "localhost:8000/categories/:category/:item"
      }
    ]
  }
] });
