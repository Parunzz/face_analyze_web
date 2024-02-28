export function drawRect(faces, ctx) {
  // Ensure faces is an array before attempting to iterate
  if (!Array.isArray(faces)) {
    console.error("Invalid input. Expected an array.");
    return;
  }
  // Set styling
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.font = "25px Arial";
  ctx.fillStyle = "white";

  // Loop through each detected face
  faces.forEach((face) => {
    // Extract box coordinates
    // const { xMin, yMin, width, height } = face.box;
    const { x, y, w, h } = face;
    // Set styling
    ctx.strokeStyle = "rgba(255, 255, 255, 0.743)";
    ctx.lineWidth = 5;

    // Draw rectangle
    // ctx.roundRect(10,20,80,80,[30]);
    ctx.beginPath();
    // ctx.rect(xMin, yMin, width, height);
    ctx.roundRect(x, y, w, h, [7]);
    ctx.stroke();

    // Draw ID for the corresponding tracked person
    // const trackedPerson = trackedPersons[index];
    // if (trackedPerson) {
    //     ctx.fillText("ID: " + trackedPerson.id, xMin, yMin - 10);
    // }

  });
};
