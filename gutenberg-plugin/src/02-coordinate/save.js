import { RichText, useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import { config } from "../../../gracietco-gut.config.js";

const blockConfig = config["06-coordinate"];

export default function save( props ) {
  const blockProps = useBlockProps.save();
  const { content, contentType } = props.attributes;
  const renderContent = () => {
    if (contentType === "p") {
      return (<RichText.Content { ...blockProps } tagName="p" value={ content } />);
    }
    if ((contentType[0] === "a")
      && (contentType.length === 1 || contentType[1] === "+")) {
      return (<a { ...blockProps } href={ (contentType.split("+")[1] || "") + content }>{ content }</a>);
    }
    const Tag = contentType;
    return (<Tag { ...blockProps }>{ content }</Tag>);
  };
  return (
    <>
      {
        blockConfig.iconSelector
          ? <InnerBlocks.Content />
          : (<></>)
      }
      { renderContent() }
    </>
  );
}
