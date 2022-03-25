import { useBlockProps } from "@wordpress/block-editor";
import "./content.scss";

export default function Edit() {
  const blockProps = useBlockProps();
  return (
    <> 
      <div { ...blockProps }>
        <p>Ce bloc sera remplacé par le contenu adapté lors de la consultation du site.</p>
      </div>
    </>
  );
}
