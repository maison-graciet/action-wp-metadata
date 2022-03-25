import { useBlockProps, InnerBlocks, RichText } from "@wordpress/block-editor";

export default function save(props) {
  const { attributes } = props;
  const { title, note } = attributes;
  const blockProps = useBlockProps.save();
  return (
    <div { ...blockProps } >
      { title.length ? (
        <div className="form-title">
          <RichText.Content
            tagName="h2"
            value={ title }
          />
        </div>):(<></>) }
      <div className="form-content">
        <InnerBlocks.Content/>
      </div>
      <div className="footnote">
        <RichText.Content
          tagName= "div"
          value={ note }
          multiline="p"
        />
      </div>
    </div>
  );
}
