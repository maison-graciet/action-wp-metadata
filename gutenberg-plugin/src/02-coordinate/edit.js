import { useBlockProps, InspectorControls, RichText, InnerBlocks } from "@wordpress/block-editor";
import { PanelBody, PanelRow, SelectControl } from "@wordpress/components";
import { config } from "../../../gracietco-gut.config.js";

const blockConfig = config["06-coordinate"];

export default function Edit( props ) {
  const blockProps = useBlockProps();
  const { content, contentType } = props.attributes;
  return (
    <>
      <InspectorControls key="setting">
        <PanelBody
          title="Type d'information"
          initialOpen={true}
        >
          <PanelRow>
            <SelectControl
              label="De quel type de coordonnées s'agit-il ?"
              value={ contentType }
              options={ blockConfig.contentTypes }
              onChange={ (value) => { props.setAttributes( { contentType: value } ); } }
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        {
          blockConfig.iconSelector
            ? <InnerBlocks templateLock="all" allowedBlocks={["gco/icon"]} template={[["gco/icon"]]} />
            : (<></>)
        }
        <RichText
          className="text"
          placeholder={ blockConfig.contentTypes.find(e => e.value === contentType).label }
          value={content}
          onChange={ ( value ) => { props.setAttributes( { content: value } ); } }
          allowedFormats={ [] }
          multiline={ contentType === "p" ? "br" : false }
          tagName="p"
        />
      </div>
    </>
  );
}
