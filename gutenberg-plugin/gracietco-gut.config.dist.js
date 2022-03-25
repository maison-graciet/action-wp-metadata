const graGutConfig = {
  "global": {
    "forceValidation": false,
    "customFormRender": true,
    "categories": [
      {
        "slug": "devel",
        "label": "Développement"
      },
      {
        "slug": "hidden",
        "//": "Catégorie cachée",
        "label": " "
      }
    ],
    "templatesAllowedBlocks": [
      "gco/content",
      "core/search",
      "core/post-date",
      "core/post-excerpt",
      "core/post-featured-image",
      "core/post-navigation-link",
      "core/post-template",
      "core/post-terms",
      "core/post-title"
    ],
    "postsAllowedBlocks": [
      "core/paragraph",
      "core/image",
      "core/heading",
      "core/gallery",
      "core/list",
      "core/button",
      "core/buttons",
      "gco/debug",
      "gco/carousel",
      "gco/form"
    ],
    "allowedBlocks": [
      "core/paragraph",
      "core/image",
      "core/heading",
      "core/gallery",
      "core/list",
      "core/quote",
      "core/button",
      "core/buttons",
      "core/columns",
      "core/column",
      "core/cover",
      "core/group",
      "core/missing",
      "core/block",
      "core/spacer",
      "core/query",
      "core/table",
      "gco/icon",
      "gco/icon-and-text",
      "gco/cart",
      "gco/categories",
      "gravityforms/form",
      "gco/debug",
      "gco/carousel",
      "gco/accordion",
      "gco/accordion-item",
      "gco/external-content",
      "gco/form",
      "gco/map",
      "gco/coordinate",
      "gco/locked-group-tab",
      "gco/locked-group-tabs",
      "gco/locked-group-testimonial-block",
      "gco/locked-group-icon-grid",
      "gco/locked-group-coordinates"
    ]
  },
  "patterns": {
    "categories": [
      {
        "slug": "classic",
        "label": "Graciet & Co."
      }
    ],
    "list": [
      {
        "active": false,
        "slug": "quote_group_img",
        "title": "Groupe de témoignages avec portraits",
        "categories": ["classic"],
        "description": "Positionnez un ensemble de témoignages"
      },
      {
        "active": true,
        "slug": "rich_banner",
        "title": "Bannière enrichie",
        "categories": ["classic"],
        "description": "Insérez une bannière avec titre, accroche et appel à l'action"
      }
    ]
  },
  "variations": {
    "//": "this is used to allow or not custom variations for blocks",
    "core/paragraph": ["notification", "catchphrase"],
    "core/gallery": ["navgrid", "carousel"],
    "core/cover": ["cta"],
    "core/post-terms": ["category"],
    "gco/locked-group": ["tab", "tabs", "coordinates", "testimonial-block", "icon-grid"]
  },
  "config": {
    "//": "provides hidden options for blocks in order to hide some settings or set developer-only parameters",
    "03-iconText": {
      "imageControl": true
    },
    "06-coordinate": {
      "iconSelector": true,
      "contentTypes": [
        { "label": "Adresse", "value": "p" },
        { "label": "E-mail", "value": "a+mailto:" },
        { "label": "Téléphone", "value": "a+tel:" },
        { "label": "Fax", "value": "a+fax:" }
      ]
    },
    "b06-testimonialBlock": {
      "columnsControl": true
    },
    "b06-testimonialItem": {
      "photoControl": true,
      "linkControl": true
    },
    "b07-contentGrid": {
      "columnsControl": true
    },
    "b07-contentGridItem": {
      "iconSizeControl": true,
      "iconColorControl": true,
      "textColorControl": true
    },
    "04-simplebanner": {
      "filter": false,
      "boostControl": true,
      "logoChoiceControl": [
        { "label": "désactivé", "value": "" },
        { "label": "TMH", "value": "/app/themes/gco-tmh/resources/assets/images/tmh.svg" },
        { "label": "TMH-Group", "value": "/app/themes/gco-tmh/resources/assets/images/tmh-group.svg" },
        { "label": "TMH-AMS", "value": "/app/themes/gco-tmh/resources/assets/images/tmh-ams.svg" },
        { "label": "TMH-CEMEP", "value": "/app/themes/gco-tmh/resources/assets/images/tmh-cemep.svg" },
        { "label": "TMH-Tools", "value": "/app/themes/gco-tmh/resources/assets/images/tmh-tools.svg" },
        { "label": "TMH-Novatec", "value": "/app/themes/gco-tmh/resources/assets/images/tmh-novatec.svg" },
        { "label": "TMH-Concept", "value": "/app/themes/gco-tmh/resources/assets/images/tmh-concept.svg" }
      ],
      "textColorControl": false
    },
    "b15-lastNews": {
      "columnsControl": false
    },
    "b16-map": {
      "tileServer": "https://api.mapbox.com/styles/v1/graciet-co/ckw4zp25d13ye15oc1wyxjd1h/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ3JhY2lldC1jbyIsImEiOiJja3c0djhidm4yNm1jMnhub2F4NGx0NnYwIn0.1ilybyPaxkuBwHQ6vqRRGg",
      "tileAttribution": "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors",
      "marker": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22.88 30'><style>.cls-2{stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.3px;}</style><path class='cls-1' fill='currentColor' d='M11.44,0A11.44,11.44,0,0,0,0,11.44C0,16.15,6.37,24.9,9.6,29a2.24,2.24,0,0,0,3.68,0c3.23-4.14,9.6-12.89,9.6-17.6A11.44,11.44,0,0,0,11.44,0Z'/><path class='cls-2' fill='currentColor' d='M11.44,16.3a4.86,4.86,0,1,1,4.86-4.86A4.85,4.85,0,0,1,11.44,16.3Z'/></svg>"
    },
    "b17-carousel": {
      "totalImages": {
          "sm": 1,
          "md": 2,
          "lg": 3,
          "xl": 4
      }
    },
    "b19-responsables-map": {
      "tileServer": "https://api.mapbox.com/styles/v1/graciet-co/ckw4zp25d13ye15oc1wyxjd1h/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ3JhY2lldC1jbyIsImEiOiJja3c0djhidm4yNm1jMnhub2F4NGx0NnYwIn0.1ilybyPaxkuBwHQ6vqRRGg",
      "tileAttribution": "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors",
      "marker": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22.88 30'><style>.cls-2{stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.3px;}</style><path class='cls-1' fill='currentColor' d='M11.44,0A11.44,11.44,0,0,0,0,11.44C0,16.15,6.37,24.9,9.6,29a2.24,2.24,0,0,0,3.68,0c3.23-4.14,9.6-12.89,9.6-17.6A11.44,11.44,0,0,0,11.44,0Z'/><path class='cls-2' fill='currentColor' d='M11.44,16.3a4.86,4.86,0,1,1,4.86-4.86A4.85,4.85,0,0,1,11.44,16.3Z'/></svg>"
    },
    "core/spacer": {
      "spaces": [50,100, 150]
    },
    "core/quote": {
      "imageControl": true
    },
    "core/image": {
      "navgridButtonStyle": "is-style-button-secondary"
    }
  },
  "styles": {
    "//": "here we can register block styles, ie classes that can be visually added to each block",
    "core/paragraph": [
      {
        "name": "has-shadow",
        "label": "Ombre"
      }
    ],
    "core/cover": [
    ],
    "core/button": [
      {
        "label": "Principal",
        "name": "button-primary",
        "isDefault": true
      },
      {
        "label": "Secondaire",
        "name": "button-secondary"
      },
      {
        "label": "Bordure",
        "name": "button-border"
      }
    ],
    "core/list": [
      {
        "label": "Disque",
        "name": "list-disc",
        "isDefault": true
      },
      {
        "label": "Coche",
        "name": "list-check"
      },
      {
        "label": "Point d'interrogation",
        "name": "list-help"
      },
      {
        "label": "Info",
        "name": "list-info"
      },
      {
        "label": "Warning",
        "name": "list-warning"
      },
      {
        "label": "Alerte",
        "name": "list-alert"
      },
      {
        "label": "Flèche",
        "name": "list-arrow"
      },
      {
        "label": "Étoile",
        "name": "list-star"
      },
      {
        "label": "Sans puce",
        "name": "list-no-disc"
      }
    ],
    "core/heading": [
      {
        "name": "has-shadow",
        "label": "Ombre"
      }
    ]
  },
  "formats": {
    "//": "this is used to remove the default formats from the richtext component",
    "remove": ["core/code", "core/image", "core/text-color", "core/keyboard"]
  }
}
const { global, patterns, variations, config, styles, formats } = graGutConfig;
export { global, patterns, variations, config, styles, formats };
