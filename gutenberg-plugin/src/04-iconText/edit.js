import { useBlockProps, InspectorControls, InnerBlocks } from "@wordpress/block-editor";
import { PanelBody, ToggleControl } from "@wordpress/components";
import { config as conf } from "../../../gracietco-gut.config.js";

const config = conf["03-iconText"];

export default function Edit( props ) {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();
  return (
    <> 
      <InspectorControls>
        <PanelBody title="Icône">
          { config.imageControl ?
            (<ToggleControl
              label="Utiliser une image ?"
              help={
                attributes.hasImage
                  ? "Une image est utilisée"
                  : "Une icône est utilisée"
              }
              checked={ attributes.hasImage }
              onChange={ () => setAttributes( { hasImage: ! attributes.hasImage } ) }
            />) : (<></>)
          }
        </PanelBody>
      </InspectorControls>
      <div { ...blockProps }>
        <InnerBlocks
          orientation="vertical"
          allowedBlocks={["gco/icon", "core/heading", "core/paragraph"]}
          template={
            (attributes.hasImage)
              ? [["core/image", {}],["core/heading", {}],["core/paragraph", {}]]
              : [["gco/icon", {}],["core/heading", {}],["core/paragraph", {}]]
          }
          templateLock="all"
        />
      </div>
    </>
  );
}
