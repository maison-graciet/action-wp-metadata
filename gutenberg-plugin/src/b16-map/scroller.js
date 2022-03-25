export default function scrollParentToChild(parent, child) {
  //get parent & child boxes
  let boxes = {
    parent: parent.getBoundingClientRect(),
    child: child.getBoundingClientRect(),
  };

  const isChildViewable = (boxes.child.top >= boxes.parent.top)
    && (boxes.child.bottom <= boxes.parent.top + parent.clientHeight);
    
  if (!isChildViewable) {
    const scrollTop = boxes.child.top - boxes.parent.top;
    const scrollBot = boxes.child.bottom - boxes.parent.bottom;
    if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
      // we're near the top of the list
      parent.scrollTop += scrollTop;
    } else {
      // we're near the bottom of the list
      parent.scrollTop += scrollBot;
    }
  }
}
