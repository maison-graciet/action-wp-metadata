import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { Icon, Button } from "@wordpress/components";
import { useState } from "@wordpress/element";
import IconSelector from "../iconSelector.js";

export default function Edit( props ) {
  const { attributes, setAttributes } = props;
  const blockProps = useBlockProps();
  const [ isOpen, setOpen ] = useState( false );
  const openModal = () => setOpen( true );
  const closeModal = () => setOpen( false );
  const Tag = attributes.tagName;

  return (
    <> 
      <InspectorControls></InspectorControls>
      { isOpen ?
        <IconSelector
          isOpen={ isOpen }
          closeModal={ closeModal }
          hasColorChoice={ true }
          setIcon={ (icon, color) => {
            setAttributes({ iconName: icon, iconColor: color });
          }}
        />
        : (<></>)
      }
      <div { ...blockProps }>
        <Button
          aria-haspopup="true"
          variant="secondary"
          className="is-secondary"
          title="Sélectionnez une icône"
          onClick={ openModal }>
          {
            (attributes.iconName === "")
              ? (<Icon icon="flag" style={{ "fontFamily": "dashicons" }} />)
              : (<Tag className={ "icon "+attributes.iconName+" "+attributes.iconColor }>{ attributes.iconName }</Tag>)
          }
        </Button>
      </div>
    </>
  );
}
