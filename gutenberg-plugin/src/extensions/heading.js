import { addFilter } from "@wordpress/hooks";

const headingSettings = (settings, name) => {
  if (name !== "core/heading") {
    return settings;
  }
  settings.supports.defaultStylePicker = false;
  settings.example = {
    attributes: {
      content: "Ceci est un titre de niveau 2",
      level: 2
    }
  };
  settings.attributes.content = {
    type: "string",
    default: ""
  };
  return settings;
};

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/heading",
  headingSettings
);
