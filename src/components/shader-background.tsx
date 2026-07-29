"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;
uniform vec4 u_space;
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

vec3 srgbToLinear(vec3 color) {
  return mix(
    color / 12.92,
    pow((color + 0.055) / 1.055, vec3(2.4)),
    step(0.04045, color)
  );
}

vec3 linearToSrgb(vec3 color) {
  return mix(
    color * 12.92,
    1.055 * pow(max(color, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, color)
  );
}

vec3 linToOklab(vec3 color) {
  float l = 0.4122214708 * color.r + 0.5363325363 * color.g + 0.0514459929 * color.b;
  float m = 0.2119034982 * color.r + 0.6806995451 * color.g + 0.1073969566 * color.b;
  float s = 0.0883024619 * color.r + 0.2817188376 * color.g + 0.6299787005 * color.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
  );
}

vec3 oklabToLin(vec3 color) {
  float l = color.x + 0.3963377774 * color.y + 0.2158037573 * color.z;
  float m = color.x - 0.1055613458 * color.y - 0.0638541728 * color.z;
  float s = color.x - 0.0894841775 * color.y - 1.2914855480 * color.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  );
}

vec3 mixColour(vec3 colorA, vec3 colorB, float amount) {
  if (u_oklab > 0.5) {
    vec3 labA = linToOklab(srgbToLinear(colorA));
    vec3 labB = linToOklab(srgbToLinear(colorB));
    return clamp(
      linearToSrgb(oklabToLin(mix(labA, labB, amount))),
      0.0,
      1.0
    );
  }
  return mix(colorA, colorB, amount);
}

vec3 palette(float position) {
  float count = max(u_colorCount - 1.0, 1.0);
  float scaled = clamp(position, 0.0, 1.0) * count;
  vec3 color = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < count) {
      color = mixColour(
        color,
        u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(scaled - float(i), 0.0, 1.0))
      );
    }
  }
  return color;
}

vec3 hueRotate(vec3 color, float angle) {
  const mat3 toYIQ = mat3(
    0.299, 0.596, 0.211,
    0.587, -0.274, -0.523,
    0.114, -0.322, 0.312
  );
  const mat3 toRGB = mat3(
    1.0, 1.0, 1.0,
    0.956, -0.272, -1.106,
    0.621, -0.647, 1.703
  );
  vec3 yiq = toYIQ * color;
  float cosine = cos(angle);
  float sine = sin(angle);
  yiq = vec3(
    yiq.x,
    yiq.y * cosine - yiq.z * sine,
    yiq.y * sine + yiq.z * cosine
  );
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 point, float time) {
  float y = uv.y
    + sin(uv.x * (3.0 + u_intensity * 9.0) + time * 0.8) * 0.08
    + (fbm(point * 2.0 + time * 0.1) - 0.5) * u_intensity * 0.6;
  return palette(y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 point = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = point - cursor;
    if (u_cursorEffect < 0.5) {
      point += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        point -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cosine = cos(cursorAngle);
        float sine = sin(cursorAngle);
        point = cursor + mat2(cosine, -sine, sine, cosine) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0
        );
        point -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  uv = point * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  point *= u_scale;

  if (abs(u_rotate) > 0.0001) {
    float cosine = cos(u_rotate);
    float sine = sin(u_rotate);
    point = mat2(cosine, -sine, sine, cosine) * point;
  }

  point += u_offset;
  if (u_drift > 0.0001) {
    point += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  }

  if (u_warp > 0.0) {
    point += u_warp * (
      vec2(
        fbm(point * u_detail + u_seed),
        fbm(point * u_detail + vec2(5.2, 1.3))
      ) - 0.5
    );
  }

  vec3 color;
  if (u_blur > 0.0) {
    float edge = u_blur;
    float pointEdge = edge * u_scale;
    vec2 uvEdge = vec2(edge)
      * min(u_resolution.x, u_resolution.y)
      / u_resolution.xy;
    color = shade(uv, point, u_time) * 0.36;
    color += shade(uv + vec2(uvEdge.x, 0.0), point + vec2(pointEdge, 0.0), u_time) * 0.16;
    color += shade(uv - vec2(uvEdge.x, 0.0), point - vec2(pointEdge, 0.0), u_time) * 0.16;
    color += shade(uv + vec2(0.0, uvEdge.y), point + vec2(0.0, pointEdge), u_time) * 0.16;
    color += shade(uv - vec2(0.0, uvEdge.y), point - vec2(0.0, pointEdge), u_time) * 0.16;
  } else {
    color = shade(uv, point, u_time);
  }

  if (abs(u_contrast - 1.0) > 0.0001) {
    color = (color - 0.5) * u_contrast + 0.5;
  }
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(luma), color, u_saturation);
  }
  if (abs(u_hue) > 0.0001) {
    color = hueRotate(color, u_hue);
  }
  if (abs(u_brightness) > 0.0001) {
    color += u_brightness;
  }
  if (u_vignette > 0.0001) {
    float vignetteDistance = length(screenUv - 0.5) * 1.41421356;
    color *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vignetteDistance);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5) {
    color += (vec3(0.18) + color * 0.12) * cursorMask * u_cursorStrength;
  }
  if (u_grain > 0.0001) {
    color += (
      grainHash(gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5
    ) * u_grain;
  }

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

const UNIFORMS = {
  colors: [
    [0.0941176471, 0.2705882353, 0.3411764706],
    [0, 0.4980392157, 0.6784313725],
    [0.3411764706, 0.6980392157, 0.7960784314],
    [0.9176470588, 0.9764705882, 1],
    [0, 0.4980392157, 0.6784313725],
    [0, 0.4980392157, 0.6784313725],
    [0, 0.4980392157, 0.6784313725],
    [0, 0.4980392157, 0.6784313725],
  ] as [number, number, number][],
  colorCount: 5,
  scale: 1.88,
  intensity: 0.43,
  paramA: 0.71,
  warp: 0.33,
  detail: 1.728,
  contrast: 0.915,
  brightness: -0.03,
  saturation: 1.28,
  hue: 0,
  vignette: 0,
  blur: 0,
  grain: 0,
  seed: 3165,
  rotate: 3.4034,
  offsetX: 0.1,
  offsetY: -0.25,
  drift: 0.156,
  cursorEnabled: true,
  cursorEffect: 2,
  cursorStrength: 0.04,
  cursorRadius: 0.412,
  oklab: 0,
  timeScale: 0.746,
};

const pendingContextReleases = new WeakMap<HTMLCanvasElement, number>();

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const canvasElement: HTMLCanvasElement = canvas;

    const pendingRelease = pendingContextReleases.get(canvasElement);
    if (pendingRelease !== undefined) {
      window.clearTimeout(pendingRelease);
      pendingContextReleases.delete(canvasElement);
    }

    const context = canvasElement.getContext("webgl", { antialias: false });
    if (!context) return;
    const gl: WebGLRenderingContext = context;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Unable to create WebGL shader.");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) ?? "Unknown shader error.";
        gl.deleteShader(shader);
        throw new Error(message);
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, VERT);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!program) throw new Error("Unable to create WebGL program.");

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) ?? "Unknown WebGL link error.";
      gl.deleteProgram(program);
      throw new Error(message);
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      colors: gl.getUniformLocation(program, "u_colors"),
      scene: gl.getUniformLocation(program, "u_scene"),
      shape: gl.getUniformLocation(program, "u_shape"),
      surface: gl.getUniformLocation(program, "u_surface"),
      finish: gl.getUniformLocation(program, "u_finish"),
      transform: gl.getUniformLocation(program, "u_transform"),
      space: gl.getUniformLocation(program, "u_space"),
      cursor: gl.getUniformLocation(program, "u_cursor"),
    };

    gl.uniform3fv(uniforms.colors, new Float32Array(UNIFORMS.colors.flat()));
    gl.uniform4f(
      uniforms.shape,
      UNIFORMS.scale,
      UNIFORMS.intensity,
      UNIFORMS.paramA,
      UNIFORMS.warp,
    );
    gl.uniform4f(
      uniforms.surface,
      UNIFORMS.detail,
      UNIFORMS.contrast,
      UNIFORMS.brightness,
      UNIFORMS.saturation,
    );
    gl.uniform4f(
      uniforms.finish,
      UNIFORMS.hue,
      UNIFORMS.vignette,
      UNIFORMS.blur,
      UNIFORMS.grain,
    );
    gl.uniform4f(
      uniforms.transform,
      UNIFORMS.seed,
      UNIFORMS.rotate,
      UNIFORMS.drift,
      UNIFORMS.oklab,
    );

    let targetX = 0;
    let targetY = 0;
    let targetPresence = 0;
    let mouseX = 0;
    let mouseY = 0;
    let cursorPresence = 0;
    let pointerKnown = false;
    let pointerClientX = 0;
    let pointerClientY = 0;
    let bounds = canvasElement.getBoundingClientRect();
    let animationFrame = 0;
    let lastNow: number | null = null;
    let visible = document.visibilityState === "visible";
    let inView = true;
    let disposed = false;
    const start = performance.now();

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rawWidth = Math.max(1, Math.round(bounds.width * dpr));
      const rawHeight = Math.max(1, Math.round(bounds.height * dpr));
      const pixelScale = Math.min(
        1,
        Math.sqrt(2_000_000 / Math.max(1, rawWidth * rawHeight)),
      );
      const width = Math.max(1, Math.round(rawWidth * pixelScale));
      const height = Math.max(1, Math.round(rawHeight * pixelScale));

      if (canvasElement.width !== width || canvasElement.height !== height) {
        canvasElement.width = width;
        canvasElement.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    function requestRender() {
      if (!disposed && visible && inView && animationFrame === 0) {
        animationFrame = requestAnimationFrame(render);
      }
    }

    const updatePointerTarget = () => {
      if (!pointerKnown || bounds.width === 0 || bounds.height === 0) return;
      const inside =
        pointerClientX >= bounds.left &&
        pointerClientX <= bounds.right &&
        pointerClientY >= bounds.top &&
        pointerClientY <= bounds.bottom;

      if (!inside) {
        targetPresence = 0;
        requestRender();
        return;
      }

      const nextX = ((pointerClientX - bounds.left) / bounds.width) * 2 - 1;
      const nextY = -(((pointerClientY - bounds.top) / bounds.height) * 2 - 1);
      if (targetPresence === 0 && cursorPresence < 0.01) {
        mouseX = nextX;
        mouseY = nextY;
      }
      targetX = nextX;
      targetY = nextY;
      targetPresence = 1;
      requestRender();
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerKnown = true;
      pointerClientX = event.clientX;
      pointerClientY = event.clientY;
      bounds = canvasElement.getBoundingClientRect();
      updatePointerTarget();
    };

    const onPointerLeave = () => {
      pointerKnown = false;
      targetPresence = 0;
      requestRender();
    };

    const updateLayout = () => {
      bounds = canvasElement.getBoundingClientRect();
      resizeCanvas();
      updatePointerTarget();
      requestRender();
    };

    window.addEventListener("resize", updateLayout);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointercancel", onPointerLeave);
    window.addEventListener("scroll", updateLayout, true);
    window.addEventListener("blur", onPointerLeave);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    const resizeObserver = new ResizeObserver(updateLayout);
    resizeObserver.observe(canvasElement);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      if (inView) {
        requestRender();
      } else if (animationFrame !== 0) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        lastNow = null;
      }
    });
    intersectionObserver.observe(canvasElement);

    const onVisibilityChange = () => {
      visible = document.visibilityState === "visible";
      if (visible) {
        requestRender();
      } else if (animationFrame !== 0) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        lastNow = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    function render(now: number) {
      animationFrame = 0;
      if (disposed || !visible || !inView) return;

      const delta =
        lastNow === null ? 0 : Math.min((now - lastNow) / 1000, 0.1);
      lastNow = now;
      const follow = 1 - Math.exp(-12 * delta);
      mouseX += (targetX - mouseX) * follow;
      mouseY += (targetY - mouseY) * follow;
      cursorPresence += (targetPresence - cursorPresence) * follow;
      resizeCanvas();

      gl.uniform4f(
        uniforms.scene,
        canvasElement.width,
        canvasElement.height,
        ((now - start) / 1000) * UNIFORMS.timeScale,
        UNIFORMS.colorCount,
      );
      gl.uniform4f(
        uniforms.space,
        UNIFORMS.offsetX,
        UNIFORMS.offsetY,
        mouseX,
        mouseY,
      );
      gl.uniform4f(
        uniforms.cursor,
        cursorPresence,
        UNIFORMS.cursorEffect,
        UNIFORMS.cursorStrength,
        UNIFORMS.cursorRadius,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestRender();
    }

    updateLayout();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointercancel", onPointerLeave);
      window.removeEventListener("scroll", updateLayout, true);
      window.removeEventListener("blur", onPointerLeave);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);

      const releaseTimer = window.setTimeout(() => {
        if (pendingContextReleases.get(canvasElement) !== releaseTimer) return;
        pendingContextReleases.delete(canvasElement);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        canvasElement.width = 1;
        canvasElement.height = 1;
      }, 0);
      pendingContextReleases.set(canvasElement, releaseTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
    />
  );
}
