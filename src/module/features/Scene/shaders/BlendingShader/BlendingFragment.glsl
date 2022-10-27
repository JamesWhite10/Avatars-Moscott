uniform sampler2D miraTexture;
uniform sampler2D yukiTexture;
uniform float u_miraBlending;
uniform float u_yukiBlending;

varying vec2 vUv;

void main(void) {
  vec3 c;
  vec4 miraTexture2D = texture2D(miraTexture, vUv);
  vec4 yukiTexture2D = texture2D(yukiTexture, vUv);
  if ( miraTexture2D.a < .5 ) discard;
  if ( yukiTexture2D.a < .5 ) discard;
  c = miraTexture2D.rgb * u_miraBlending + yukiTexture2D.rgb * u_yukiBlending;
  gl_FragColor = vec4(c, 1.0);
}
