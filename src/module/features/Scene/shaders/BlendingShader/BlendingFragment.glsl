uniform sampler2D firstTexture;
uniform sampler2D secondTexture;
uniform float blendingFistTexture;
uniform float blendingSecondTexture;

varying vec2 vUv;

void main(void) {
  vec3 rgb;
  vec4 firstTexture2D = texture2D(firstTexture, vUv);
  vec4 secondTexture2D = texture2D(secondTexture, vUv);
  if ( firstTexture2D.a < .5 ) discard;
  if ( secondTexture2D.a < .5 ) discard;
  rgb = firstTexture2D.rgb * blendingFistTexture + secondTexture2D.rgb * blendingSecondTexture;
  gl_FragColor = vec4(rgb, 1.0);
}
