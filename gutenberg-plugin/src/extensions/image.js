import { useEffect } from "@wordpress/element";
import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { config } from "../../../gracietco-gut.config.js";

const editImage = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    if (!props.name.includes("core/image")) {
      return (<BlockEdit {...props } />);
    }
    const sizeSlug = props.attributes.sizeSlug;
    useEffect(() => {
      if (sizeSlug !== "full") {
        props.setAttributes({ sizeSlug: "full" });
      }
    }, [sizeSlug]);
    return (<>
      <BlockEdit {...props} />
      <div style={{ display: "none" }}>
        <div className={ "wp-block-button "+(config["core/image"].navgridButtonStyle || "") }>
          <span className="wp-block-button__link">{ props.attributes.title || "Découvrir"}</span>
        </div>
      </div>
    </>);
  };
}, "withAdvancedControls");

const imageSettings = (settings, name) => {
  if (name !== "core/image") {
    return settings;
  }
  settings.description = "Insérez une image pour habiller votre contenu, illustrer vos propos ou diffuser une information.";
  settings.example = {
    attributes: {
      sizeSlug: "full",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/E-burg_asv2019-05_img46_view_from_VysotSky.jpg/640px-E-burg_asv2019-05_img46_view_from_VysotSky.jpg",
      caption: "Légende de l'image",
    }
  },
  settings.attributes.sizeSlug = {
    type: "string",
    default: "full"
  };
  settings.attributes.href = {
    type: "string"
  };
  settings.attributes.url = {
    type: "string"
  };
  settings.attributes.alt = {
    type: "string"
  };
  settings.attributes.caption = {
    type: "string"
  };
  settings.attributes.title = {
    type: "string"
  };
  settings.attributes.rel = {
    type: "string"
  };
  settings.attributes.linkClass = {
    type: "string"
  };
  settings.attributes.linkTarget = {
    type: "string"
  };
  return settings;
};

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/image",
  imageSettings
);

addFilter(
  "editor.BlockEdit",
  "gracietco-gut/supports/image",
  editImage
);
