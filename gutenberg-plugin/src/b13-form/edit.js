import { __ } from "@wordpress/i18n";
import { useBlockProps, InnerBlocks, RichText } from "@wordpress/block-editor";

export default function Edit( props ) {
  const { attributes, setAttributes } = props;
  const { title, note } = attributes;
  const ALLOWED_BLOCKS = ["gravityforms/form"];
  const MY_TEMPLATE = [ [ "gravityforms/form", {} ] ];
  const blockProps = useBlockProps();
    
  return (
    <>
      <div { ...blockProps }>
        <div className="form-title">
          <RichText
            tagName= "h2"
            className="h2"
            value={ title }
            placeholder={__( "Titre du formulaire", "gracietco-gut" )}
            onChange={ ( value ) => { setAttributes( { title: value } ); } }
          />
        </div>
        <div className="form-content">
          <InnerBlocks 
            allowedBlocks={ALLOWED_BLOCKS}
            template={ MY_TEMPLATE }
            templateLock="all" />
        </div>
        <div className="footnote">
          <RichText
            tagName= "p"
            value={ note }
            placeholder={__( "Note de pied de page", "gracietco-gut" )}
            allowedFormats={ [ "core/bold", "core/italic", "core/link" ] }
            onChange={ ( value ) => { setAttributes( { note: value } ); } }
            multiline="p"
          />
        </div>
      </div>
    </>);
}
