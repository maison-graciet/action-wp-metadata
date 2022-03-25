import { useBlockProps, RichText, InnerBlocks } from "@wordpress/block-editor";

export default function save( props ) {
  const { attributes} = props;
  const { title, defaultOpen } = attributes;
  const blockProps = useBlockProps.save();
  if (defaultOpen) {
    blockProps.open = true;
  }
  return (
    <details { ...blockProps }>
      <RichText.Content
        tagName="summary"
        value={title}
      />
      <InnerBlocks.Content />
    </details>
  );
}
