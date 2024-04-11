# BreadcrumbsImageWeightedVoronoiStipplingJS

The repository contains a complete code implementing image processing using the "weighted Voronoi stippling" method. This technique involves placing points on the image in such a way that their density corresponds to the brightness of the respective area. The brighter the area, the more points will be assigned to it, creating smooth transitions and details.

Weighted Voronoi stippling is a visualization technique that aims to create an effect similar to hand-drawn sketches by distributing points on an image based on its brightness.

![image](https://github.com/kamil-janusz-kalinowski/ImageWeightedVoronoiStipplingJS/assets/143912944/d5a22b6f-e435-4732-8a2a-5f2e33168007)

## Parameters:
The repository also provides the ability to modify various parameters, such as the number of points or flags determining the color display method. Below are the variables that users can modify to customize the effect to their preferences:

numPoints: the number of points generated for Voronoi stippling.

isColorDisp: a flag indicating whether colors are displayed.

radiusDot: an array containing the minimum and maximum radius of the points.

brightnessThreshold: the brightness threshold after which a point is created.

doInversion: a flag indicating whether to invert the image's brightness.

rescale_factor: scaling factor.

move_factor: point movement factor.

This allows users to experiment with different settings to achieve the desired visual effect for their images.
