/*
* Project VIGIL v1.0
* @author Garrett Stache
* @authors [YOUR NAME(S) HERE]
*/

//helper function to randomly select a clip
function selectAddClip( comp,  currInd,  randNum, point) {
    //an array of blending modes
        var modes = [BlendingMode.ADD,
BlendingMode.ALPHA_ADD,
BlendingMode.CLASSIC_COLOR_BURN,
BlendingMode.CLASSIC_COLOR_DODGE,
BlendingMode.CLASSIC_DIFFERENCE,
BlendingMode.COLOR,
BlendingMode.COLOR_BURN,
BlendingMode.COLOR_DODGE,
BlendingMode.DANCING_DISSOLVE,
BlendingMode.DARKEN,
BlendingMode.DARKER_COLOR,
BlendingMode.DIFFERENCE,
BlendingMode.DISSOLVE,
BlendingMode.EXCLUSION,
BlendingMode.HARD_LIGHT,
BlendingMode.HARD_MIX,
BlendingMode.HUE,
BlendingMode.LIGHTEN,
BlendingMode.LIGHTER_COLOR,
BlendingMode.LINEAR_BURN,
BlendingMode.LINEAR_DODGE,
BlendingMode.LINEAR_LIGHT,
BlendingMode.LUMINESCENT_PREMUL,
BlendingMode.LUMINOSITY,
BlendingMode.MULTIPLY,
BlendingMode.NORMAL,
BlendingMode.OVERLAY,
BlendingMode.PIN_LIGHT,
BlendingMode.SATURATION,
BlendingMode.SCREEN,
BlendingMode.SILHOUETE_ALPHA,
BlendingMode.SILHOUETTE_LUMA,
BlendingMode.SOFT_LIGHT,
BlendingMode.STENCIL_ALPHA,
BlendingMode.STENCIL_LUMA,
BlendingMode.VIVID_LIGHT,
]
        var temp = [];
        //random divider to determine the out point of the inserted clip
        var lengthDivide = Math.round((Math.random() * 2)) + 2;
        //random opacity value, with a floor of 40
        var opacity = 100 - (Math.random()*60);
        //select a random mode
        var modeInd = Math.round(Math.random()*(modes.length - 1)) ;
        //add the selected footage (the item at index randNum in the project window)
        comp.layers.add(app.project.item(randNum));
        //Math to set the outpoint
        comp.layer(currInd).outPoint = comp.layer(currInd).outPoint / lengthDivide;
        //Math to set the inPoint
        comp.layer(currInd).inPoint = comp.layer(currInd).inPoint + (Math.random()*comp.layer(currInd).outPoint)/ lengthDivide;
        //off set the start point so that the inpoint matches the pointer
        comp.layer(currInd).startTime = point - comp.layer(currInd).inPoint;
        comp.layer(1).opacity.setValue(opacity);
        comp.layer(1).blendingMode = modes[modeInd];
        temp[0] = 0
        //move the pointer forward;
        temp[1] = Math.abs(comp.layer(currInd).outPoint - comp.layer(currInd).inPoint);
        return temp;
    }
//main function
 function  vigil() {
    var renderQ = app.project.renderQueue;
    var compName = "00001";
    var totalLayers = 0;
     //generates a random number of layers between 3 and 5
     //layers in this case means the maximum overlap of footage,
     //not the total number of layers in the composition
    var numLayer = Math.round(Math.random() * 3) + 3;
    if (numLayer > 5) {
        numLayer = 5;
    }
    alert(numLayer);
    var numClips = app.project.numItems;
    var usedClipArr = {};
    //Random attribute to determine the length of the composition
    //floating point value, in seconds
    var length = (Math.round(Math.random() * 15) + 5)*60.0;
    //Create new composition
    app.project.items.addComp(compName, 1280, 720, 1.0, length, 24.0);
    comp = app.project.item(1);
    //an array of in-points for each layer, which increment by the length of footage added
    var pointers = new Array(numLayer);
    //iterate over the array, instatiate pointers
    for (var i = 0; i < numLayer; i++) {
        pointers[i] = 0.0;
    }
    //integer value indicating number of pointers within the length of the comp
    var areInBounds = numLayer;
    var currInd = 1;
    //while loop, repeatedly iterates through the array of pointers until all are past
    //the end of the comp.
   while (areInBounds > 0) {
        for (var i = 0; i < pointers.length; i++) {
            totalLayers++;
           var randNum = Math.round(Math.random() * numClips) + 2;
           if (randNum > numClips) {
               randNum = numClips
           }
           while (randNum in usedClipArr && totalLayers< numClips) {
               randNum = Math.round(Math.random() * numClips) + 2;
                if (randNum > numClips) {
                     randNum = numClips
               }
           }
           usedClipArr[randNum] = true;
           var temp = selectAddClip(comp,  1, randNum, pointers[i]);
           //alert(temp[1]);
           var tempdist = temp[1];
           var pointdist = pointers[i];
           pointers[i] = tempdist + pointdist;
           //alert(i + ":" + pointers[i]);
           if (pointers[i] > length) {
               areInBounds--;
           }
           currInd++;
      }
  }
//add the comp to the render queue
   renderQ.items.add(comp);
//apply the codec H264 to the output (H264, .mp4, is a cross platform codec which both mac and PC have)
   renderQ.item(1).outputModule(1).applyTemplate("H.264");
// render
   renderQ.render();
   
}
vigil();