export const drawRect = (detections, ctx) =>{
    // Loop through each prediction
    detections.forEach(prediction => {
  
      // Extract boxes and classes
      const [x, y, width, height] = prediction['bbox']; 
      const text = prediction['class']; 
      // Set styling
      ctx.strokeStyle = "green"
      ctx.font = '30px Arial';
  
      // Draw rectangles and text
      ctx.beginPath();   
      ctx.fillStyle = "green"
      ctx.fillText(text, x+(width/2), y-10);
      ctx.rect(x, y, width, height); 
      ctx.lineWidth = 5;
      ctx.stroke();
    });
  }