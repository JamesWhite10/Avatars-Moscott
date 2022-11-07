varying vec2 vUv;

uniform sampler2D uDiffuseMap;
uniform sampler2D uHeightMap;
uniform float uTime;

void main(void)
{
  float height = texture2D(uHeightMap, vUv).r;
  vec4 color = texture2D(uDiffuseMap, vUv);

  if (color.a < .7) discard;
  if (height < uTime) discard;
  if (height < (uTime + 0.0000001)) color = vec4(0.0, 0.0, 0.0, 1.0);
  gl_FragColor = vec4(color.rgb, 0.8);
}
