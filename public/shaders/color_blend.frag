uniform float maxY; // Maximum absolute value of Y
uniform vec3 colorA; // Color at the extremes
uniform vec3 colorB; // Color at the middle

varying float posY; // Passed from the vertex shader

#include <clipping_planes_pars_fragment>

void main() {
    #include <clipping_planes_fragment>

    // Discard the fragment if the position is not valid
    if (posY != posY || posY == 0.0) {
        discard;
    }

    // Normalize posY to the range [0, 1] where 0 is the bottom, 0.5 is middle (Y=0), 1 is top
    float normalizedY = (posY + maxY) / (2.0 * maxY);
    float blendFactor = abs(normalizedY - 0.5) * 2.; // Calculate blend factor

    // Mix the colors based on the distance from the middle
    vec3 color = mix(colorB, colorA, blendFactor);
    gl_FragColor = vec4(color, 0.8); // Output the final color with 50% opacity
}
