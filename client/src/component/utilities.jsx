export function drawRect(faces, ctx, trackedPersons) {
    // Ensure faces is an array before attempting to iterate
    if (!Array.isArray(faces)) {
        console.error("Invalid input. Expected an array.");
        return;
    }
    // Set styling
    ctx.strokeStyle = "green";
    ctx.lineWidth = 5;
    ctx.font = "25px Arial";
    ctx.fillStyle = "green";

    // Loop through each detected face
    faces.forEach((face, index) => {
        // Extract box coordinates
        const { xMin, yMin, width, height } = face.box;

<<<<<<< HEAD
        // Draw rectangle
        ctx.beginPath();
        ctx.rect(xMin, yMin, width, height);
        ctx.stroke();

        // Draw ID for the corresponding tracked person
        const trackedPerson = trackedPersons[index];
        if (trackedPerson) {
            ctx.fillText("ID: " + trackedPerson.id, xMin, yMin - 10);
        }
    });
}
=======
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
>>>>>>> b6c35c11f28a45b631354e690b0209e8a8967d0d
