import { addFilter } from "@wordpress/hooks";
import { createHigherOrderComponent } from "@wordpress/compose";
import { InspectorControls, InspectorAdvancedControls } from "@wordpress/block-editor";
import { Button, ButtonGroup, PanelBody } from "@wordpress/components";
import { config as conf } from "../../../gracietco-gut.config.js";

const config = conf["core/spacer"];

const editSpacer = createHigherOrderComponent((BlockEdit) => {
  return (props) => {
    if (!props.name.includes("core/spacer")) {
      return (<BlockEdit {...props } />);
    }
    const { setAttributes, attributes } = props;
    /*let orientation = "vertical";
    if (typeof context !== "undefined") {
      orientation = context.orientation;
    }*/
    const updateSize = (value) => {
      /*if (orientation === 'horizontal') {
        setAttributes({
          width: value
        });
      } else {
        setAttributes({
          height: value
        });
      }*/
      setAttributes({
        height: value
      });
    };
    const buttons = config.spaces.map(e => {
      return (<Button variant="secondary" className="is-small" key={e} onClick={ () => updateSize(e) } isPressed={attributes.height === e} >{ e+"px" }</Button>);
    });
    return (<>
      <InspectorControls>
        <PanelBody title="Taille prédéfinie">
          <ButtonGroup>
            { buttons }
          </ButtonGroup>
        </PanelBody>
      </InspectorControls>
      <BlockEdit {...props } />
      <InspectorAdvancedControls>
      </InspectorAdvancedControls>
    </>);
  };
}, "withAdvancedControls");

addFilter(
  "editor.BlockEdit",
  "gracietco-gut/supports/spacer",
  editSpacer
);
