import { styles, formats, global } from "../../../gracietco-gut.config.js";
import "./paragraph.js";
import "./group.js";
import "./list.js";
import "./heading.js";
import "./gallery.js";
import "./image.js";
import "./spacer.js";
import "./buttons.js";
import "./quote.js";
import "./cover.js";
import "./query.js";
import "./html.js";
import "./table.js";
import "./columns.js";
import "./post-terms.js";
import "./gravityForms.js";
import { addValidationButton } from "./validation.js";

/* block styles */
const fixStyles = (blocks) => {
  blocks.forEach(block => {
    if (block.styles.length) {
      block.styles.forEach(style => {
        wp.blocks.unregisterBlockStyle(block.name, style.name);
      });
    }
  });
  Object.entries(styles).forEach(block => {
    if (block[0] === "//") {
      return;
    }
    block[1].forEach(style => {
      wp.blocks.registerBlockStyle(block[0], style);
    });
  });
};

/* rich text format options */
const fixFormats = () => {
  formats.remove.forEach(toRemove => {
    wp.richText.unregisterFormatType(toRemove);
  });
};

/* add attributes "data-block" & "data-variation" to the sidebar ! */
const injectInsepctorClassName = async () => {
  wp.data.subscribe(() => {
    const sidebar = document.querySelector(".interface-interface-skeleton__sidebar");
    const toolbar = document.querySelector(".block-editor-block-contextual-toolbar");
    if (!sidebar) {
      return;
    }
    const bars = [sidebar, toolbar].filter(e => e);
    const selectedBlock = wp.data.select("core/block-editor").getSelectedBlock();
    if (selectedBlock) {
      bars.forEach(bar => {
        bar.setAttribute("data-block", selectedBlock.name);
        if (selectedBlock.attributes && selectedBlock.attributes.variation) {
          bar.setAttribute("data-variation", selectedBlock.attributes.variation || "");
        } else {
          bar.removeAttribute("data-variation");
        }
      });
    }
  });
};
const closeListener = wp.data.subscribe(() => {
  let ready = false;
  try {
    if (typeof window._wpLoadBlockEditor === "undefined") { //full-site editing
      ready = Array.isArray(wp.data.select("core/block-editor").getSettings().defaultTemplateTypes);
    } else {
      ready = wp.data.select("core/editor").__unstableIsEditorReady();
    }
  } catch {
    //~ NoOp
  }
  if (ready) {
    closeListener();
    fixStyles(wp.data.select("core/blocks").getBlockTypes());
    fixFormats();
    injectInsepctorClassName();
    if (global.forceValidation && wp.data.select("core/editor").getCurrentPostType() !== "template") {
      addValidationButton();
    }
  }
}); 
