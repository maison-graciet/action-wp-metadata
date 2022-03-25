import { useBlockProps, InspectorControls, InnerBlocks } from "@wordpress/block-editor";
import { PanelBody, PanelRow, ToggleControl } from "@wordpress/components";

export default function Edit( props ) {
  const { attributes, setAttributes } = props;
  const { isFaq, isMulti } = attributes;
  const ALLOWED_BLOCKS = ["gco/accordion-item"];
  const MY_TEMPLATE = [ [ "gco/accordion-item", {} ] ];
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls key="setting">
        <PanelBody
          title="Paramétrage du bloc"
          initialOpen={true}
        >
          <PanelRow>
            <ToggleControl
              label="Activer le mode FAQ ?"
              help={
                isFaq
                  ? "Mode FAQ"
                  : "Mode classique"
              }
              checked={ isFaq }
              onChange={ () =>{ setAttributes( { isFaq: ! isFaq } ); } }
            />
          </PanelRow>
          <PanelRow>
            <ToggleControl
              label="Ouvrir plusieurs éléments à la fois ?"
              help={
                isMulti
                  ? "Oui"
                  : "Non, un seul élément à la fois"
              }
              checked={ isMulti }
              onChange={ () =>{ setAttributes( { isMulti: ! isMulti } ); } }
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <div { ...blockProps } >
        <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} template={ MY_TEMPLATE } />
      </div>
    </>
  );

}
