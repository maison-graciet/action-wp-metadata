import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls, InspectorAdvancedControls } from "@wordpress/block-editor";
import { PanelBody, PanelRow, ToggleControl } from "@wordpress/components";
import { variations as variationsConfig } from "../../../gracietco-gut.config.js";
import { useEffect } from "@wordpress/element";
import blockIcons from "../icons.js";

const coverSettings = (settings, name) => {
  if (name !== "core/cover") {
    return settings;
  }
  settings.attributes.variation = {
    type: "string",
    default: ""
  };
  settings.attributes.hasIcon = {
    type: "boolean",
    default: false
  };
  settings.attributes.isLarge = {
    type: "boolean",
    default: false
  };
  settings.attributes.hasParallax = {
    type: "boolean",
    default: true
  };
  settings.attributes.isRepeated = {
    type: "boolean",
    default: false
  };
  if (settings.supports) {
    settings.supports.defaultStylePicker = false;
    settings.supports.align = ["wide", "full"];
  }
  settings.example = {
    attributes: {
      overlayColor: "primary-900",
      dimRatio: 50,
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/46-233-0009_Svirzh_Castle_RB.jpg/640px-46-233-0009_Svirzh_Castle_RB.jpg",
    },
    innerBlocks: [
      {
        name: "core/heading",
        attributes: {
          content: "Titre de la bannière",
          level: 1
        },
      },
      {
        name: "core/paragraph",
        attributes: {
          variation: "catchphrase",
          className: "is-catchphrase",
          content: "Accroche de la bannière"
        },
      },
      {
        name: "core/buttons",
        innerBlocks: [
          {
            name: "core/button",
            attributes: {
              text: "En savoir plus"
            }
          }
        ]
      },
    ]
  };
  const variations = [
    {
      icon: blockIcons.cta,
      name: "cta",
      title: "Appel à l'action",
      description: "Créez un appel à l'action pour mettre en avant des liens vers vos pages ou ressources importantes.",
      attributes: {
        variation: "cta"
      },
      innerBlocks: [["gco/icon"],["core/heading"],["core/paragraph"],["core/button"]],
      isActive: (blockAttributes) => {
        return blockAttributes.variation === "cta";
      }
    }
  ].filter(e => variationsConfig["core/cover"].includes(e.name));
  settings.variations = variations;
  return settings;
};
const editCover = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    if (!props.name.includes("core/cover")) {
      return (<BlockEdit {...props } />);
    }
    const { attributes, setAttributes } = props;
    const updateClass = (options) => {
      let classList = (attributes.className || "").split(" ").filter(e => !["cta", "is-large","has-icon"].includes(e));
      (attributes.variation === "cta") && classList.push("cta");
      let isLarge = attributes.isLarge;
      let hasIcon = attributes.hasIcon;
      if (typeof options.isLarge !== "undefined") {
        isLarge = options.isLarge;
      }
      if (typeof options.hasIcon !== "undefined") {
        hasIcon = options.hasIcon;
      }
      isLarge && classList.push("is-large");
      hasIcon && classList.push("has-icon");
      setAttributes({ ...options, className: classList.join(" ") });
    };
    useEffect(() => {
      if (attributes.variation === "cta") {
        updateClass( { isLarge: true } );
      }
    }, []);
    return (<>
      <InspectorControls>
        { attributes.variation === "cta" ?
          (<PanelBody title="Paramètres de l'appel à l'action" className="cta-settings">
            <PanelRow>
              <ToggleControl
                label="Utiliser une icône"
                help={
                  attributes.hasIcon
                    ? "Une icône est utilisée"
                    : "Pas d'icône"
                }
                checked={ attributes.hasIcon }
                onChange={ () => updateClass({ hasIcon: !attributes.hasIcon }) }
              />
            </PanelRow>
          </PanelBody>)
          : (<PanelBody title="Paramètres de la bannière" className="cta-settings">
            <PanelRow>
              <ToggleControl
                label="Grand format ?"
                help={
                  attributes.isLarge
                    ? "Oui"
                    : "Non"
                }
                checked={ attributes.isLarge }
                onChange={ () => updateClass({ isLarge: !attributes.isLarge }) }
              />
            </PanelRow>
          </PanelBody>
          )
        }
      </InspectorControls>
      <BlockEdit {...props } />
      <InspectorAdvancedControls>
      </InspectorAdvancedControls>
    </>);
  };
}, "withAdvancedControls");

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/cover",
  coverSettings
);

addFilter(
  "editor.BlockEdit",
  "gracietco-gut/supports/group",
  editCover
);
