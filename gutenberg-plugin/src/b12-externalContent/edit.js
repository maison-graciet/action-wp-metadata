import { __ } from "@wordpress/i18n";
import { useBlockProps, InspectorControls, InspectorAdvancedControls, InnerBlocks, RichText, BlockControls, BlockVerticalAlignmentControl } from "@wordpress/block-editor";
import { PanelBody, PanelRow, ToggleControl } from "@wordpress/components";
import { Fragment } from "@wordpress/element";
 
export default function Edit( props ) {
  const { attributes, setAttributes } = props;
  const { verticalAlignment, classNameVertical, isVideo, description, haveTranscript, transcript } = attributes;
  const ALLOWED_BLOCKS = ["core/html"];
  const MY_TEMPLATE = [ [ "core/html", {} ] ];
  const blockProps = useBlockProps();
  let classVertical = classNameVertical;
  const onVerticalAlignmentChange = ( alignment ) => {
    if(alignment === "top") {
      classVertical = "align-start";
    } else if (alignment === "bottom") {
      classVertical = "align-end";
    } else {
      classVertical = "align-center";
    }
    setAttributes( { verticalAlignment: alignment } );
    setAttributes( { classNameVertical: classVertical } );
  };
  return (
    <Fragment>
      <BlockControls group="block">
        <BlockVerticalAlignmentControl
          onChange={ onVerticalAlignmentChange }
          value={ verticalAlignment }
        />
      </BlockControls>
      <InspectorControls key="setting">
        <PanelBody
          title={ __( "Paramétrage du bloc", "gracietco-gut" ) }
          initialOpen={true}
        >
          <PanelRow>
            <ToggleControl
              label={ __( "Est-ce une vidéo ?", "gracietco-gut" ) }
              help={
                isVideo
                  ? "Oui, je diffuse une vidéo"
                  : "Non"
              }
              checked={ isVideo }
              onChange={ () =>{ setAttributes( { isVideo: ! isVideo } ); } }
            />
          </PanelRow>
          { isVideo && (
            <PanelRow>
              <ToggleControl
                label={ __( "Ajouter une transcription ?", "gracietco-gut" ) }
                help={
                  haveTranscript
                    ? "Oui"
                    : "Non"
                }
                checked={ haveTranscript }
                onChange={ () =>{ setAttributes( { haveTranscript: ! haveTranscript } ); } }
              />
            </PanelRow>
          )}
        </PanelBody>
      </InspectorControls>
      <InspectorAdvancedControls>
      </InspectorAdvancedControls>
      <div { ...blockProps }
        className={ blockProps.className +" "+ classNameVertical  }
      >
        <InnerBlocks 
          allowedBlocks={ALLOWED_BLOCKS}
          template={ MY_TEMPLATE }
          templateLock="insert" />
        <RichText
          tagName= "div"
          className="description mt-4"
          value={ description }
          placeholder={__( "Description du contenu (facultatif)", "gracietco-gut" )}
          allowedFormats={ [ "core/bold", "core/italic", "core/link" ] }
          onChange={ ( value ) => { setAttributes( { description: value } ); } }
          multiline="p"
        />
        { isVideo && haveTranscript && (
          <RichText
            tagName= "div"
            className="content"
            value={ transcript }
            placeholder={__( "Transcription de la vidéo", "gracietco-gut" )}
            allowedFormats={ [ "core/bold", "core/italic", "core/link" ] }
            onChange={ ( value ) => { setAttributes( { transcript: value } ); } }
            multiline="p"
            data-aria-accordion-panel
          />
        )}
      </div>
    </Fragment>
  );
}
