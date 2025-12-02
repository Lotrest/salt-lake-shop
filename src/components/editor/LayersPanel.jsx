import React from "react";

export default function LayersPanel({
  layers = [],
  activeId,
  onSelect,
  onToggleVisible,
  onToggleLock,
  onReorder,      // (id, 'up'|'down')
  onDuplicate,    // (id)
  onDelete,       // (id)
}) {
  return (
    <div className="space-y-2">
      {layers.map((l, idx) => (
        <div key={l.id}
             className={`flex items-center gap-2 rounded-xl px-3 py-2 border cursor-pointer ${activeId===l.id ? 'ring-2 ring-blue-400' : ''}`}
             style={{ background:'var(--slk-surface)', borderColor:'var(--slk-border)', color:'var(--slk-text)' }}
             onClick={()=>onSelect?.(l.id)}
        >
          <span className="text-xs rounded px-1.5 py-0.5"
                style={{ background:'var(--slk-chip)', color:'var(--slk-text)' }}>
            {l.type === 'text' ? 'TXT' : 'IMG'}
          </span>

          <div className="text-sm flex-1 truncate" title={l.type==='text' ? (l.text || 'Текст') : (l.src || 'Картинка')}>
            {l.type === 'text' ? (l.text || 'Ваш текст') : (l.name || 'Картинка')}
          </div>

          <div className="flex items-center gap-1">
            <IconBtn title="Вверх" onClick={(e)=>{e.stopPropagation(); onReorder?.(l.id,'up');}}>▲</IconBtn>
            <IconBtn title="Вниз"  onClick={(e)=>{e.stopPropagation(); onReorder?.(l.id,'down');}}>▼</IconBtn>
            <IconBtn title={l.visible===false?'Показать':'Скрыть'} onClick={(e)=>{e.stopPropagation(); onToggleVisible?.(l.id);}}>
              {l.visible===false ? '🚫' : '👁️'}
            </IconBtn>
            <IconBtn title={l.locked?'Разблокировать':'Заблокировать'} onClick={(e)=>{e.stopPropagation(); onToggleLock?.(l.id);}}>
              {l.locked ? '🔓' : '🔒'}
            </IconBtn>
            <IconBtn title="Дублировать" onClick={(e)=>{e.stopPropagation(); onDuplicate?.(l.id);}}>⎘</IconBtn>
            <IconBtn title="Удалить" onClick={(e)=>{e.stopPropagation(); onDelete?.(l.id);}}>🗑</IconBtn>
          </div>
        </div>
      ))}
      {!layers.length && (
        <div className="text-xs opacity-70" style={{ color:'var(--slk-muted)' }}>
          Слои появятся после добавления текста/картинки
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, title }) {
  return (
    <button title={title} onClick={onClick}
            className="text-xs rounded-lg px-2 py-1 border"
            style={{ borderColor:'var(--slk-border)' }}>
      {children}
    </button>
  );
}
