import { InnerBlocks } from "@wordpress/block-editor";

export default function save() {
  const output = hasCTA ? (<InnerBlocks.Content/>) : null;
  return output;
}
