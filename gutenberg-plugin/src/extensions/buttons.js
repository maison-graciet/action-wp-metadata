import { addFilter } from "@wordpress/hooks";

const saveButtons = (element, blockType, attributes) => {
  if (blockType.name !== "core/buttons" ) {
    return element;
  }
  let style = {};
  if (attributes.layout) {
    style.justifyContent = attributes.layout.justifyContent;
    style.flexDirection = (attributes.layout.orientation === "vertical") ? "column":"row";
    style.flexWrap = attributes.layout.flexWrap;
  }
  const clone = wp.element.cloneElement(
    element,
    { style });
  return clone;
};

const buttonsSettings = (settings, name) => {
  if (name !== "core/buttons") {
    return settings;
  }
  settings.title = "Zone de liens";
  settings.description = "Organise la navigation de votre site en regroupant plusieurs liens.";
  return settings;
};

const buttonSettings = (settings, name) => {
  if (name !== "core/button") {
    return settings;
  }
  settings.title = "Lien";
  settings.description = "Guide la navigation de vos utilisateurs et sculpte l'architecture de votre site.";
  if (settings.supports) {
    settings.supports.defaultStylePicker = false;
  }
  return settings;
};

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/buttons",
  buttonsSettings
);

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/button",
  buttonSettings
);

addFilter(
  "blocks.getSaveElement",
  "gracietco-gut/supports/buttons",
  saveButtons
);
