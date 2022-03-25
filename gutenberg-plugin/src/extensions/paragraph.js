import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls, InspectorAdvancedControls } from "@wordpress/block-editor";
import { PanelBody, SelectControl, Button } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import IconSelector from "../iconSelector.js";
import { variations as variationsConfig } from "../../../gracietco-gut.config.js";

const paragraphSettings = (settings, name) => {
  if (name !== "core/paragraph") {
    return settings;
  }
  settings.description = "Insérer un paragraphe de texte";
  settings.example = {
    attributes: {
      content: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Nulla sollicitudin.",
    }
  };
  settings.supports.color = {
    text: true,
    background: false
  };
  settings.supports.defaultStylePicker = false;
  settings.attributes.variation = {
    type: "string",
    default: ""
  };
  settings.attributes.notificationStyle = {
    type: "string",
    default: ""
  };
  settings.attributes.icon = {
    type: "string",
    default: ""
  };
  const variations = [
    {
      icon: "info-outline",
      name: "notification",
      title: "Notification",
      description: "Utilisez les notifications pour diffuser une alerte ou un message temporaire sur votre page.",
      attributes: {
        variation: "notification",
      },
      isActive: (blockAttributes) => { 
        return blockAttributes.variation === "notification";
      },
      example: {
        attributes: {
          variation: "notification",
          notificationStyle: "notif-warning",
          className: "is-notification notif-warning",
          content: "Une notification importante pour attirer l'attention des visiteurs."
        }
      }
    },
    {
      icon: "sticky",
      name: "catchphrase",
      title: "Accroche",
      description: "Les phrases d'accroche vous permettent de mettre en avant du contenu textuel.",
      attributes: {
        variation: "catchphrase",
        className: "is-catchphrase"
      },
      example: {
        attributes: {
          variation: "catchphrase",
          className: "is-catchphrase",
          content: "Ceci est une accroche."
        }
      },
      supports: {
        color: true
      },
      isActive: (blockAttributes) => { 
        return blockAttributes.variation === "catchphrase";
      }
    }
  ].filter(e => variationsConfig["core/paragraph"].includes(e.name));
  settings.variations = variations;
  return settings;
};

const editParagraph = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    if (!props.name.includes("core/paragraph")) {
      return (<BlockEdit {...props } />);
    }
    const [ isOpen, setOpen ] = useState( false );
    const openModal = () => setOpen( true );
    const closeModal = () => setOpen( false );
    const { setAttributes, attributes } = props;
    const updateClass = (options) => {
      let classList = [];
      let icon = attributes.icon;
      if (typeof options.icon !== "undefined") {
        icon = options.icon;
      }
      const style = options.notificationStyle || attributes.notificationStyle || "notif-info";
      if (icon.length) {
        classList.push("icon");
        classList.push(icon);
      }
      classList.push(style);
      if (classList.length) {
        classList.push("is-notification");
      }
      setAttributes({ ...options, className: classList.join(" ") });
    };
    useEffect(() => {
      if (attributes.variation === "notification"
      && attributes.notificationStyle === "") {
        updateClass({ notificationStyle: "notif-info" });
      }
    }, []);
    return (<>
      <InspectorControls>
        { (props.attributes.variation === "notification")
          ? (<PanelBody title="Paramètres de la notification" className="notification-settings">
            <SelectControl
              label="Apparence"
              value={ attributes.notificationStyle }
              options={ [
                { label: "Information", value: "notif-info" },
                { label: "Avertissement", value: "notif-warning" },
                { label: "Question", value: "notif-question" },
                { label: "Erreur", value: "notif-error" },
                { label: "Succès", value: "notif-success" },
              ] }
              onChange={ ( value ) => {
                updateClass({ notificationStyle: value });
              }}
            />
            <Button 
              aria-haspopup="true"
              variant="secondary"
              className="is-secondary"
              style={{ display: "inline-block" }}
              onClick={ openModal }
            >Choix de l&apos;icône
            </Button>
            { attributes.icon.length ?
              (<Button
                onClick={ () => { updateClass({icon: ""}); } }
                style={{ display: "inline-block", boxShadow: "none" }}
                isDestructive={ true }
              >Retirer l&apos;icône
              </Button>) : (<></>) }
          </PanelBody>)
          : (<></>)
        }
      </InspectorControls>
      { isOpen ?
        <IconSelector
          isOpen={ isOpen }
          closeModal={ closeModal }
          hasColorChoice={ false }
          setIcon={ (icon) => {
            updateClass({ icon });
          }}
        />
        : (<></>)
      }
      <BlockEdit {...props } />
      <InspectorAdvancedControls>
      </InspectorAdvancedControls>
    </>);
  };
}, "withAdvancedControls");

addFilter(
  "blocks.registerBlockType",
  "gracietco-gut/supports/paragraph",
  paragraphSettings
);

addFilter(
  "editor.BlockEdit",
  "gracietco-gut/supports/paragraph",
  editParagraph
);
