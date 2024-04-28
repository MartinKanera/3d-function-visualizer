uniform float minY; // Minimum absolute value of Y
uniform float maxY; // Maximum absolute value of Y
uniform vec3 colorMaxY;
uniform vec3 colorZero;
uniform vec3 colorMinY;

varying float posY; // Passed from the vertex shader

#include <clipping_planes_pars_fragment>

vec3 interpolateColor(float y, float minY, float middlePoint, float maxY, vec3 colorMinY, vec3 colorZero, vec3 colorMaxY) {
    // Determine the mix factors for color interpolation
    float ratio = (y - minY) / (maxY - minY);
    vec3 color;
    if (y < middlePoint) {
        // Interpolate between colorMinY and colorZero for y values less than mid
        float mixFactor = (y - minY) / (middlePoint - minY);
        color = mix(colorMinY, colorZero, mixFactor);
    } else {
        // Interpolate between colorZero and colorMaxY for y values greater than mid
        float mixFactor = (y - middlePoint) / (maxY - middlePoint);
        color = mix(colorZero, colorMaxY, mixFactor);
    }
    return color;
}

void main() {
    #include <clipping_planes_fragment>

    // Discard the fragment if the position is not valid
    if (posY != posY || posY == 0.01) {
        discard;
    }

    vec3 color = interpolateColor(posY, minY, (maxY + minY) / 2.0, maxY, colorMinY, colorZero, colorMaxY);
    gl_FragColor = vec4(color, 1.); // Output the final color with 50% opacity
}
