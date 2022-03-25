import { addFilter } from "@wordpress/hooks";

const columnsSettings = (settings, name) => {
  if (name !== "core/columns") {
    return settings;
  }
  if (settings.supports) {
    settings.supports.defaultStylePicker = false;
    settings.supports.color = false;
    settings.supports.spacing = false;
  }
  return settings;
};

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/columns",
  columnsSettings
);
