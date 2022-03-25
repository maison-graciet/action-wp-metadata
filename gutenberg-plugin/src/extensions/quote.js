import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InnerBlocks, useInnerBlocksProps, useBlockProps, InspectorControls, InspectorAdvancedControls } from "@wordpress/block-editor";
import { PanelBody, ToggleControl } from "@wordpress/components";
import { config as conf } from "../../../gracietco-gut.config.js";

const config = conf["core/quote"];

const quoteSettings = (settings, name) => {
  if (name !== "core/quote") {
    return settings;
  }
  settings.title = "Témoignage";
  settings.attributes.hasImage = {
    type: "boolean",
    default: false
  };
  settings.example = {
    attributes: {
      value: "<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>",
      citation: "Auteur du témoignage"
    }
  };
  settings.description = "Mettez en avant ce que disent vos clients ou diffusez vos messages d'experts.";
  if (settings.supports) {
    settings.supports.defaultStylePicker = false;
  }
  return settings;
};

const editQuote = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    if (!props.name.includes("core/quote")) {
      return (<BlockEdit {...props } />);
    }
    const blockProps = useBlockProps();
    //~ const innerBlocksProps = useInnerBlocksProps( { ref: blockProps.ref, "data-block": blockProps["data-block"] }, {
    //~ const innerBlocksProps = useInnerBlocksProps( { ...blockProps }, {
    const innerBlocksProps = useInnerBlocksProps({  ref: blockProps.ref, "data-block": blockProps["data-block"] }, {
      allowedBlocks: ["core/image"],
      template: [ ["core/image", { url: "data:image/png;base64,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" } ] ],
      templateInsertUpdatesSelection: false,
      templateLock: "all"
    });
    return (<>
      <InspectorControls>
        <PanelBody title="Auteur">
          { config.imageControl ?
            (<ToggleControl
              label="Ajouter une image ?"
              help={
                props.attributes.hasImage
                  ? "Une image de l'auteur est ajoutée"
                  : "Aucune image n'est ajoutée"
              }
              checked={ props.attributes.hasImage }
              onChange={ () => props.setAttributes( { hasImage: ! props.attributes.hasImage } ) }
            />) : (<></>)
          }
        </PanelBody>
      </InspectorControls>
      <div {...blockProps} className={blockProps.className+(props.attributes.hasImage ? " has-image":"")}>
        <BlockEdit {...props} />
        { props.attributes.hasImage
          ? (<div {...innerBlocksProps } />)
          : (<></>)
        }
      </div>
      <InspectorAdvancedControls>
      </InspectorAdvancedControls>
    </>);
  };
}, "withAdvancedControls");

const saveQuote = (element, blockType, attributes) => {
  if (blockType.name !== "core/quote") {
    return element;
  }
  const blockProps = useBlockProps.save();
  const newChildren = attributes.hasImage
    ? [...element.props.children, (<InnerBlocks.Content key={ Math.random() }/>)]
    : [...element.props.children];
  const clone = wp.element.cloneElement(
    element,
    {className: blockProps.className+(attributes.hasImage ? " has-image":"")},
    newChildren
  );
  return clone;
};

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/quote",
  quoteSettings
);

addFilter(
  "editor.BlockEdit",
  "gracietco-gut/supports/quote",
  editQuote
);

addFilter(
  "blocks.getSaveElement",
  "gracietco-gut/supports/quote",
  saveQuote
);
