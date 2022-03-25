import { useBlockProps, RichText, InnerBlocks, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, PanelRow, ToggleControl } from "@wordpress/components";

export default function edit(props) {
  const { attributes, setAttributes } = props;
  const { title, defaultOpen } = attributes;
  const blockProps = useBlockProps();

  return (
    <>
      <InspectorControls>
        <PanelBody
          title="Ouverture"
          initialOpen={true}
        >
          <PanelRow>
            <ToggleControl
              label="Comportement par défaut"
              help={
                defaultOpen
                  ? "Ouvert par défaut"
                  : "Fermé par défaut"
              }
              checked={ defaultOpen }
              onChange={ () =>{ setAttributes( { defaultOpen: ! defaultOpen } ); } }
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <details {...blockProps} open>
        <RichText
          tagName="summary"
          placeholder="Titre ou question"
          value={ title }
          onChange={ ( value ) => { setAttributes( { title: value } ); } }
          allowedFormats={ [] }
        />
        <InnerBlocks
          allowedBlocks={["core/paragraph"]}
          template={ [["core/paragraph", {}]] }
          templateLock={ false }
        />
      </details>
    </>);
}
