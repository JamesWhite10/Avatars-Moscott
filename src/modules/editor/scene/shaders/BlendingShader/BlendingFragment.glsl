uniform sampler2D textureFirst;
uniform sampler2D textureSecond;

uniform float blendingFirstTexture;
uniform float blendingSecondTexture;

varying vec2 vUv;

void main(void) {
  vec3 rgb;
  vec4 firstTexture2D = texture2D(textureFirst, vUv);
  vec4 secondTexture2D = texture2D(textureSecond, vUv);

  if (firstTexture2D.a < .5) discard;
  if (secondTexture2D.a < .5) discard;

  rgb = firstTexture2D.rgb * blendingFirstTexture + secondTexture2D.rgb * blendingSecondTexture;
  gl_FragColor = vec4(rgb, 1.0);
}
