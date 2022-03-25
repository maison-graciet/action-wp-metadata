import { InnerBlocks, useBlockProps  } from "@wordpress/block-editor";

export default function save(props) {
  const blockProps = useBlockProps.save();
  const Tag = props.attributes.tagName;
  return (<Tag {...blockProps} className={props.attributes.variation + " " + blockProps.className}>
    <InnerBlocks.Content/>
  </Tag>
  );
}
