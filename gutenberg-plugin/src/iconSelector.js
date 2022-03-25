import { Button, Modal } from "@wordpress/components";
import { ColorPalette } from "@wordpress/block-editor";
import { useEffect, useState } from "@wordpress/element";

export default function IconSelector(props) {
  const { isOpen, closeModal, setIcon, hasColorChoice } = props;
  const [icons, setIcons] = useState([]);
  const colors = wp.data.select( "core/editor" ).getEditorSettings().colors;
  const getColor = (value) => {
    return wp.blockEditor.getColorObjectByColorValue(colors,value);
  };
  const [color, setColor] = useState(colors[0]);
  useEffect(() => {
    const iconRules = [...[...document.styleSheets]
      .find(st => [...st.rules]
        .find(r => r.selectorText && r.selectorText.includes(".icon."))).rules]
      .filter(e => e.selectorText && e.selectorText.includes(".icon."))
    // && !e.selectorText.includes("::after"))
      .map(e => e.selectorText.split(".icon.")[1].split(",")[0]);
    setIcons(iconRules);
  }, []);
  return (
    <>
      { isOpen  && (
        <Modal title={ "Choix de l'icône" } onRequestClose={ closeModal }>
          { hasColorChoice
            ?(<div className="icons-color-palette">
              <ColorPalette
                disableCustomColors={ true }
                value={ color.color }
                onChange={ (value) => { setColor(getColor(value)); } }
                clearable={ false }
              />
            </div>)
            :(<></>)
          }
          <div className="icons editor-styles-wrapper">
            {icons.map(name => (
              <Button
                name={ name }
                type="button"
                key={ name }
                onClick={() => {
                  closeModal();
                  setIcon(name, wp.editor.getColorClassName("background-color", color.slug ));
                }}
              >
                <i className={"icon "+name+" "+wp.editor.getColorClassName("background-color", color.slug )} aria-hidden="true">{ name }</i>
              </Button>
            ))}
          </div>
        </Modal>
      ) }
    </>
  );
}
