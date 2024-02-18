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
      ctx.strokeStyle = "rgba(255, 255, 255, 0.743)";
      ctx.lineWidth = 5;

      // Draw rectangle
      // ctx.roundRect(10,20,80,80,[30]);
      ctx.beginPath();
      // ctx.rect(xMin, yMin, width, height);
      ctx.roundRect(xMin, yMin, width, height,[7]);
      ctx.stroke();
      
  });
};
