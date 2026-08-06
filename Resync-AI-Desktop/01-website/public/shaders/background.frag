precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv -= 0.5;
  uv.x *= u_resolution.x / u_resolution.y;
  float t = u_time * 0.15;
  float band = sin(uv.x * 6.0 + t) * 0.08;
  float edge = smoothstep(0.35, 0.0, abs(uv.y) + abs(uv.x) * 0.6 + band);
  vec3 glow = vec3(0.35, 0.38, 0.95) * edge;
  gl_FragColor = vec4(glow * (1.0 - length(uv)), 1.0);
}
