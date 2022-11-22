uniform sampler2D textureFirst;
uniform sampler2D textureSecond;
uniform sampler2D textureThird;
uniform sampler2D textureFourth;

uniform float blendingFirstTexture;
uniform float blendingSecondTexture;
uniform float blendingThirdTexture;
uniform float blendingFourthTexture;

varying vec2 vUv;

void main(void) {
  vec4 rgba;
  vec4 firstTexture2D = texture2D(textureFirst, vUv);
  vec4 secondTexture2D = texture2D(textureSecond, vUv);
  vec4 thirdTexture2D = texture2D(textureThird, vUv);
  vec4 fourthTexture2D = texture2D(textureFourth, vUv);

  if (fourthTexture2D.a < .01 && blendingFourthTexture > 0.5) discard;
  if (thirdTexture2D.a < .045 && blendingThirdTexture > 0.5) discard;
  if (secondTexture2D.a < .045 && blendingSecondTexture > 0.5) discard;
  if (firstTexture2D.a < .045 && blendingFirstTexture > 0.5) discard;

  rgba =
  firstTexture2D.rgba * blendingFirstTexture +
  secondTexture2D.rgba * blendingSecondTexture +
  thirdTexture2D.rgba * blendingThirdTexture +
  (fourthTexture2D.rgba) * blendingFourthTexture;
  gl_FragColor = vec4(rgba.rgb * 1.15, rgba.a);
}
