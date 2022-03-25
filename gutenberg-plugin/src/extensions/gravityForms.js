import { addFilter } from "@wordpress/hooks"; 

function editSettings(settings, name ) {
  if (name !== "gravityforms/form") {
    return settings;
  }
  settings.parent = ["gco/external-content"];
  return settings;
}

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/gravityforms",
  editSettings
);
