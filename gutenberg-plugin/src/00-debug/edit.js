import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import { useState } from "@wordpress/element";
/* eslint-disable no-console */
export default function Edit() {
  const blockProps = useBlockProps();
  const selecCoreBlockEditor = wp.data.select("core/block-editor");
  const selecCoreBlocks = wp.data.select("core/blocks");
  const [eventOn, setEvent] = useState(false);
  return (
    <> 
      <InspectorControls>
      </InspectorControls>
      <div { ...blockProps }>
        <Button
          style={{ display: "block", marginBottom: ".2rem", marginTop: ".2rem" }}
          className={"is-primary"}
          onClick={
            () => {
              setEvent(true);
              setTimeout(() => {
                document.querySelector("body").addEventListener("click",(e) => {
                  setEvent(false);
                  let getClientId = (element) => {
                    if (element.getAttribute("data-block")) {
                      return element.getAttribute("data-block");
                    } else {
                      return getClientId(element.parentElement);
                    }
                  };
                  try {
                    let id = getClientId(e.target);
                    const allInfosBlocks = selecCoreBlockEditor.getBlock(id);
                    const name = allInfosBlocks.name;
                    const blockType = selecCoreBlocks.getBlockType(name);
                    console.info("Toutes les infos du bloc : ", allInfosBlocks);
                    console.info("Information du type de bloc : ", blockType);
                  } catch {
                    console.warn("No parent block");
                  }
                }, { once: true });
              }, 500);
            }
          }>
          {
            eventOn
              ? "Cliquez sur un bloc pour loguer les informations"
              : "Cliquez ici et récupérer les informations d'un bloc" 
          }
        </Button>
        <Button
          className={"is-primary"}
          style={{ display: "block", marginBottom: ".2rem", marginTop: ".2rem" }}
          onClick={() => { console.info(wp.data.select("core/editor").getEditedPostContent()); }}
        >Loguer le HTML de la page</Button>
        <Button 
          className={"is-primary"}
          onClick={
            () => {
              console.info(selecCoreBlocks.getBlockTypes());
            }
          }> Loguer l&apos;ensemble des blocs disponibles</Button>
      </div>
    </>
  );
}
/* eslint-enable no-console */
