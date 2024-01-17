export const drawRect = (detections, ctx) => {
  // Ensure detections is an array before attempting to iterate
  if (!Array.isArray(detections)) {
      console.error("Invalid input. Expected an array.");
      return;
  }

  // Loop through each prediction
  detections.forEach(prediction => {
      // Extract box coordinates
      const { xMin, yMin, width ,height } = prediction.box;

      // Set styling
      ctx.strokeStyle = "green";
      ctx.lineWidth = 5;

      // Draw rectangle
      ctx.beginPath();
      ctx.rect(xMin, yMin, width, height);
      ctx.stroke();
  });
};
