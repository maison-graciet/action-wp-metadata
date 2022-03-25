import { addFilter } from "@wordpress/hooks";
import { variations as variationsConfig } from "../../../gracietco-gut.config.js";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls, InspectorAdvancedControls } from "@wordpress/block-editor";
import { PanelBody, PanelRow, SelectControl } from "@wordpress/components";

import blockIcons from "../icons.js";

const gallerySettings = (settings, name) => {
  if (name !== "core/gallery") {
    return settings;
  }
  settings.attributes.sizeSlug = {
    type: "string",
    default: "full"
  }
  settings.attributes.variation = {
    type: "string",
    default: ""
  } 
  settings.attributes.carouselNavigation = {
    type: "string",
    default: "buttons"
  }
  if (settings.supports) {
    settings.supports.align = ["wide", "full"];
  }
  settings.example = {
    attributes: {
      columns: 2,
    },
    innerBlocks: [
      {
        name: "core/image",
        attributes: {
          url:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/E-burg_asv2019-05_img46_view_from_VysotSky.jpg/640px-E-burg_asv2019-05_img46_view_from_VysotSky.jpg",
        },
      },
      {
        name: "core/image",
        attributes: {
          url:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Vista_de_%C3%85lesund_desde_Aksla%2C_Noruega%2C_2019-09-01%2C_DD_16.jpg/640px-Vista_de_%C3%85lesund_desde_Aksla%2C_Noruega%2C_2019-09-01%2C_DD_16.jpg",
        },
      },
      {
        name: "core/image",
        attributes: {
          url:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/L%C3%B6wenstein_-_Wolfertsberg_-_Weinberge_und_Waldrand_im_Oktober.jpg/640px-L%C3%B6wenstein_-_Wolfertsberg_-_Weinberge_und_Waldrand_im_Oktober.jpg",
        },
      },
      {
        name: "core/image",
        attributes: {
          url:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/46-233-0009_Svirzh_Castle_RB.jpg/640px-46-233-0009_Svirzh_Castle_RB.jpg",
        },
      },
    ],
  };
  const variations = [
    {
      icon: blockIcons.navgrid,
      name: "navgrid",
      title: "Grille de navigation",
      description: "Animez la navigation sur votre site à l'aide d'une grille de navigation",
      attributes: {
        className: "navgrid",
        variation: "navgrid",
      },
      isActive: (blockAttributes) => { 
        return blockAttributes.variation === "navgrid";
      }
    },
    {
      icon: blockIcons.carousel,
      name: "carousel",
      title: "Carrousel",
      description: "Diffusez un carrousel d'images pour mettre en avant vos contenus graphiques",
      attributes: {
        className: "carousel",
        variation: "carousel"
      },
      isActive: (blockAttributes) => {
        return blockAttributes.variation === "carousel";
      }
    }
  ].filter(e => variationsConfig["core/gallery"].includes(e.name));
  settings.variations = variations;
  return settings;
};

const editGallery = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    if (!props.name.includes("core/gallery")) {
      return (<BlockEdit {...props } />);
    }
    return (<>
      <InspectorControls>
        { (props.attributes.variation === "carousel")
          ? (
            <PanelBody title="Options du carousel">
              <PanelRow>
                <SelectControl
                  label="Navigation"
                  options={
                    [
                      {label: "Boutons", value: "buttons"},
                      {label: "Flèches", value: "arrows"}
                    ]
                  }
                  value={ props.attributes.carouselNavigation }
                  onChange={ (value) => { props.setAttributes({carouselNavigation: value }); } }
                />
              </PanelRow>
            </PanelBody>
          )
          : (<></>)
        }
      </InspectorControls>
      <BlockEdit {...props } />
      <InspectorAdvancedControls>
      </InspectorAdvancedControls>
    </>);
  };
}, "withAdvancedControls");

addFilter(
  "editor.BlockEdit",
  "gracietco-gut/supports/gallery",
  editGallery
);

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/gallery",
  gallerySettings
);
