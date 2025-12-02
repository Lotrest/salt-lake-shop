

import React, {
  useEffect, useRef, useState, useMemo,
  useImperativeHandle, forwardRef
} from "react";

import { PRODUCT_TEMPLATES } from "@/components/editor/templates";

const HANDLE = 8;
const ROTATE_HANDLE_OFFSET = 28;

function rad(d){ return d * Math.PI / 180; }
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

function getImage(src){
  if(!src) return null;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.decoding = "async";
  img.src = src;
  return img;
}

// ===== Фильтры для image-слоев (легкие пресеты) =====
function applyFilterToCanvas(ctx, w, h, name){
  if(!name || name === "Original") return;
  const id = ctx.getImageData(0,0,w,h);
  const d = id.data; const L = d.length;

  const vignette = (intensity=0.35)=>{
    const cx=w/2, cy=h/2, maxR = Math.hypot(cx,cy);
    const g = ctx.createRadialGradient(cx,cy,maxR*0.4,cx,cy,maxR);
    g.addColorStop(0,"rgba(0,0,0,0)");
    g.addColorStop(1,`rgba(0,0,0,${intensity})`);
    ctx.globalCompositeOperation="multiply";
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    ctx.globalCompositeOperation="source-over";
  };
  const grayscale = ()=>{
    for(let i=0;i<L;i+=4){
      const r=d[i],g=d[i+1],b=d[i+2];
      const y=0.2126*r+0.7152*g+0.0722*b;
      d[i]=d[i+1]=d[i+2]=y;
    }
  };
  const gamma = (g=1.1)=>{
    const inv=1/g;
    for(let i=0;i<L;i+=4){
      d[i]  = 255*Math.pow(d[i]/255,inv);
      d[i+1]= 255*Math.pow(d[i+1]/255,inv);
      d[i+2]= 255*Math.pow(d[i+2]/255,inv);
    }
  };
  const sepia = ()=>{
    for(let i=0;i<L;i+=4){
      const r=d[i],g=d[i+1],b=d[i+2];
      d[i]  = Math.min(255,0.393*r+0.769*g+0.189*b);
      d[i+1]= Math.min(255,0.349*r+0.686*g+0.168*b);
      d[i+2]= Math.min(255,0.272*r+0.534*g+0.131*b);
    }
  };
  const saturation = (s=0.15)=>{
    for(let i=0;i<L;i+=4){
      const r=d[i],g=d[i+1],b=d[i+2];
      const y=0.2126*r+0.7152*g+0.0722*b;
      d[i]  = clamp(y + (r-y)*(1+s), 0, 255);
      d[i+1]= clamp(y + (g-y)*(1+s), 0, 255);
      d[i+2]= clamp(y + (b-y)*(1+s), 0, 255);
    }
  };
  const brightness = (bri=0.05)=>{
    const add = Math.round(255*bri);
    for(let i=0;i<L;i+=4){
      d[i]  = clamp(d[i]  + add,0,255);
      d[i+1]= clamp(d[i+1]+ add,0,255);
      d[i+2]= clamp(d[i+2]+ add,0,255);
    }
  };
  const contrast = (cst=0.1)=>{
    const f=(259*(cst*255+255))/(255*(259-cst*255));
    for(let i=0;i<L;i+=4){
      d[i]  = clamp(f*(d[i]-128)+128,0,255);
      d[i+1]= clamp(f*(d[i+1]-128)+128,0,255);
      d[i+2]= clamp(f*(d[i+2]-128)+128,0,255);
    }
  };

  switch(name){
    case "Grayscale": grayscale(); ctx.putImageData(id,0,0); break;
    case "Gamma": gamma(1.1); ctx.putImageData(id,0,0); break;
    case "Hudson": sepia(); contrast(0.10); saturation(0.15); ctx.putImageData(id,0,0); break;
    case "Valencia": sepia(); brightness(0.05); saturation(0.2); ctx.putImageData(id,0,0); break;
    case "Sutro": sepia(); contrast(0.15); ctx.putImageData(id,0,0); vignette(0.35); break;
    case "Amaro": brightness(0.10); saturation(0.15); ctx.putImageData(id,0,0); break;
    case "Vignette": ctx.putImageData(id,0,0); vignette(0.35); break;
    default: break;
  }
}

// ===== Удаление фона (хромакей) у image-слоев =====
function hexToRgb(hex){
  let s = (hex||"").replace("#","");
  if(s.length===3) s = s.split("").map(ch=>ch+ch).join("");
  const n = parseInt(s,16);
  return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
}
function removeBgOnCanvas(ctx, w, h, key="#ffffff", threshold=0.25){
  const id = ctx.getImageData(0,0,w,h);
  const d = id.data; const kc = hexToRgb(key);
  for(let i=0;i<d.length;i+=4){
    const dr=d[i]-kc.r, dg=d[i+1]-kc.g, db=d[i+2]-kc.b;
    const dist = Math.sqrt(dr*dr+dg*dg+db*db)/441.673; // ~255*sqrt(3)
    if(dist < threshold){ d[i+3]=0; }
  }
  ctx.putImageData(id,0,0);
}

// ===== Пресеты печати/мокапа из ваших PRODUCT_TEMPLATES =====
function getPrintPreset(productKey){
  const base = PRODUCT_TEMPLATES?.[productKey] || null;
  if(!base) return { baseImage:null, area:{ x:80,y:80,w:1040,h:640 }, printSize:{ w:1200, h:800 } };
  return {
    baseImage: base.baseImage || null,
    area: base.printArea || base.area || { x:80,y:80,w:1040,h:640 },
    printSize: base.printSize || { w:1200, h:800 }
  };
}

// ===== Отрисовка слоя =====
function drawLayer(ctx, layer){
  const angle = rad(layer.angle||0);
  const flipX = layer.flipX ? -1 : 1;
  const flipY = layer.flipY ? -1 : 1;
  const x = layer.x||0, y=layer.y||0;
  const w = Math.max(1, Math.round(layer.w||layer.width||200));
  const h = Math.max(1, Math.round(layer.h||layer.height||100));

  ctx.save();
  ctx.globalAlpha = layer.opacity==null ? 1 : layer.opacity;
  ctx.translate(x + w/2, y + h/2);
  ctx.rotate(angle);
  ctx.scale(flipX, flipY);
  ctx.translate(-w/2, -h/2);

  if(layer.type === "text"){
    const weight = layer.bold ? "700" : "400";
    const style  = layer.italic ? "italic" : "normal";
    const family = layer.fontFamily || "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif";
    const size   = Math.max(8, layer.fontSize || layer.size || 28);
    ctx.font = `${style} ${weight} ${size}px ${family}`;
    ctx.fillStyle = layer.color || "#111";
    ctx.textBaseline = "middle";
    const align = layer.align || "left";
    if(align==="center") ctx.textAlign="center";
    else if(align==="right") ctx.textAlign="right";
    else ctx.textAlign="left";
    const tx = align==="center" ? w/2 : (align==="right" ? w : 0);
    ctx.fillText(layer.text||"", tx, h/2, w);
  }
  else if(layer.type === "image"){
    const img = layer._bitmap || (layer.src ? getImage(layer.src) : null);
    if(img && img.complete){
      // рисуем в offscreen, чтобы применять фильтры/удаление фона
      const off = document.createElement("canvas");
      off.width = w; off.height = h;
      const oc = off.getContext("2d");
      oc.drawImage(img, 0, 0, w, h);
      if(layer.filter && layer.filter !== "Original") applyFilterToCanvas(oc, w, h, layer.filter);
      if(layer.bgKeyColor) removeBgOnCanvas(oc, w, h, layer.bgKeyColor, layer.bgThreshold ?? 0.25);
      ctx.drawImage(off, 0, 0);
    } else {
      ctx.fillStyle = "rgba(0,0,0,0.04)"; ctx.fillRect(0,0,w,h);
    }
  }
  ctx.restore();
}

// ===== Выделение и ручки =====
function drawSelection(ctx, layer){
  const x=layer.x||0, y=layer.y||0, w=layer.w||layer.width||200, h=layer.h||layer.height||100;
  ctx.save();
  ctx.strokeStyle = "#2563eb"; ctx.lineWidth=1; ctx.setLineDash([4,4]);
  ctx.strokeRect(x,y,w,h);
  // ручки
  const hs = HANDLE;
  const points = [ [x,y], [x+w,y], [x+w,y+h], [x,y+h] ];
  ctx.fillStyle = "#2563eb";
  for(const [px,py] of points){ ctx.fillRect(px-hs/2, py-hs/2, hs, hs); }
  // rotate handle
  ctx.beginPath();
  ctx.arc(x+w/2, y-ROTATE_HANDLE_OFFSET, hs/2+2, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function hitTestHandle(px, py, layer){
  const x=layer.x||0, y=layer.y||0, w=layer.w||layer.width||200, h=layer.h||layer.height||100;
  const corners = [
    { k:"nw", x, y }, { k:"ne", x:x+w, y }, { k:"se", x:x+w, y:y+h }, { k:"sw", x, y:y+h }
  ];
  for(const c of corners){
    if(Math.abs(px - c.x) <= HANDLE && Math.abs(py - c.y) <= HANDLE) return { type:"resize", dir:c.k };
  }
  // rotate handle
  const rx = x + w/2, ry = y - ROTATE_HANDLE_OFFSET;
  if(Math.hypot(px-rx, py-ry) <= HANDLE+2) return { type:"rotate" };
  // внутри прямоугольника
  if(px>=x && py>=y && px<=x+w && py<=y+h) return { type:"move" };
  return null;
}

function clampToArea(layer, area){
  const w = layer.w||layer.width||200, h=layer.h||layer.height||100;
  layer.x = clamp(layer.x, area.x, area.x + area.w - w);
  layer.y = clamp(layer.y, area.y, area.y + area.h - h);
}

const EditorCanvas = forwardRef(function EditorCanvas({ store, width=1200, height=800, showGuides=true }, ref){
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [selectedIdState, setSelectedIdState] = useState(null);
  const selectedId = store.selectedId ?? selectedIdState;
  const setSelectedId = (id) => {
    setSelectedIdState(id);
    if (typeof store.setSelectedId === "function") store.setSelectedId(id);
  };

  const { layers, setLayers, productKey, requestSave } = store;
  const preset = useMemo(()=> getPrintPreset(productKey), [productKey]);
  const baseBitmap = useMemo(()=> preset.baseImage ? getImage(preset.baseImage) : null, [preset.baseImage]);

  useImperativeHandle(ref, () => ({
    exportMockup(){ const cv = canvasRef.current; return cv?.toDataURL("image/png"); },
    ops: {
      flipX, flipY, centerX, centerY, fitArea, setScale, setAngle, setFilter, textPatch, removeBg,
      bringToFront, sendToBack, bringForward, sendBackward,
    }
  }), [layers]);

  // init
  useEffect(()=>{
    const cv = canvasRef.current;
    cv.width = width; cv.height = height;
    ctxRef.current = cv.getContext("2d");
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  useEffect(()=>{ draw(); }, [layers, selectedId, preset, baseBitmap, showGuides]);

  function draw(){
    const ctx = ctxRef.current; if(!ctx) return;
    ctx.clearRect(0,0,width,height);
    // фон
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,width,height);
    // мокап
    if(baseBitmap && baseBitmap.complete){ ctx.drawImage(baseBitmap, 0, 0, width, height); }
    // область печати
    if(showGuides && preset.area){
      ctx.save(); ctx.setLineDash([6,6]); ctx.strokeStyle="rgba(0,0,0,.35)";
      ctx.strokeRect(preset.area.x, preset.area.y, preset.area.w, preset.area.h); ctx.restore();
    }
    // слои
    for(const L of layers){ if(L.visible===false) continue; drawLayer(ctx, L); }
    // выделение
    if(selectedId){ const L = layers.find(l=>l.id===selectedId); if(L) drawSelection(ctx, L); }
  }

  // ===== mouse handling =====
  const dragRef = useRef(null); // {mode:'move'|'resize'|'rotate', id, startX,startY, startLayer, dir}

  function onMouseDown(e){
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left; const py = e.clientY - rect.top;
    // hit test по верхнему слою к нижнему
    const hit = [...layers].reverse().find(L =>
      px>= (L.x||0) && py>= (L.y||0) &&
      px <= (L.x||0)+(L.w||L.width||200) &&
      py <= (L.y||0)+(L.h||L.height||100)
    );
    if(hit){
      setSelectedId(hit.id);
      const h = hitTestHandle(px, py, hit);
      const st = { id:hit.id, startX:px, startY:py, startLayer:{...hit} };
      if(h && h.type==="rotate"){ dragRef.current = { ...st, mode:"rotate" }; }
      else if(h && h.type==="resize"){ dragRef.current = { ...st, mode:"resize", dir:h.dir }; }
      else { dragRef.current = { ...st, mode:"move" }; }
    } else {
      setSelectedId(null);
    }
  }

  function onMouseMove(e){
    if(!dragRef.current) return;
    const { id, mode, startX, startY, startLayer, dir } = dragRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left; const py = e.clientY - rect.top;

    setLayers(ls => ls.map(L => {
      if(L.id !== id) return L;
      const out = { ...L };
      if(mode==="move"){
        out.x = (startLayer.x||0) + (px - startX);
        out.y = (startLayer.y||0) + (py - startY);
        clampToArea(out, preset.area);
      } else if(mode==="resize"){
        const dx = px - startX, dy = py - startY;
        let w=(startLayer.w||startLayer.width||200),
            h=(startLayer.h||startLayer.height||100),
            x=startLayer.x||0, y=startLayer.y||0;
        if(dir==="se"){ w += dx; h += dy; }
        if(dir==="ne"){ w += dx; h -= dy; y += dy; }
        if(dir==="sw"){ w -= dx; x += dx; h += dy; }
        if(dir==="nw"){ w -= dx; x += dx; h -= dy; y += dy; }
        out.w = Math.max(10, w); out.h = Math.max(10, h);
        out.x = x; out.y = y;
        clampToArea(out, preset.area);
      } else if(mode==="rotate"){
        const cx = (startLayer.x||0) + (startLayer.w||startLayer.width||200)/2;
        const cy = (startLayer.y||0) + (startLayer.h||startLayer.height||100)/2;
        out.angle = Math.round((Math.atan2(py - cy, px - cx) * 180 / Math.PI) + 90);
      }
      return out;
    }));
  }

  function onMouseUp(){
    if(dragRef.current){ dragRef.current=null; requestSave?.(); }
  }

  // ===== горячие клавиши =====
  useEffect(()=>{
    function onKey(e){
      if(!selectedId) return;
      const tag = document.activeElement?.tagName;
      if(tag === "INPUT" || tag === "TEXTAREA") return;
      if(e.key === "Delete"){
        setLayers(ls => ls.filter(L => L.id !== selectedId));
        requestSave?.();
      }
      const step = e.shiftKey ? 10 : 1;
      if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)){
        e.preventDefault();
        setLayers(ls => ls.map(L => {
          if(L.id !== selectedId) return L;
          const out = { ...L };
          if(e.key==="ArrowLeft")  out.x = (out.x||0) - step;
          if(e.key==="ArrowRight") out.x = (out.x||0) + step;
          if(e.key==="ArrowUp")    out.y = (out.y||0) - step;
          if(e.key==="ArrowDown")  out.y = (out.y||0) + step;
          clampToArea(out, preset.area);
          return out;
        }));
        requestSave?.();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, setLayers, requestSave, preset.area]);

  // ===== публичные операции для ваших кнопок (через ref.ops) =====
  function mutateSelected(fn){
    setLayers(ls => ls.map(L => L.id===selectedId ? fn({...L}) : L));
    requestSave?.();
  }
  function flipX(){ if(!selectedId) return; mutateSelected(L => (L.flipX = !L.flipX, L)); }
  function flipY(){ if(!selectedId) return; mutateSelected(L => (L.flipY = !L.flipY, L)); }
  function centerX(){ if(!selectedId) return;
    mutateSelected(L => (L.x = Math.round(preset.area.x + (preset.area.w - (L.w||L.width||200))/2), L));
  }
  function centerY(){ if(!selectedId) return;
    mutateSelected(L => (L.y = Math.round(preset.area.y + (preset.area.h - (L.h||L.height||100))/2), L));
  }
  function fitArea(){ if(!selectedId) return;
    mutateSelected(L => {
      const w=L.w||L.width||200, h=L.h||L.height||100;
      const k = Math.min(preset.area.w / w, preset.area.h / h);
      L.w = Math.max(10, Math.floor(w*k));
      L.h = Math.max(10, Math.floor(h*k));
      L.x = Math.round(preset.area.x + (preset.area.w - L.w)/2);
      L.y = Math.round(preset.area.y + (preset.area.h - L.h)/2);
      return L;
    });
  }
  function setScale(pct){ if(!selectedId) return;
    const k = Math.max(0.01, Number(pct)/100);
    mutateSelected(L => {
      const w=L.w||L.width||200, h=L.h||L.height||100;
      const cx=(L.x||0)+w/2, cy=(L.y||0)+h/2;
      L.w=Math.max(10, Math.round((L.width0||w)*k));
      L.h=Math.max(10, Math.round((L.height0||h)*k));
      L.x = Math.round(cx - L.w/2);
      L.y = Math.round(cy - L.h/2);
      clampToArea(L, preset.area);
      return L;
    });
  }
  function setAngle(deg){ if(!selectedId) return; mutateSelected(L => (L.angle = Math.round(Number(deg)||0), L)); }
  function setFilter(name){ if(!selectedId) return; mutateSelected(L => (L.filter = name, L)); }
  function textPatch(p){ if(!selectedId) return; mutateSelected(L => (Object.assign(L, p), L)); }
  function removeBg(color="#ffffff", thr=0.25){
    if(!selectedId) return;
    mutateSelected(L => { if(L.type!=="image") return L; L.bgKeyColor = color; L.bgThreshold = Number(thr)||0.25; return L; });
  }
  function bringToFront(){ if(!selectedId) return;
    const idx = layers.findIndex(l=>l.id===selectedId); if(idx<0) return;
    const L = layers[idx]; const arr = layers.slice(); arr.splice(idx,1); arr.push(L); setLayers(arr); requestSave?.();
  }
  function sendToBack(){ if(!selectedId) return;
    const idx = layers.findIndex(l=>l.id===selectedId); if(idx<0) return;
    const L = layers[idx]; const arr = layers.slice(); arr.splice(idx,1); arr.unshift(L); setLayers(arr); requestSave?.();
  }
  function bringForward(){ if(!selectedId) return;
    const idx = layers.findIndex(l=>l.id===selectedId); if(idx<0 || idx===layers.length-1) return;
    const arr = layers.slice(); [arr[idx], arr[idx+1]] = [arr[idx+1], arr[idx]]; setLayers(arr); requestSave?.();
  }
  function sendBackward(){ if(!selectedId) return;
    const idx = layers.findIndex(l=>l.id===selectedId); if(idx<=0) return;
    const arr = layers.slice(); [arr[idx], arr[idx-1]] = [arr[idx-1], arr[idx]]; setLayers(arr); requestSave?.();
  }

  // ===== мини‑панель (можно удалить, нужна для быстрой проверки) =====
  function MiniToolbar(){
    if(!selectedId) return null;
    const L = layers.find(l=>l.id===selectedId); if(!L) return null;
    const style = {
      position:"absolute", left:8, top:8, display:"flex", gap:6,
      background:"rgba(255,255,255,.9)", padding:"6px 8px",
      border:"1px solid #e5e7eb", borderRadius:8,
      backdropFilter:"saturate(1.2) blur(6px)"
    };
    return (
      <div style={style}>
        <button onClick={flipX}>flipX</button>
        <button onClick={flipY}>flipY</button>
        <button onClick={centerX}>centerX</button>
        <button onClick={centerY}>centerY</button>
        <button onClick={fitArea}>fit</button>
        <label style={{display:"inline-flex",alignItems:"center",gap:4}}>angle
          <input type="range" min={-180} max={180} value={L.angle||0} onChange={e=>setAngle(e.target.value)} />
        </label>
        <label style={{display:"inline-flex",alignItems:"center",gap:4}}>scale%
          <input type="range" min={10} max={400} defaultValue={100} onChange={e=>setScale(e.target.value)} />
        </label>
        {L.type==="image" && (
          <select value={L.filter||"Original"} onChange={e=>setFilter(e.target.value)}>
            {["Original","Gamma","Hudson","Vignette","Amaro","Grayscale","Valencia","Sutro"].map(f =>
              <option key={f} value={f}>{f}</option>
            )}
          </select>
        )}
      </div>
    );
  }

  return (
    <div className="editor-canvas-wrap" style={{ position:"relative", width, height }}>
      <MiniToolbar />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{ width:"100%", height:"100%", cursor:"default", background:"#fff" }}
      />
    </div>
  );

  // локальные обработчики внизу (чтобы не таскать наверх хелперы)
  function onMouseDown(e){ /* объявлено выше через function, но нужно в JSX */ }
  function onMouseMove(e){ /* объявлено выше через function, но нужно в JSX */ }
  function onMouseUp(){ /* объявлено выше через function, но нужно в JSX */ }
});

export default EditorCanvas;

