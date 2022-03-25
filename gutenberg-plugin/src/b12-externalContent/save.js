import { useBlockProps, InnerBlocks, RichText } from "@wordpress/block-editor";

export default function save(props) {
  const { attributes } = props;
  const {classNameVertical, isVideo, description, haveTranscript, transcript } = attributes;
  const blockProps = useBlockProps.save();
  return (
    <div { ...blockProps }
      className={ blockProps.className +" "+ classNameVertical }
    >
      <InnerBlocks.Content />
      { description.trim() !== ""  && (
        <RichText.Content
          tagName= "div"
          className="description mt-4"
          value={ description }
          multiline="p"
        />
      )}
      { isVideo && haveTranscript && transcript.trim() !== "" ? (
        <details>
          <summary>Transcription de la vidéo</summary>
          <RichText.Content
            tagName= "div"
            className="content"
            value={ transcript }
            multiline="p"
            data-aria-accordion-panel
          />
        </details>) : (<></>)
      }
    </div>
  );
}
