
import { fabric } from "fabric";
export const FILTERS = {
Original: [],
Grayscale: [ new fabric.Image.filters.Grayscale() ],
Gamma: [ new fabric.Image.filters.Gamma({ gamma: 1.1 }) ],
Vignette: [ new fabric.Image.filters.Vignette({ blur: 0.6, intensity: 0.3 }) ],
Sepia: [ new fabric.Image.filters.Sepia() ],
SaturUp: [ new fabric.Image.filters.Saturation({ saturation: 0.15 }) ],
Bright05: [ new fabric.Image.filters.Brightness({ brightness: 0.05 }) ],
Contrast10:[ new fabric.Image.filters.Contrast({ contrast: 0.10 }) ],
};
export const FILTER_PRESETS = {
Original: FILTERS.Original,
Grayscale: FILTERS.Grayscale,
Gamma: FILTERS.Gamma,
Vignette: FILTERS.Vignette,
// Instagram-like
Hudson: [ ...FILTERS.Sepia, ...FILTERS.Contrast10, ...FILTERS.SaturUp ],
Valencia: [ ...FILTERS.Sepia, ...FILTERS.Bright05, ...FILTERS.SaturUp ],
Sutro: [ ...FILTERS.Sepia, ...FILTERS.Vignette, ...FILTERS.Contrast10 ],
Amaro: [ ...FILTERS.Bright05, ...FILTERS.SaturUp ],
};
export function applyFilterToObject(obj, name, canvas) {
if (!(obj && obj.type === 'image')) return;
const arr = FILTER_PRESETS[name] || [];
obj.filters = arr;
obj.applyFilters();
canvas.requestRenderAll();
}// ===== УДАЛЕНИЕ ФОНА (chroma key) =====
export function removeBackground(obj, color = '#ffffff', distance = 0.25, canvas) {
if (!(obj && obj.type === 'image')) return;
obj.filters = obj.filters || [];
// Сначала убираем прошлые RemoveColor, чтобы не накапливать
obj.filters = obj.filters.filter(f => !(f && f.type === 'RemoveColor'));
obj.filters.push(new fabric.Image.filters.RemoveColor({ color, distance }));
obj.applyFilters();
canvas.requestRenderAll();
}
// Auto‑bg: берём пиксель 1x1 с левого верхнего угла как фон
export function autoRemoveBg(obj, canvas, distance = 0.25) {
if (!(obj && obj.type === 'image')) return;
const el = obj.getElement();
try {
const tmp = document.createElement('canvas');
tmp.width = 1; tmp.height = 1;
const ctx = tmp.getContext('2d');
ctx.drawImage(el, 0, 0, 1, 1);
const [r,g,b] = ctx.getImageData(0,0,1,1).data;
const color = `#${[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}`;
removeBackground(obj, color, distance, canvas);
} catch (e) {
// fallback
removeBackground(obj, '#ffffff', distance, canvas);
}
}
// ===== ХЕЛПЕРЫ ВЫРАВНИВАНИЯ И РАСТЯЖЕНИЯ =====
export function centerInPrintArea(obj, printArea, canvas, axis = 'both') {
const scaledW = obj.getScaledWidth();
const scaledH = obj.getScaledHeight();
const left = printArea.left + (printArea.width - scaledW) / 2;
const top = printArea.top + (printArea.height - scaledH) / 2;
if (axis === 'x' || axis === 'both') obj.left = left;
if (axis === 'y' || axis === 'both') obj.top = top;
obj.setCoords();
canvas.requestRenderAll();
}
export function fitIntoPrintArea(obj, printArea, canvas) {
const k = Math.min(
printArea.width / obj.width,
printArea.height / obj.height
);
obj.scale(k);
centerInPrintArea(obj, printArea, canvas, 'both');
}
export function clampToPrintArea(obj, printArea) {
const r = obj.getBoundingRect(true);
const paRight = printArea.left + printArea.width;
const paBottom = printArea.top + printArea.height;


if (r.left < printArea.left) obj.left += (printArea.left - r.left);
if (r.top < printArea.top) obj.top += (printArea.top - r.top);


const right = obj.left + r.width;
const bottom = obj.top + r.height;
if (right > paRight) obj.left -= (right - paRight);
if (bottom > paBottom) obj.top -= (bottom - paBottom);
}   