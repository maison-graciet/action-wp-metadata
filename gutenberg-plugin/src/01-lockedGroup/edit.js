import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function Edit( props ) {
  const { attributes } = props;
  const Tag = attributes.tagName;
  const blockProps = useBlockProps();
  return (
    <> 
      <Tag {...blockProps} className={attributes.variation + " " + blockProps.className}>
        <InnerBlocks
          orientation={ attributes.orientation }
          allowedBlocks={ attributes.allowedBlocks }
          template={ attributes.template }
          templateLock={ attributes.templateLock }
        />
      </Tag>
    </>
  );
}
