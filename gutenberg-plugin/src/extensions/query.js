import { addFilter } from "@wordpress/hooks";
import blockIcons from "../icons.js";

const querySettings = (settings, name) => {
  if (name !== "core/query") {
    return settings;
  }
  settings.icon = blockIcons.news;
  settings.supports = {
    anchor: true
  };
  if (settings.attributes) {
    settings.attributes.variation = "";
  }
  const variations = [
    {
      isDefault: true,
      category: "widgets",
      name: "last-news",
      title: "Remontée d'actualités",
      description: "Créez des liens vers vos actualités en faisant remonter des extraits des derniers articles publiés.",
      icon: blockIcons.news,
      attributes: {
        variation: "last-news",
        displayLayout: {
          type: "flex",
          columns: 3
        },
        query: {
          perPage: 3,
          pages: 0,
          offset: 0,
          postType: "post",
          order: "desc",
          orderBy: "date",
          author: "",
          search: "",
          exclude: [],
          sticky: "",
          inherit: false,
        }
      },
      innerBlocks: [
        [
          "core/post-template",
          {},
          [
            [ "core/post-featured-image", { isLink: true } ],
            [ "core/post-title", { isLink: true } ],
            [ "core/post-terms",  {term:"category"} ],
            [ "core/post-date", {format:"d F Y"} ]
          ],
        ]
      ],
      isActive: (blockAttributes) => { 
        return blockAttributes.variation === "last-news";
      },
      scope: [ "inserter" ],
    },
    {
      isDefault: true,
      category: "widgets",
      name: "one-last-news",
      title: "Dernier article",
      description: "Faites remonter la dernière actualité publiée",
      icon: "text-page",
      attributes: {
        variation: "one-last-news",
        displayLayout: {
          type: "flex",
          columns: 1
        },
        query: {
          perPage: 1,
          pages: 0,
          offset: 0,
          postType: "post",
          order: "desc",
          orderBy: "date",
          author: "",
          search: "",
          exclude: [],
          sticky: "",
          inherit: false,
        }
      },
      innerBlocks: [
        [
          "core/post-template",
          {},
          [
            [ "core/post-featured-image", { isLink: true } ],
            [ "core/post-title", { isLink: true } ],
            [ "core/post-terms",  {term:"category"} ],
            [ "core/post-date", {format:"d F Y"} ]
          ],
        ]
      ],
      isActive: (blockAttributes) => { 
        return blockAttributes.variation === "one-last-news";
      },
      scope: [ "inserter" ],
    }
  ];
  settings.variations = variations;
  return settings;
};

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/query",
  querySettings
);
