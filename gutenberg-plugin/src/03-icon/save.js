export default function save( props ) {
  const Tag = props.attributes.tagName;
  return <>
    <Tag className={ "icon "+props.attributes.iconName+" "+props.attributes.iconColor }>{ props.attributes.iconName }</Tag>
  </>;
}
