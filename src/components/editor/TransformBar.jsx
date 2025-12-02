import React, { useMemo } from "react";

export default function TransformBar({
  activeLayer,
  onChangeLayer,    // (draft)=>void  (меняет только активный слой)
  onDuplicate,      // ()=>void
  onDelete,         // ()=>void
  onAlign,          // ('h'|'v'|'c') => выровнять по зоне печати
  onFlip,           // ('h'|'v')
}) {
  const isText = activeLayer?.type === 'text';

  if (!activeLayer) {
    return <div className="text-sm" style={{ color:'var(--slk-muted)' }}>Выберите слой для редактирования</div>;
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium" style={{ color:'var(--slk-text)' }}>
        Свойства слоя
      </div>

      {isText && (
        <>
          <label className="block text-xs" style={{ color:'var(--slk-muted)' }}>Текст</label>
          <textarea
            className="w-full rounded-xl px-3 py-2 border"
            style={{ background:'var(--slk-surface)', color:'var(--slk-text)', borderColor:'var(--slk-border)' }}
            rows={3}
            value={activeLayer.text || ''}
            onChange={(e)=>onChangeLayer(d=>{ d.text = e.target.value; })}
          />

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs" style={{ color:'var(--slk-muted)' }}>Размер</label>
              <input type="number" min={8} max={200}
                     className="w-full rounded-xl px-3 py-2 border"
                     style={{ background:'var(--slk-surface)', color:'var(--slk-text)', borderColor:'var(--slk-border)' }}
                     value={activeLayer.fontSize || 28}
                     onChange={(e)=>onChangeLayer(d=>{ d.fontSize = Number(e.target.value||28); })}/>
            </div>
            <div>
              <label className="block text-xs" style={{ color:'var(--slk-muted)' }}>Цвет</label>
              <input type="color"
                     className="w-full h-[42px] rounded-md border"
                     style={{ borderColor:'var(--slk-border)' }}
                     value={activeLayer.color || '#000000'}
                     onChange={(e)=>onChangeLayer(d=>{ d.color = e.target.value; })}/>
            </div>
            <div>
              <label className="block text-xs" style={{ color:'var(--slk-muted)' }}>Выравнивание</label>
              <select
                className="w-full rounded-xl px-3 py-2 border"
                style={{ background:'var(--slk-surface)', color:'var(--slk-text)', borderColor:'var(--slk-border)' }}
                value={activeLayer.align || 'left'}
                onChange={(e)=>onChangeLayer(d=>{ d.align = e.target.value; })}
              >
                <option value="left">Слева</option>
                <option value="center">По центру</option>
                <option value="right">Справа</option>
              </select>
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs" style={{ color:'var(--slk-muted)' }}>Поворот (°)</label>
          <input type="number"
                 className="w-full rounded-xl px-3 py-2 border"
                 style={{ background:'var(--slk-surface)', color:'var(--slk-text)', borderColor:'var(--slk-border)' }}
                 value={Math.round(((activeLayer.rotation||0) * 180/Math.PI))}
                 onChange={(e)=>{
                   const deg = Number(e.target.value||0);
                   onChangeLayer(d=>{ d.rotation = deg * Math.PI/180; });
                 }}/>
        </div>
        <div className="flex items-end gap-2">
          <Btn onClick={()=>onFlip?.('h')}>Flip H</Btn>
          <Btn onClick={()=>onFlip?.('v')}>Flip V</Btn>
        </div>
        <div className="flex items-end gap-2">
          <Btn onClick={()=>onAlign?.('h')}>Align H</Btn>
          <Btn onClick={()=>onAlign?.('v')}>Align V</Btn>
          <Btn onClick={()=>onAlign?.('c')}>Center</Btn>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Btn onClick={()=>onDuplicate?.()}>Дублировать</Btn>
        <Btn onClick={()=>onDelete?.()} danger>Удалить</Btn>
      </div>

      <QualityBadge layer={activeLayer}/>
    </div>
  );
}

function QualityBadge({ layer }) {
  if (layer?.type !== 'image' || !layer?.__img) return null;
  const scale = (layer.width || layer.__img.width || 1) / (layer.__img.width || 1);
  const warn = scale > 1.1; // больше 110% — вероятно мыло
  return (
    <div className={`text-xs px-3 py-2 rounded-xl border ${warn?'bg-yellow-50 border-yellow-200 text-yellow-800':'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
      {warn ? 'Внимание: изображение растянуто, качество может ухудшиться' : 'Качество изображения ок'}
    </div>
  );
}

function Btn({ children, onClick, danger }) {
  return (
    <button onClick={onClick}
            className="rounded-xl px-3 py-2 text-sm"
            style={{ background: danger ? '#ef4444' : 'var(--slk-accent)', color:'#fff' }}>
      {children}
    </button>
  );
}
