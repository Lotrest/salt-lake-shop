// frontend/src/components/editor/TextToolbar.jsx
export default function TextToolbar({ layer, onChange }) {
  if (!layer) return null;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-2">
        {/* цвет текста */}
        <input
          type="color"
          value={layer.color || '#000000'}
          onChange={(e) => onChange({ color: e.target.value })}
        />

        {/* семейство шрифта */}
        <select
          value={layer.fontFamily || 'System'}
          onChange={(e) =>
            onChange({
              fontFamily:
                e.target.value === 'System'
                  ? 'system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif'
                  : e.target.value,
            })
          }
          className="border rounded px-2 py-1"
        >
          <option>System</option>
          <option>Inter, sans-serif</option>
          <option>Montserrat, sans-serif</option>
          <option>Roboto, sans-serif</option>
        </select>

        {/* размер шрифта */}
        <input
          type="range"
          min={10}
          max={200}
          value={layer.fontSize || 36}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
        />
        <span>{layer.fontSize || 36}px</span>
      </div>

      <div className="flex gap-1">
        <button className="border rounded px-2" onClick={() => onChange({ bold: !layer.bold })}>
          B
        </button>
        <button className="border rounded px-2" onClick={() => onChange({ italic: !layer.italic })}>
          I
        </button>
        <button className="border rounded px-2" onClick={() => onChange({ align: 'left' })}>
          L
        </button>
        <button className="border rounded px-2" onClick={() => onChange({ align: 'center' })}>
          C
        </button>
        <button className="border rounded px-2" onClick={() => onChange({ align: 'right' })}>
          R
        </button>
      </div>
    </div>
  );
}
