// attribute vec4 position; passed in by THREE.js
varying float posY; // Pass Y-coordinate to fragment shader

#include <clipping_planes_pars_vertex>

void main() {
  posY = position.y;
  #include <begin_vertex>
  #include <project_vertex>
  #include <clipping_planes_vertex>
}
