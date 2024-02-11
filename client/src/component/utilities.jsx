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
