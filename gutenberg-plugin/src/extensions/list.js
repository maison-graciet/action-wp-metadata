import { addFilter } from "@wordpress/hooks";

const listSettings = (settings, name) => {
  if (name !== "core/list") {
    return settings;
  }
  settings.supports.defaultStylePicker = false;
  settings.example = {
    attributes: {
      values: `<li>Élément de liste</li>
<li>Élément de liste</li>
      `
    }
  };
  return settings;
};

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/list",
  listSettings
);
