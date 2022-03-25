import { addFilter } from "@wordpress/hooks";

function htmlSettings(settings, name) {
  if (name !== "core/html") {
    return settings;
  }
  settings.parent = ["gco/external-content"];
  return settings;
}

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/html",
  htmlSettings
);
