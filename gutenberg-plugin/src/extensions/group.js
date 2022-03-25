import { addFilter } from "@wordpress/hooks";

const groupSettings = (settings, name) => {
  if (name !== "core/group") {
    return settings;
  }
  if (settings.attributes) {
    settings.attributes.layout = {
      default: {
        inherit: true
      }
    };
  }
  if (settings.attributes.tagName) {
    settings.attributes.tagName.default = "section";
  }
  settings.supports.typography = false;
  settings.supports.spacing = false;
  settings.supports.__experimentalLayout = false;
  settings.supports.color = {
    background: true,
    text: false
  };
  settings.example = undefined;
  settings.variations = [];
  //wp.blocks.unregisterBlockVariation("core/group", "group-row");
  return settings;
};

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/group",
  groupSettings
);
