// Ask Figma to open the window
figma.showUI(__html__);

// Wait for the window to send a message to the plugin
figma.ui.onmessage = data => {
  const frameSize = 800;
  const frame = figma.createFrame();
  frame.resizeWithoutConstraints(frameSize, frameSize);

  frame.x = figma.viewport.center.x - (frameSize / 2);
  frame.y = figma.viewport.center.y - (frameSize / 2);

  // The string path of our star
  let pathData = '';
  // Retrieve the outer & inner data from the submitted form
  let outsideRadius = data.outer;
  let insideRadius = data.inner;
  // To draw a star we need to loop through its 10 points
  // We need to loop 11 times to close the path back to the first point
  for (let i = 0; i <= 10; i++) {
    // The angle of the point from 0 to two pi (0 -> 360deg)
    let angle = i / 10 * Math.PI * 2;
    // Calculate the x & y coordinates from the angle
    let x = Math.cos(angle - Math.PI / 2);
    let y = Math.sin(angle - Math.PI / 2);

    // Only for the first point we want to move instead of making a line
    if (i === 0) {
      pathData = `M ${x * outsideRadius} ${y * outsideRadius}`;
    } else {
      if (i % 2 === 1) {
        // If the point is odd, calculate the coordinates along the inner radius
        pathData += ` L ${x * insideRadius} ${y * insideRadius}`;
      } else {
        // Else, for even points, calculate along the outside radius
        pathData += ` L ${x * outsideRadius} ${y * outsideRadius}`;
      }
    }
  }

  // Create a vector element
  const node = figma.createVector();
  // Define the path properties
  node.vectorPaths = [{
      windingRule: 'NONZERO',
      data: pathData
  }];
  // Center the star in the center of the frame
  node.x = (frameSize - (outsideRadius * 2)) / 2;
  node.y = (frameSize - (outsideRadius * 2)) / 2;
  // Append the star to the frame
  frame.appendChild(node);
  // Define a single stroke with a random color
  node.strokes = [{
      type: 'SOLID',
      color: {r: Math.random(), g: Math.random(), b: Math.random()}
  }];
}