
//parameters
let numPoints = 1000;
let isColorDisp = false;
let radiusDot = [0, 12];
let brightnessThreshold = 0.1;
let doInversion = true;
let rescale_factor = 1;
let move_factor = 0.5;

//variables
let points = [];
let centroids = [];
let delaunay, voronoi;
let img;
let maxWeight = 0;
let isLoadingImage = false;
let isImageChanged = false;
let avgWeights
let weights, counts

function preload() {
  img = loadImage("materials/cup_1.png");
}

function setup() {
  handleFileSelect();
  preprocessingImage()
  let canvas = createCanvas(img.width, img.height);
  canvas.parent('drop-area');
  generatePoints();

  updateVoronoi();
  initializeVoronoiVariables();
}

function draw() {
  if (isLoadingImage) {
    return;
  }
  if (isImageChanged) {
    preprocessingImage();
    points = [];
    generatePoints();
    updateVoronoi();
    isImageChanged = false;
  }

  background(255);
  initializeVoronoiVariables();
  
  calculateCentroidsAndWeights(weights, counts);

  calculateWeights(weights, counts);

  assignCentroids(weights);

  movePoints();

  displayPoints(avgWeights, maxWeight);

  updateVoronoi();
}




// Voronoi functions

function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}

function updateVoronoi(){
  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, img.width, img.height]);
}

// Point functions
function generatePoints(){
  for (let i = 0; i < numPoints; i++) {
    let x = random(img.width);
    let y = random(img.height);
    let col = img.get(x, y);
    if (random(100) > brightness(col)) {
      points.push(createVector(x, y));
    } else {
      i--;
    }
  }
}

function movePoints(){
  for (let i = 0; i < points.length; i++) {
    points[i].lerp(centroids[i], move_factor);
  }
}

function displayPoints(avgWeights, maxWeight){
  for (let i = 0; i < points.length; i++) {
    let v = points[i];
    let col = img.get(v.x, v.y);
    let sw = 0;
    if (isColorDisp){
      stroke(col);
    }else{
      stroke(0);
    }

    let value = avgWeights[i]-brightnessThreshold;
    value = value /(1-brightnessThreshold);

    sw = map(value, 0, maxWeight, radiusDot[0], radiusDot[1], true);

    strokeWeight(sw);
    point(v.x, v.y);
  }
}

function assignCentroids(weights) {
  for (let i = 0; i < centroids.length; i++) {
    if (weights[i] <= 0) {
      centroids[i] = points[i].copy();
    }
  }
}

// Image preprocessing functions
function preprocessingImage(){
  img.resize(img.width * rescale_factor, img.height * rescale_factor);
  if (doInversion) img.filter(INVERT);
}

function calculateCentroidsAndWeights(weights, counts) {
  img.loadPixels();
  let delaunayIndex = 0;
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      let index = (i + j * img.width) * 4;
      let r = img.pixels[index + 0];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let bright = (r + g + b) / 3;
      let weight = 1 - bright / 255;
      delaunayIndex = delaunay.find(i, j, delaunayIndex);
      centroids[delaunayIndex].x += i * weight;
      centroids[delaunayIndex].y += j * weight;
      weights[delaunayIndex] += weight;
      counts[delaunayIndex]++;
    }
  }
  img.updatePixels();


}

function calculateWeights(weights, counts) {
  avgWeights = new Array(centroids.length).fill(0);
  maxWeight = 0;
  for (let i = 0; i < centroids.length; i++) {
    if (weights[i] > 0) {
      centroids[i].div(weights[i]);
      avgWeights[i] = weights[i] / (counts[i] || 1);
      if (avgWeights[i] > maxWeight) {
        maxWeight = avgWeights[i];
      }
    }
  }
  return {avgWeights, maxWeight};
}

// Setup function
function initializeVoronoiVariables(){
  polygons = voronoi.cellPolygons();
  cells = Array.from(polygons);
  centroids = new Array(cells.length);
  weights = new Array(cells.length).fill(0); 
  counts = new Array(cells.length).fill(0);
  avgWeights = new Array(cells.length).fill(0);


}

// Drag and drop function and handlers
function handleFileSelect() {
  let dropArea = document.getElementById('drop-area');

  dropArea.addEventListener('dragover', handleDragOver, false);
  dropArea.addEventListener('dragenter', handleDragEnter, false);
  dropArea.addEventListener('dragleave', handleDragLeave, false);
  dropArea.addEventListener('drop', handleDrop, false);
}

function handleDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDragEnter(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  let dt = e.dataTransfer;
  let files = dt.files;

  handleFiles(files);
}

function handleFiles(files) {
  isLoadingImage = true;

  let file = files[0];
  let imageType = /^image\//;

  if (!imageType.test(file.type)) {
    console.log('not a valid image file');
    isLoadingImage = false;
    return;
  }

  let reader = new FileReader();
  reader.onload = function(e) {
    img = loadImage(e.target.result, () => {
      resizeCanvas(img.width, img.height);
      let canvas = createCanvas(img.width, img.height);
      canvas.parent('drop-area');
      handleFileSelect();
      isLoadingImage = false;
    });
  };
  reader.readAsDataURL(file);
  isImageChanged = true;
}

// Setup function
function initializeVoronoiVariables(){
  let polygons = voronoi.cellPolygons();
  let cells = Array.from(polygons);
  centroids = new Array(cells.length);
  weights = new Array(cells.length).fill(0); 
  counts = new Array(cells.length).fill(0);

  for (let i = 0; i < centroids.length; i++) {
    centroids[i] = createVector(0, 0);
  }
}
