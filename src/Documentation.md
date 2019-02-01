## Tech Stack
React v16.7
 - input:  For uploading image.
 - canvas:  For adding polygons over image to be coloured.
 - map: For rendering the saved polygons over the canvas.

## How to Use
### Upload image
 - Click on the  chooose file input to upload an image from your computer's directory. 
 - The size of the image should be greater than 1MB.

### Mark Polygon 
- Click anywhere on the image to mark a particular point.
- After marking second point a line would be shown between the two points.
- Mark all points to form a closed polygon.
- Click on the add polygon button to add this polygon area to the list of areas to color.
- Different regions can be marked seperately by selcting individual ares.

- Click Complete mapping to save all the mappings.

### Coloring regions
- Drag any color to the marked region to color that region with selected color.
- Click Reset color to reset coloring.
- Click Reset Mapping to clear the mapping.

## How its working
### Upload Image
- Used input tag for uploading the image, 
- Upon successful uploading, a check is performed to verify size of image to be greater than 1MB.
- State is changed to Marking on successful image upload.

### Create Marking
- Uploaded image is rendered.
- A convas of same dimension is rendered over the image. Upon clicking on the canvas, its co-ordinates are stored in state in an array. On Multiple clicks on canvas, line is drean between the last two points in the current polygon array.
- On clicking Add polygon, it is added to a array of polygon.
- On clicking Complete marking, Marking state is set to false.

### Coloring MArked Regions
- Image is render with canvas on top of it and map of all the coordiantes is set on canvas with on drag over and onDrop event.

- Color Palette has onDragstart event that sets the color code in event data upon drag start.
- On DragOver event on map region, transiton is shown.
- On onDrop event, canvas context fillstyle is set to the data received from event (set by palette color).After this, the selected polygon is coloured with the dropped color.


