import { useEffect, useMemo, useRef } from 'react';
import './DepthText.css';

/**
 * DepthText —— 景深文字：把同一段文字按「层」拆开，每层沿 Z 轴依次后推，
 * 越靠后的层颜色越贴近纵深色，配合指针微视差 / 自动环绕，形成有厚度的立体排版。
 *
 * 行为要点：
 * 1. layers 层副本 + 1 层正面文字叠在同一个网格格子里，每层的 translateZ 依次递减，
 *    形成实体挤出感；颜色用 color-mix 在「面子色 → 纵深色」之间插值（越深越靠色）。
 * 2. 指针在窗口内移动时按归一化坐标换算目标倾角，逐帧做平滑插值（smoothing），
 *    指针离开 / 窗口失焦回到基础倾角。
 * 3. 没有指针交互（或指针不在窗口内）且 autoOrbit 打开时，用 requestAnimationFrame
 *    按 orbitSpeed 做正弦环绕；指针跟踪只对「悬停 + 精确指针」设备启用。
 * 4. prefers-reduced-motion 时完全不动画，只静态应用基础倾角。
 * 5. 所有 props 都做区间收敛，避免外部传入离谱数值把版面撑爆。
 */

const MAX_LAYERS = 64;

/* 兼容层：参考实现默认「浅字 + 紫」是深色底配色，本站是白底深字。
   仅当调用方「没传」或仍在用参考默认值时才改写成蓝白科技色，显式传入其它色值一律尊重。 */
const resolveFaceColor = (value) => {
  if (value == null) return '#0B1220';
  if (typeof value === 'string' && value.toLowerCase() === '#f8fafc') return '#0B1220';
  return value;
};

const resolveDepthColor = (value) => {
  if (value == null) return '#4D6BFE';
  if (typeof value === 'string' && value.toLowerCase() === '#7c3aed') return '#4D6BFE';
  return value;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getLayerColor = (faceColor, depthColor, index, total) => {
  const progress = total <= 1 ? 1 : index / total;
  const eased = progress * progress;
  const faceMix = Math.round((1 - eased) * 72 + 4);
  return `color-mix(in srgb, ${faceColor} ${faceMix}%, ${depthColor})`;
};

const getTransform = (rotateX, rotateY) => `rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`;

const DepthText = ({
  text = 'Elevate',
  layers = 34,
  depth = 2.4,
  faceColor = '#f8fafc',
  depthColor = '#7c3aed',
  tilt = 7.5,
  pointerTracking = true,
  smoothing = 0.14,
  perspective = 900,
  autoOrbit = true,
  orbitSpeed = 0.35,
  fontSize = 'clamp(3rem, 12vw, 7rem)',
  fontWeight = 900,
  shadow = true,
  className = '',
  style = {},
}) => {
  const rootRef = useRef(null);
  const stageRef = useRef(null);

  const safeLayers = clamp(Math.round(Number(layers) || 1), 2, MAX_LAYERS);
  const safeDepth = clamp(Number(depth) || 0, 0, 12);
  const safeTilt = clamp(Number(tilt) || 0, 0, 12);
  const safeSmoothing = clamp(Number(smoothing) || 0.14, 0.02, 0.35);
  const safePerspective = clamp(Number(perspective) || 900, 300, 2000);
  const safeOrbitSpeed = clamp(Number(orbitSpeed) || 0, 0, 2);

  /* 主题换算后的面子色 / 纵深色，层色与阴影都由它们派生 */
  const surfaceColor = resolveFaceColor(faceColor);
  const deepColor = resolveDepthColor(depthColor);

  const baseRotation = useMemo(() => ({ x: -safeTilt * 0.32, y: safeTilt * 0.42 }), [safeTilt]);

  const depthLayers = useMemo(
    () =>
      Array.from({ length: safeLayers }, (_, layerIndex) => {
        const index = safeLayers - layerIndex;
        return {
          index,
          color: getLayerColor(surfaceColor, deepColor, index, safeLayers),
          transform: `translateZ(${-index * safeDepth}px)`,
        };
      }),
    [safeLayers, safeDepth, surfaceColor, deepColor]
  );

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || typeof window === 'undefined') return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const canTrackPointer = pointerTracking && finePointer && !reducedMotion;

    let frameId = 0;
    let activePointer = false;
    let startTime = performance.now();
    const current = { ...baseRotation };
    const target = { ...baseRotation };

    const applyTransform = () => {
      stage.style.transform = getTransform(current.x, current.y);
    };

    if (reducedMotion) {
      stage.style.transform = getTransform(baseRotation.x, baseRotation.y);
      return undefined;
    }

    const handlePointerMove = (event) => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      activePointer = true;
      const x = clamp((event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8), -1, 1);
      const y = clamp((event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8), -1, 1);

      target.x = baseRotation.x - y * safeTilt;
      target.y = baseRotation.y + x * safeTilt;
    };

    const handlePointerLeave = () => {
      activePointer = false;
      target.x = baseRotation.x;
      target.y = baseRotation.y;
    };

    if (canTrackPointer) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerleave', handlePointerLeave);
      window.addEventListener('blur', handlePointerLeave);
    }

    const tick = (now) => {
      if ((!canTrackPointer || !activePointer) && autoOrbit) {
        const elapsed = (now - startTime) / 1000;
        const orbit = elapsed * safeOrbitSpeed * Math.PI * 2;
        const fallbackAmount = canTrackPointer ? 0.18 : 0.55;
        target.x = baseRotation.x + Math.sin(orbit) * safeTilt * fallbackAmount;
        target.y = baseRotation.y + Math.cos(orbit * 0.85) * safeTilt * fallbackAmount;
      }

      current.x += (target.x - current.x) * safeSmoothing;
      current.y += (target.y - current.y) * safeSmoothing;
      applyTransform();
      frameId = requestAnimationFrame(tick);
    };

    applyTransform();
    frameId = requestAnimationFrame(tick);

    return () => {
      if (canTrackPointer) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerleave', handlePointerLeave);
        window.removeEventListener('blur', handlePointerLeave);
      }
      cancelAnimationFrame(frameId);
      startTime = 0;
    };
  }, [autoOrbit, baseRotation, pointerTracking, safeOrbitSpeed, safeSmoothing, safeTilt]);

  const rootStyle = {
    ...style,
    '--depth-text-perspective': `${safePerspective}px`,
    '--depth-text-font-size': fontSize,
    '--depth-text-font-weight': fontWeight,
    '--depth-text-face-color': surfaceColor,
    '--depth-text-depth-color': deepColor,
    '--depth-text-shadow': shadow
      ? `0 22px 34px color-mix(in srgb, ${deepColor} 36%, transparent), 0 4px 8px rgba(11, 18, 32, 0.14)`
      : 'none',
  };

  return (
    <span ref={rootRef} className={`depth-text ${className}`.trim()} style={rootStyle}>
      <span ref={stageRef} className="depth-text__stage">
        {depthLayers.map((layer) => (
          <span
            aria-hidden="true"
            className="depth-text__layer"
            key={layer.index}
            style={{ color: layer.color, transform: layer.transform }}
          >
            {text}
          </span>
        ))}
        <span className="depth-text__face">{text}</span>
      </span>
    </span>
  );
};

export default DepthText;
