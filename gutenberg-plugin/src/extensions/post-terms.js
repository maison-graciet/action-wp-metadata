import { addFilter } from "@wordpress/hooks";
import { variations as variationsConfig } from "../../../gracietco-gut.config.js";

const termsSettings = (settings, name) => {
  if (name !== "core/post-terms") {
    return settings;
  }
  settings.category = "widgets";
  // available variations: category / post tag
  settings.variations = settings.variations.filter(e => variationsConfig["core/post-terms"].includes(e.name));
  return settings;
};

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/terms",
  termsSettings
);
