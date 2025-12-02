import React, { useEffect, useRef, useState } from 'react';

export default function EditorCanvas({
  width = 1200,
  height = 800,
  productMockupUrl,
  printArea,
  layers = [],
  bgColor = '#f3f3f3',
  onChange,
  showGuides = true,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const mockup = useImage(productMockupUrl);

  const [selectedId, setSelectedId] = useState(null);
  const stateRef = useRef({ drag: null, resize: null, hover: null });

  // NEW: тик для перерисовки, когда догружаются картинки слоёв
  const [imgTick, setImgTick] = useState(0);
  useEffect(() => {
    // подписываемся на загрузку всех src в слоях
    const subs = [];
    for (const l of layers) {
      if (l.type === 'image' && l.src) {
        const im = cacheImage(l.src);
        if (im && !im.complete) {
          const onload = () => setImgTick(t => t + 1);
          im.addEventListener('load', onload, { once: true });
          subs.push([im, onload]);
        }
      }
    }
    return () => subs.forEach(([im, fn]) => im.removeEventListener('load', fn));
  }, [layers.map(l => (l.type === 'image' ? l.src : '')).join('|')]);

  // отдаём API наверх
  useEffect(() => {
    onChange?.({
      exportPrint: () => exportPNG(false), // только печатная область
      exportMockup: () => exportPNG(true),  // весь мокап
      mutate: () => {},
      selectedId,
    });
    // eslint-disable-next-line
  }, [selectedId, width, height, bgColor, productMockupUrl, printArea, layers]);

  // Плавный рендер — бесконечный rAF-цикл (FIX: картинки появятся, анимации плавные)
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const loop = () => {
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // завязки на конфигурацию, при смене — перезапуск цикла
  }, [width, height, mockup, bgColor, printArea, showGuides, imgTick, layers.length]);

  function draw() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d', { alpha: true });
    ctx.clearRect(0, 0, c.width, c.height);

    // фон (цвет изделия)
    ctx.fillStyle = bgColor || '#f3f3f3';
    ctx.fillRect(0, 0, c.width, c.height);

    // подложка-мокап
    if (mockup?.complete && mockup.naturalWidth > 0) {
      try { ctx.drawImage(mockup, 0, 0, c.width, c.height); } catch {}
    }

    // зона печати + направляющие
    drawPrintArea(ctx, printArea, bgColor);
    if (showGuides) drawGuides(ctx, printArea, bgColor);

    // слои
    for (const l of layers) {
      if (l.visible === false) continue;
      if (l.type === 'image') drawImage(ctx, l);
      else if (l.type === 'text') drawText(ctx, l, bgColor);
    }

    // выделение
    const sel = layers.find(l => l.id === selectedId && l.visible !== false);
    if (sel) drawSelection(ctx, sel);
  }

  // ===== мышь/клавиши =====
  function toLocal(e) {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onDown(e) {
    const p = toLocal(e);
    const hit = hitTest(layers, p);
    if (hit && !hit.locked) {
      setSelectedId(hit.id);
      // попали в ручку?
      const handle = handleHit(hit, p);
      if (handle) {
        stateRef.current.resize = { id: hit.id, handle, start: p, orig: { ...hit } };
      } else {
        stateRef.current.drag = {
          id: hit.id,
          offX: p.x - (hit.x || 0),
          offY: p.y - (hit.y || 0),
        };
      }
    } else {
      setSelectedId(null);
      stateRef.current.drag = null;
      stateRef.current.resize = null;
    }
  }

  function onMove(e) {
    const p = toLocal(e);
    stateRef.current.hover = p;

    // курсоры над ручками (улучшает UX, особенно боковые)
    const cv = canvasRef.current;
    let cursor = 'default';
    const sel = layers.find(l => l.id === selectedId && l.visible !== false);
    if (sel) {
      const h = handleHit(sel, p);
      if (h) cursor = cursorForHandle(h);
    }
    if (stateRef.current.drag) cursor = 'move';
    if (stateRef.current.resize) cursor = cursorForHandle(stateRef.current.resize.handle);
    if (cv && cv.style.cursor !== cursor) cv.style.cursor = cursor;

    const st = stateRef.current;
    const shift = e.shiftKey;

    if (st.drag) {
      e.preventDefault();
      const i = layers.findIndex(l => l.id === st.drag.id);
      if (i < 0) return;

      const nx = p.x - st.drag.offX;
      const ny = p.y - st.drag.offY;

      const clamped = clampToPrintArea({ x: nx, y: ny }, layers[i], printArea);
      onChange?.({
        mutate: wrap => {
          const j = wrap.layers.findIndex(x => x.id === layers[i].id);
          if (j >= 0) {
            wrap.layers[j].x = Math.round(clamped.x);
            wrap.layers[j].y = Math.round(clamped.y);
          }
        },
        selectedId,
      });
    }

    if (st.resize) {
      e.preventDefault();
      const i = layers.findIndex(l => l.id === st.resize.id);
      if (i < 0) return;

      const layer = layers[i];
      const delta = { dx: p.x - st.resize.start.x, dy: p.y - st.resize.start.y };
      const next = resizeWithHandle(st.resize.handle, st.resize.orig, delta, { keepRatio: !shift });

      // текст — меняем fontSize по высоте
      if (layer.type === 'text') {
        const min = 10, max = 400;
        next.fontSize = Math.max(min, Math.min(max, Math.round(next.fontSize)));
      } else {
        next.width  = Math.max(16, Math.round(next.width));
        next.height = Math.max(16, Math.round(next.height));
      }

      const clamped = clampRectToPrintArea(next, printArea);
      onChange?.({
        mutate: wrap => {
          const j = wrap.layers.findIndex(x => x.id === layer.id);
          if (j >= 0) Object.assign(wrap.layers[j], clamped);
        },
        selectedId,
      });
    }
  }

  function onUp() {
    stateRef.current.drag = null;
    stateRef.current.resize = null;
  }

  function onDblClick() {
    const sel = layers.find(l => l.id === selectedId && l.type === 'text');
    if (!sel) return;
    const txt = window.prompt('Текст слоя:', sel.text || 'Ваш текст');
    if (txt == null) return;
    onChange?.({
      mutate: wrap => {
        const j = wrap.layers.findIndex(x => x.id === sel.id);
        if (j >= 0) wrap.layers[j].text = String(txt);
      },
      selectedId,
    });
  }

  // hotkeys
  useEffect(() => {
    function onKey(e) {
      const sel = layers.find(l => l.id === selectedId);
      if (!sel) return;

      // delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onChange?.({
          mutate: wrap => { wrap.layers = wrap.layers.filter(l => l.id !== sel.id); },
          selectedId: null,
        });
        setSelectedId(null);
      }

      // duplicate Cmd/Ctrl+D
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        const clone = JSON.parse(JSON.stringify(sel));
        clone.id = crypto.randomUUID();
        clone.x = (clone.x || 0) + 20;
        clone.y = (clone.y || 0) + 20;
        onChange?.({ mutate: w => { w.layers.push(clone); } });
        setSelectedId(clone.id);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [layers, selectedId, onChange]);

  // экспорт
  function exportPNG(withMockup) {
    // PRINT: вырезаем ровно печатную область
    if (!withMockup && printArea) {
      const off = document.createElement('canvas');
      off.width = Math.round(printArea.w);
      off.height = Math.round(printArea.h);
      const ctx = off.getContext('2d');

      // без mockup и без фона — прозрачный принт
      ctx.clearRect(0, 0, off.width, off.height);

      for (const l of layers) {
        if (l.visible === false) continue;
        if (l.type === 'image') {
          // рисуем, смещая координаты на -printArea.x/y
          const img = cacheImage(l.src);
          if (!img?.complete || !img.naturalWidth) continue;
          const r = rectOf(l);
          try { ctx.drawImage(img, r.x - printArea.x, r.y - printArea.y, r.w, r.h); } catch {}
        } else if (l.type === 'text') {
          // временно сдвигаем y/x
          drawText(ctx, { ...l, x: (l.x || 0) - printArea.x, y: (l.y || 0) - printArea.y }, '#ffffff');
        }
      }
      return off.toDataURL('image/png');
    }

    // MOCKUP: весь холст
    const off = document.createElement('canvas');
    off.width = width; off.height = height;
    const ctx = off.getContext('2d');

    ctx.fillStyle = bgColor || '#f3f3f3';
    ctx.fillRect(0, 0, off.width, off.height);

    if (withMockup && mockup?.complete && mockup.naturalWidth > 0) {
      try { ctx.drawImage(mockup, 0, 0, off.width, off.height); } catch {}
    }

    for (const l of layers) {
      if (l.visible === false) continue;
      if (l.type === 'image') drawImage(ctx, l);
      else if (l.type === 'text') drawText(ctx, l, bgColor);
    }
    return off.toDataURL('image/png');
  }

  return (
    <div style={{ position:'relative', userSelect:'none' }}
         onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={onDown}
        onDoubleClick={onDblClick}
        style={{ width, height, display:'block', borderRadius:16, background:'transparent' }}
      />
    </div>
  );
}

/* =============== helpers =============== */

function useImage(src) {
  const [img, setImg] = useState(null);
  useEffect(() => {
    if (!src) { setImg(null); return; }
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.decoding = 'async';
    im.onload = () => setImg(im);
    im.onerror = () => setImg(null);
    im.src = src;
  }, [src]);
  return img;
}

function drawPrintArea(ctx, area, bg = '#f3f3f3') {
  if (!area) return;
  ctx.save();
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = isLight(bg) ? 'rgba(0,0,0,.55)' : 'rgba(255,255,255,.85)';
  ctx.strokeRect(area.x, area.y, area.w, area.h);
  ctx.restore();
}

function drawGuides(ctx, area, bg = '#f3f3f3') {
  if (!area) return;
  ctx.save();
  ctx.strokeStyle = isLight(bg) ? 'rgba(0,0,0,.18)' : 'rgba(255,255,255,.25)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 6]);
  const cx = area.x + area.w/2, cy = area.y + area.h/2;
  ctx.beginPath();
  ctx.moveTo(cx, area.y); ctx.lineTo(cx, area.y + area.h);
  ctx.moveTo(area.x, cy); ctx.lineTo(area.x + area.w, cy);
  ctx.stroke();
  ctx.restore();
}

function drawSelection(ctx, l) {
  const r = rectOf(l);
  ctx.save();
  ctx.setLineDash([4,4]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(66,133,244,.9)';
  ctx.strokeRect(r.x, r.y, r.w, r.h);

  // 8 ручек
  const hs = handles(r);
  ctx.fillStyle = '#2f6ef6';
  hs.forEach(h => ctx.fillRect(h.x-4, h.y-4, 8, 8));
  ctx.restore();
}

function drawImage(ctx, l) {
  const img = cacheImage(l.src);
  if (!img?.complete || !img.naturalWidth) return;
  const r = rectOf(l);
  ctx.save();
  if (l.rotation) {
    const cx = r.x + r.w/2, cy = r.y + r.h/2;
    ctx.translate(cx, cy); ctx.rotate(l.rotation); ctx.translate(-cx, -cy);
  }
  try { ctx.drawImage(img, r.x, r.y, r.w, r.h); } catch {}
  ctx.restore();
}

const _cache = new Map();
function cacheImage(src) {
  if (!src) return null;
  if (!_cache.has(src)) {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.decoding = 'async';
    im.src = src;
    _cache.set(src, im);
  }
  return _cache.get(src);
}

function drawText(ctx, l, bgColor) {
  const x = l.x || 0, y = l.y || 0;
  const fs = l.fontSize || 36;
  const fam = l.fontFamily || 'system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif';
  const align = l.align || 'left';

  const color = l.color || autoTextColor(bgColor);
  const outline = outlineFor(bgColor);

  ctx.save();
  ctx.font = `${l.bold ? '600 ' : ''}${l.italic ? 'italic ' : ''}${fs}px ${fam}`;
  ctx.textBaseline = 'top';
  ctx.textAlign = align;

  const text = String(l.text ?? 'Ваш текст');

  if (isLight(bgColor)) { ctx.shadowColor = 'rgba(0,0,0,.2)'; ctx.shadowBlur = 5; }
  else { ctx.shadowColor = 'rgba(255,255,255,.15)'; ctx.shadowBlur = 4; }

  ctx.lineWidth = Math.max(1, Math.floor(fs/16));
  ctx.strokeStyle = outline;
  ctx.fillStyle = color;

  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
  ctx.restore();
}

function rectOf(l) {
  if (l.type === 'text') {
    const w = Math.max(100, Number(l.boxW) || 300);
    const h = Math.max(30, Math.round((l.fontSize || 36) * 1.2));
    return { x: l.x||0, y: l.y||0, w, h };
  }
  return { x: l.x||0, y: l.y||0, w: Math.max(16, l.width||300), h: Math.max(16, l.height||300) };
}

function handleHit(l, p) {
  const r = rectOf(l);
  const hs = handles(r);
  const hit = hs.find(h => Math.abs(p.x - h.x) <= 6 && Math.abs(p.y - h.y) <= 6);
  return hit?.name || null;
}

function handles(r) {
  const midX = r.x + r.w/2, midY = r.y + r.h/2;
  return [
    { name:'nw', x:r.x, y:r.y }, { name:'n', x:midX, y:r.y }, { name:'ne', x:r.x+r.w, y:r.y },
    { name:'w', x:r.x, y:midY }, { name:'e', x:r.x+r.w, y:midY },
    { name:'sw', x:r.x, y:r.y+r.h }, { name:'s', x:midX, y:r.y+r.h }, { name:'se', x:r.x+r.w, y:r.y+r.h },
  ];
}

function resizeWithHandle(handle, orig, d, { keepRatio }) {
  const o = JSON.parse(JSON.stringify(orig));
  if (orig.type === 'text') {
    // масштабируем по высоте -> fontSize (боковые ручки тоже работают — масштаб по вертикали)
    if (handle === 'n' || handle === 's') {
      const sign = handle === 'n' ? -1 : 1;
      const deltaH = sign * d.dy;
      const newH = Math.max(16, (orig.fontSize || 36) + deltaH);
      const ny = handle === 'n' ? orig.y + (orig.fontSize - newH) : orig.y;
      return { ...orig, y: ny, fontSize: newH };
    }
    const deltaH = (handle.includes('n') ? -d.dy : d.dy);
    const newH = Math.max(16, (orig.fontSize || 36) + deltaH);
    const ny = handle.includes('n') ? orig.y + (orig.fontSize - newH) : orig.y;
    return { ...orig, y: ny, fontSize: newH };
  }

  // image
  let nx = o.x, ny = o.y, nw = o.width, nh = o.height;
  const ratio = (o.width || 1) / (o.height || 1);

  if (handle.includes('w')) { const rx = o.x + o.width; nx = Math.min(rx - 16, o.x + d.dx); nw = rx - nx; }
  if (handle.includes('e')) { nw = Math.max(16, o.width + d.dx); }
  if (handle.includes('n')) { const by = o.y + o.height; ny = Math.min(by - 16, o.y + d.dy); nh = by - ny; }
  if (handle.includes('s')) { nh = Math.max(16, o.height + d.dy); }

  if (keepRatio) {
    if (nw / nh > ratio) nw = Math.round(nh * ratio);
    else nh = Math.round(nw / ratio);
    if (handle.includes('w')) nx = o.x + (o.width - nw);
    if (handle.includes('n')) ny = o.y + (o.height - nh);
  }

  return { ...o, x: Math.round(nx), y: Math.round(ny), width: Math.round(nw), height: Math.round(nh) };
}

function clampToPrintArea(pos, layer, area) {
  if (!area) return pos;
  const r = rectOf({ ...layer, x: pos.x, y: pos.y });
  const x = Math.min(Math.max(r.x, area.x), area.x + area.w - r.w);
  const y = Math.min(Math.max(r.y, area.y), area.y + area.h - r.h);
  return { x, y };
}

function clampRectToPrintArea(next, area) {
  if (!area) return next;
  const r = rectOf(next);
  let x = r.x, y = r.y, w = r.w, h = r.h;
  if (x < area.x) x = area.x;
  if (y < area.y) y = area.y;
  if (x + w > area.x + area.w) x = area.x + area.w - w;
  if (y + h > area.y + area.h) y = area.y + area.h - h;

  if (next.type === 'text') return { ...next, x, y };
  return { ...next, x, y, width: w, height: h };
}

function hitTest(layers, p) {
  for (let i = layers.length - 1; i >= 0; i--) {
    const l = layers[i];
    if (l.visible === false) continue;
    const r = rectOf(l);
    if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) return l;
  }
  return null;
}

function isLight(hex) {
  const { r,g,b } = hexToRgb(hex);
  const L = 0.2126 * srgb(r/255) + 0.7152 * srgb(g/255) + 0.0722 * srgb(b/255);
  return L > 0.6;
}
function srgb(c){ return c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); }

function outlineFor(bg){ return isLight(bg) ? 'rgba(0,0,0,.8)' : 'rgba(255,255,255,.9)'; }
function autoTextColor(bg){ return isLight(bg) ? '#222' : '#fff'; }

function hexToRgb(hex) {
  try{
    let s = String(hex || '').replace('#','');
    if (s.length === 3) s = s.split('').map(c=>c+c).join('');
    const n = parseInt(s,16); return { r:(n>>16)&255, g:(n>>8)&255, b:(n)&255 };
  }catch{ return { r:243,g:243,b:243 }; }
}

function cursorForHandle(h) {
  switch (h) {
    case 'nw':
    case 'se': return 'nwse-resize';
    case 'ne':
    case 'sw': return 'nesw-resize';
    case 'n':
    case 's':  return 'ns-resize';
    case 'e':
    case 'w':  return 'ew-resize';
    default:   return 'default';
  }
}
