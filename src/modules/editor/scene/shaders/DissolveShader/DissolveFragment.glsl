varying vec2 vUv;

uniform sampler2D uDiffuseMap;
uniform sampler2D uHeightMap;
uniform float uTime;

struct DirectionalLight {
  vec3 direction;
  vec3 color;
};

uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];

void main(void)
{
  vec3 r = directionalLights[0].color;
  float height = texture2D(uHeightMap, vUv).r;
  vec4 color = texture2D(uDiffuseMap, vUv);

  if (color.a < .7) discard;
  if (height < uTime) discard;
  if (height < (uTime + 0.0000001)) color = vec4(0.0, 0.0, 0.0, 1.0);

  if (color.r < 0.05 && color.b < .1) gl_FragColor = vec4((color.r * r.r) * 1.2, (color.g * r.g) * 1.2, (color.b * r.b) * 1.2, color.a);
  else gl_FragColor = vec4(color.r * (r.r * 0.5), color.g * (r.g * 0.55), color.b * (r.b * 0.55), color.a);
}
