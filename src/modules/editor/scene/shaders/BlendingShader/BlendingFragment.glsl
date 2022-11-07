uniform sampler2D textureFirst;
uniform sampler2D textureSecond;

uniform bool isPortal;

uniform float blendingFirstTexture;
uniform float blendingSecondTexture;

varying vec2 vUv;

void main(void) {
  vec4 rgba;
  float a;
  vec4 firstTexture2D = texture2D(textureFirst, vUv);
  vec4 secondTexture2D = texture2D(textureSecond, vUv);

  if (firstTexture2D.a < .02) discard;
  if (secondTexture2D.a < .02) discard;

  if (isPortal == true) {
    if (firstTexture2D.r < 0.07) discard;
    if (secondTexture2D.r < 0.07) discard;
  }

  rgba = firstTexture2D.rgba * blendingFirstTexture + secondTexture2D.rgba * blendingSecondTexture;
  gl_FragColor = vec4(rgba);
}
