// Coding Train / Daniel Shiffman
// Weighted Voronoi Stippling
// https://thecodingtrain.com/challenges/181-image-stippling


//parameters
let numPoints = 2400;
let isColorDisp = false;
let radiusDot = [0, 14];
let brightnessThreshold = 0.1;
let doInversion = false;
let rescale_factor = 1;
let move_factor = 0.5;

//variables
let points = [];
centroids = [];
let delaunay, voronoi;
let img;
let polygons, cells, centroids, weights, counts, avgWeights;
let maxWeight = 0;


function preload() {
  img = loadImage("materials/download.jpg");
}

function setup() {
  preprocessingImage()
  createCanvas(img.width, img.height);
  generatePoints();

  updateVoronoi();
}

function draw() {
  background(255);

  setupVariables();

  calculateCentroidsAndWeights();

  calculateAverageWeightsAndUpdateMax();

  assignCentroids();

  movePoints();

  displayPoints();

  updateVoronoi();
}

function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}

function generatePoints(){
  for (let i = 0; i < numPoints; i++) {
    let x = random(width);
    let y = random(height);
    let col = img.get(x, y);
    if (random(100) > brightness(col)) {
      points.push(createVector(x, y));
    } else {
      i--;
    }
  }
}

function preprocessingImage(){
  img.resize(img.width * rescale_factor, img.height * rescale_factor);
  if (doInversion) img.filter(INVERT);
}

function calculateCentroidsAndWeights() {
  let delaunayIndex = 0;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let index = (i + j * width) * 4;
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
}

function movePoints(){
  for (let i = 0; i < points.length; i++) {
    points[i].lerp(centroids[i], move_factor);
  }
}

function displayPoints(){
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

function updateVoronoi(){
  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);
}

function calculateAverageWeightsAndUpdateMax() {
  let maxWeight = 0;
  for (let i = 0; i < centroids.length; i++) {
    if (weights[i] > 0) {
      centroids[i].div(weights[i]);
      avgWeights[i] = weights[i] / (counts[i] || 1);
      if (avgWeights[i] > maxWeight) {
        maxWeight = avgWeights[i];
      }
    }
  }
}

function assignCentroids() {
  for (let i = 0; i < centroids.length; i++) {
    if (weights[i] <= 0) {
      centroids[i] = points[i].copy();
    }
  }
}

function setupVariables(){
  polygons = voronoi.cellPolygons();
  cells = Array.from(polygons);
  centroids = new Array(cells.length);
  weights = new Array(cells.length).fill(0); 
  counts = new Array(cells.length).fill(0);
  avgWeights = new Array(cells.length).fill(0);

  for (let i = 0; i < centroids.length; i++) {
    centroids[i] = createVector(0, 0);
  }
}






//----------------------------------------

// Coding Train / Daniel Shiffman
// Weighted Voronoi Stippling
// https://thecodingtrain.com/challenges/181-image-stippling

let points = [];

let delaunay, voronoi;

let img;

let numPoints = 2400;
let isColorDisp = false;
let radiusDot = [0, 14];
let brightnessThreshold = 0.1;
let doInversion = false;
let rescale_factor = 1;
let move_factor = 0.5;
let maxWeight = 0;

function preload() {
  img = loadImage("materials/download.jpg");
}

function setup() {
  preprocessingImage()
  createCanvas(img.width, img.height);
  generatePoints();

  updateVoronoi();
}

function draw() {
  background(255);

  let polygons = voronoi.cellPolygons();
  let cells = Array.from(polygons);
  let centroids = new Array(cells.length);
  let weights = new Array(cells.length).fill(0); 
  let counts = new Array(cells.length).fill(0);
  let avgWeights = new Array(cells.length).fill(0);

  for (let i = 0; i < centroids.length; i++) {
    centroids[i] = createVector(0, 0);
  }

  img.loadPixels();

  calculateCentroidsAndWeights();

  calculateAverageWeightsAndUpdateMax(centroids, weights, counts, avgWeights);

  assignCentroids(centroids, weights, points);

  movePoints();

  displayPoints(maxWeight);

  updateVoronoi();
}

function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}

function generatePoints(){
  for (let i = 0; i < numPoints; i++) {
    let x = random(width);
    let y = random(height);
    let col = img.get(x, y);
    if (random(100) > brightness(col)) {
      points.push(createVector(x, y));
    } else {
      i--;
    }
  }
}

function preprocessingImage(){
  img.resize(img.width * rescale_factor, img.height * rescale_factor);
  if (doInversion) img.filter(INVERT);
}

function calculateCentroidsAndWeights() {
  let delaunayIndex = 0;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let index = (i + j * width) * 4;
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
}

function movePoints(){
  for (let i = 0; i < points.length; i++) {
    points[i].lerp(centroids[i], move_factor);
  }
}

function displayPoints(maxWeight){
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

function updateVoronoi(){
  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);
}


function calculateAverageWeightsAndUpdateMax(centroids, weights, counts, avgWeights) {
  let maxWeight = 0;
  for (let i = 0; i < centroids.length; i++) {
    if (weights[i] > 0) {
      centroids[i].div(weights[i]);
      avgWeights[i] = weights[i] / (counts[i] || 1);
      if (avgWeights[i] > maxWeight) {
        maxWeight = avgWeights[i];
      }
    }
  }
}

function assignCentroids(centroids, weights, points) {
  for (let i = 0; i < centroids.length; i++) {
    if (weights[i] <= 0) {
      centroids[i] = points[i].copy();
    }
  }
}