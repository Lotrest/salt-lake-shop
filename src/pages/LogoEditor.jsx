import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric-with-gestures";
import {
  Download,
  ImagePlus,
  Type,
  ShoppingCart,
  Sparkles,
  Trash2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Droplet,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useTranslation } from "react-i18next";

const API =
  import.meta.env.VITE_API_BASE ||
  "https://my-backend-production-3416.up.railway.app";

// размеры для всей логопродукции
const PRODUCT_SIZES = {
  toothBoxes: { w: 2128, h: 356 },
  shoeSponge: { w: 876, h: 596 },
  cosmeticKit: { w: 972, h: 632 },
  comb: { w: 1560, h: 448 },
  showerCap: { w: 980, h: 632 },
  sewingKit: { w: 892, h: 652 },
  shavingKit: { w: 1420, h: 557 },
  slippers: { w: 1200, h: 700 },
  robes: { w: 1800, h: 1200 },
};

const FONTS = ["Arial", "Roboto", "Montserrat", "Playfair Display", "Georgia", "Verdana"];

const PADDING = 24;
const AUTO_REMOVE_BG = false;
const BG_TOLERANCE_DEFAULT = 28;

export default function LogoEditor() {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selected, setSelected] = useState(null);
  const [textValue, setTextValue] = useState(t("logoEditor.defaultText"));
  const [prompt, setPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [fillColor, setFillColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState(36);
  const [productType, setProductType] = useState("toothBoxes");
  const [boxColor, setBoxColor] = useState("#ffffff");
  const [bgTolerance, setBgTolerance] = useState(BG_TOLERANCE_DEFAULT);
  const { addToCart } = useCart();

  // === helpers ===
  const centerCoords = () => ({
    left: canvas.getWidth() / 2,
    top: canvas.getHeight() / 2,
    originX: "center",
    originY: "center",
  });

  const fitIntoSafeArea = (obj) => {
    if (!canvas || !obj) return;
    const maxW = canvas.getWidth() - PADDING * 2;
    const maxH = canvas.getHeight() - PADDING * 2;
    obj.set({ scaleX: obj.scaleX || 1, scaleY: obj.scaleY || 1 });
    obj.setCoords();
    const bounds = obj.getBoundingRect(true);
    if (bounds.width > maxW || bounds.height > maxH) {
      const kx = maxW / bounds.width;
      const ky = maxH / bounds.height;
      const k = Math.min(kx, ky);
      obj.scaleX = (obj.scaleX || 1) * k;
      obj.scaleY = (obj.scaleY || 1) * k;
    }
    obj.setCoords();
  };

  const addCenteredObject = (obj) => {
    obj.set(centerCoords());
    fitIntoSafeArea(obj);
    canvas.add(obj).setActiveObject(obj);
    canvas.requestRenderAll();
  };

  const removeBgFromDataUrl = (dataUrl, tolerance = BG_TOLERANCE_DEFAULT) =>
    new Promise((resolve) => {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const off = document.createElement("canvas");
          off.width = img.width;
          off.height = img.height;
          const ctx = off.getContext("2d");
          ctx.drawImage(img, 0, 0);

          const { data, width, height } = ctx.getImageData(0, 0, off.width, off.height);
          const getPx = (x, y) => {
            const i = (y * width + x) * 4;
            return [data[i], data[i + 1], data[i + 2]];
          };

          const samples = [
            getPx(0, 0),
            getPx(width - 1, 0),
            getPx(0, height - 1),
            getPx(width - 1, height - 1),
          ];
          const avg = samples.reduce((a, c) => [a[0] + c[0], a[1] + c[1], a[2] + c[2]], [0, 0, 0])
            .map((v) => v / samples.length);

          const dist = (r1, g1, b1, r2, g2, b2) =>
            Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
          const thr = Math.max(4, Math.min(441, tolerance * 4.41));
          const imgData = ctx.getImageData(0, 0, off.width, off.height);
          const d = imgData.data;
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const i = (y * width + x) * 4;
              const r = d[i], g = d[i + 1], b = d[i + 2];
              if (dist(r, g, b, avg[0], avg[1], avg[2]) < thr) d[i + 3] = 0;
            }
          }
          ctx.putImageData(imgData, 0, 0);
          resolve(off.toDataURL("image/png"));
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      } catch {
        resolve(dataUrl);
      }
    });

  const extractDataUrlFromImageObject = (imgObj) =>
    new Promise((resolve) => {
      const el = imgObj.getElement?.() || imgObj._originalElement || imgObj._element;
      if (!el) {
        try {
          resolve(imgObj.toDataURL({ format: "png" }));
        } catch {
          resolve(null);
        }
        return;
      }
      const c = document.createElement("canvas");
      const w = el.naturalWidth || el.videoWidth || el.width;
      const h = el.naturalHeight || el.videoHeight || el.height;
      if (!w || !h) return resolve(null);
      c.width = w;
      c.height = h;
      c.getContext("2d").drawImage(el, 0, 0);
      resolve(c.toDataURL("image/png"));
    });

  // === CANVAS INIT ===
  useEffect(() => {
    const { w, h } = PRODUCT_SIZES[productType];
    const c = new fabric.Canvas(canvasRef.current, {
      width: w / 3,
      height: h / 3,
      backgroundColor: boxColor,
      selection: true,
      preserveObjectStacking: true,
    });
    c.on("selection:created", (e) => setSelected(e.selected[0]));
    c.on("selection:updated", (e) => setSelected(e.selected[0]));
    c.on("selection:cleared", () => setSelected(null));
    setCanvas(c);
    return () => c.dispose();
  }, []);

  useEffect(() => {
    if (!canvas) return;
    canvas.setBackgroundColor(boxColor, canvas.requestRenderAll.bind(canvas));
  }, [boxColor, canvas]);

  useEffect(() => {
    if (!canvas) return;
    const prevW = canvas.getWidth();
    const prevH = canvas.getHeight();
    const newW = PRODUCT_SIZES[productType].w / 3;
    const newH = PRODUCT_SIZES[productType].h / 3;
    if (prevW === 0 || prevH === 0) {
      canvas.setWidth(newW);
      canvas.setHeight(newH);
      canvas.requestRenderAll();
      return;
    }
    const scaleX = newW / prevW;
    const scaleY = newH / prevH;
    canvas.getObjects().forEach((obj) => {
      obj.left *= scaleX;
      obj.top *= scaleY;
      obj.scaleX = (obj.scaleX || 1) * scaleX;
      obj.scaleY = (obj.scaleY || 1) * scaleY;
      obj.setCoords();
    });
    canvas.setWidth(newW);
    canvas.setHeight(newH);
    canvas.requestRenderAll();
  }, [productType, canvas]);

  useEffect(() => {
    if (!canvas) return;
    const observer = new MutationObserver(() => canvas.renderAll());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [canvas]);

  const addText = () => {
    if (!canvas) return;
    const maxW = canvas.getWidth() - PADDING * 2;
    const text = new fabric.Textbox(textValue, {
      fontSize,
      fill: fillColor,
      fontFamily,
      textAlign: "center",
      width: Math.max(60, maxW),
      ...centerCoords(),
    });
    addCenteredObject(text);
  };

  const safeUpdate = (fn) => {
    if (!selected || selected.type !== "textbox") return;
    const prev = selected.toObject();
    fn(selected);
    selected.setCoords();
    canvas.requestRenderAll();
  };

  const updateSelectedText = (changes) => {
    if (selected && selected.type === "textbox") {
      selected.set({ ...changes, originX: "center", originY: "center" });
      if (changes.fontSize || changes.textAlign || changes.fontFamily) {
        const maxW = canvas.getWidth() - PADDING * 2;
        selected.set({ width: Math.max(60, Math.min(selected.width ?? maxW, maxW)) });
      }
      selected.set(centerCoords());
      canvas.renderAll();
    }
  };

  const toggleBold = () => safeUpdate((obj) => obj.set({ fontWeight: obj.fontWeight === "bold" ? "normal" : "bold" }));
  const toggleItalic = () => safeUpdate((obj) => obj.set({ fontStyle: obj.fontStyle === "italic" ? "normal" : "italic" }));
  const toggleUnderline = () => safeUpdate((obj) => obj.set({ underline: !obj.underline }));

  const deleteSelected = () => {
    if (canvas && selected) {
      canvas.remove(selected);
      setSelected(null);
      canvas.renderAll();
    }
  };

  const addImage = (file) => {
    if (!canvas || !file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      let src = e.target.result;
      if (AUTO_REMOVE_BG) {
        try { src = await removeBgFromDataUrl(src, bgTolerance); } catch {}
      }
      fabric.Image.fromURL(
        src,
        (img) => {
          img.set({ crossOrigin: "anonymous" });
          img._originalSrc = e.target.result;
          addCenteredObject(img);
        },
        { crossOrigin: "anonymous" }
      );
    };
    reader.readAsDataURL(file);
  };

  const removeBgForSelectedImage = async () => {
    if (!canvas || !selected || selected.type !== "image") {
      alert(t("logoEditor.alerts.selectImage"));
      return;
    }
    try {
      const orig = {
        left: selected.left,
        top: selected.top,
        originX: selected.originX,
        originY: selected.originY,
        angle: selected.angle,
        scaleX: selected.scaleX,
        scaleY: selected.scaleY,
        flipX: selected.flipX,
        flipY: selected.flipY,
      };

      const src = selected._originalSrc || (await extractDataUrlFromImageObject(selected));
      if (!src) return alert(t("logoEditor.alerts.readError"));

      const cleaned = await removeBgFromDataUrl(src, bgTolerance);

      fabric.Image.fromURL(
        cleaned,
        (img2) => {
          img2.set({ crossOrigin: "anonymous", ...orig });
          img2._originalSrc = selected._originalSrc || src;
          canvas.remove(selected);
          canvas.add(img2).setActiveObject(img2);
          canvas.requestRenderAll();
        },
        { crossOrigin: "anonymous" }
      );
    } catch (e) {
      console.error(e);
      alert(t("logoEditor.errors.bgRemoveFailed"));
    }
  };

  const restoreOriginalForSelectedImage = () => {
    if (!canvas || !selected || selected.type !== "image" || !selected._originalSrc) return;
    const orig = {
      left: selected.left,
      top: selected.top,
      originX: selected.originX,
      originY: selected.originY,
      angle: selected.angle,
      scaleX: selected.scaleX,
      scaleY: selected.scaleY,
      flipX: selected.flipX,
      flipY: selected.flipY,
    };
    fabric.Image.fromURL(
      selected._originalSrc,
      (img2) => {
        img2.set({ crossOrigin: "anonymous", ...orig });
        img2._originalSrc = selected._originalSrc;
        canvas.remove(selected);
        canvas.add(img2).setActiveObject(img2);
        canvas.requestRenderAll();
      },
      { crossOrigin: "anonymous" }
    );
  };

  const generateAIImage = async () => {
    if (!prompt.trim()) return alert(t("logoEditor.alerts.enterPrompt"));
    try {
      setLoadingAI(true);
      const res = await fetch(`${API}/api/designs/temp/ai-generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data.error || "AI error");
      const imgUrl = data.url || data.imageUrl;

      fabric.Image.fromURL(
        imgUrl,
        (img) => {
          img.set({ crossOrigin: "anonymous" });
          img._originalSrc = imgUrl;
          addCenteredObject(img);
        },
        { crossOrigin: "anonymous" }
      );
    } catch (e) {
      console.error("AI error:", e);
      alert(t("logoEditor.errors.aiFailed"));
    } finally {
      setLoadingAI(false);
    }
  };

  const saveDesign = async () => {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: "png", quality: 0.95 });
    try {
      const res = await fetch(`${API}/api/designs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productType,
          sceneJson: JSON.stringify({ image: dataUrl }),
          printColor: boxColor,
        }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data.error || t("logoEditor.errors.saveFailed"));
      const designId = data.design.id;
      const renderRes = await fetch(`${API}/api/designs/${designId}/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          printPngBase64: dataUrl,
          mockupPngBase64: dataUrl,
          width: canvas.getWidth(),
          height: canvas.getHeight(),
        }),
      });
      const renderData = await renderRes.json();
      if (!renderData?.success) throw new Error(renderData.error || t("logoEditor.errors.renderFailed"));
      addToCart({
        id: "design-" + designId,
        name: `${productType} (${t("logoEditor.cartDesign")})`,
        price: "0",
        quantity: 1,
        image: renderData.design.thumbUrl || dataUrl,
      });
      alert(t("logoEditor.success.addedToCart"));
    } catch (err) {
      console.error("Save design error:", err);
      alert(t("logoEditor.errors.saveFailed"));
    }
  };

  const downloadImage = () => {
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: "png", quality: 1 });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${productType}-design.png`;
    link.click();
  };

  // === UI ===
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center py-8 px-4 transition-colors">
      <h1 className="text-3xl font-bold mb-4">{t("logoEditor.title")}</h1>

      {/* Тип продукции */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center items-center">
        <label>
          <span className="mr-2">{t("logoEditor.productType")}:</span>
          <select
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            className="rounded px-2 py-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            {Object.keys(PRODUCT_SIZES).map((k) => (
              <option key={k} value={k}>{t(`logoEditor.productTypes.${k}`)}</option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-2 ml-4">
          <Droplet className="text-blue-500" />
          <span>{t("logoEditor.boxColor")}:</span>
          <input
          type="color"
          value={boxColor}
          onChange={(e) => setBoxColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-gray-300 dark:border-gray-700"
          />
        </div>
      </div>
  {/* Панель текста */}
  {selected?.type === "textbox" && (
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4 flex flex-wrap gap-3 justify-center items-center shadow-sm">
      <input
        type="color"
        value={fillColor}
        onChange={(e) => {
          setFillColor(e.target.value);
          updateSelectedText({ fill: e.target.value });
        }}
      />
      <select
        value={fontFamily}
        onChange={(e) => {
          setFontFamily(e.target.value);
          updateSelectedText({ fontFamily: e.target.value });
        }}
        className="rounded px-2 py-1 bg-white dark:bg-gray-700"
      >
        {FONTS.map((f) => (
          <option key={f}>{f}</option>
        ))}
      </select>
      <input
        type="number"
        min="8"
        max="120"
        value={fontSize}
        onChange={(e) => {
          const size = parseInt(e.target.value);
          setFontSize(size);
          updateSelectedText({ fontSize: size });
        }}
        className="rounded px-2 py-1 w-16 bg-white dark:bg-gray-700"
      />
      <button onClick={toggleBold} className="hover:text-yellow-400"><Bold size={18} /></button>
      <button onClick={toggleItalic} className="hover:text-yellow-400"><Italic size={18} /></button>
      <button onClick={toggleUnderline} className="hover:text-yellow-400"><Underline size={18} /></button>
      <button onClick={() => updateSelectedText({ textAlign: "left" })}><AlignLeft size={18} /></button>
      <button onClick={() => updateSelectedText({ textAlign: "center" })}><AlignCenter size={18} /></button>
      <button onClick={() => updateSelectedText({ textAlign: "right" })}><AlignRight size={18} /></button>
    </div>
  )}

  {/* Панель изображения */}
  {selected?.type === "image" && (
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4 flex flex-wrap gap-4 justify-center items-center shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm">{t("logoEditor.bgTolerance")}:</span>
        <input
          type="range"
          min={0}
          max={100}
          value={bgTolerance}
          onChange={(e) => setBgTolerance(parseInt(e.target.value))}
        />
        <span className="text-xs opacity-70 w-8 text-right">{bgTolerance}</span>
      </div>
      <button
        onClick={removeBgForSelectedImage}
        className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {t("logoEditor.removeBg")}
      </button>
      {selected?._originalSrc && (
        <button
          onClick={restoreOriginalForSelectedImage}
          className="px-3 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-black"
        >
          {t("logoEditor.restoreOriginal")}
        </button>
      )}
    </div>
  )}

  {/* AI */}
  <div className="flex flex-wrap gap-3 mb-5 justify-center">
    <input
      type="text"
      placeholder={t("logoEditor.promptPlaceholder")}
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      className="px-3 py-2 rounded-lg w-72 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
    />
    <button
      disabled={loadingAI}
      onClick={generateAIImage}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 text-white ${
        loadingAI
          ? "bg-gray-600"
          : "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
      }`}
    >
      <Sparkles size={18} />
      {loadingAI ? t("logoEditor.generating") : t("logoEditor.aiLogo")}
    </button>
  </div>

  {/* Основные кнопки */}
  <div className="flex flex-wrap gap-3 mb-4 justify-center">
    <button onClick={addText} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2">
      <Type size={18} /> {t("logoEditor.addText")}
    </button>
    <label className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
      <ImagePlus size={18} /> {t("logoEditor.addImage")}
      <input type="file" accept="image/*" hidden onChange={(e) => addImage(e.target.files?.[0])} />
    </label>
    <button onClick={deleteSelected} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center gap-2">
      <Trash2 size={18} /> {t("logoEditor.delete")}
    </button>
    <button onClick={downloadImage} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center gap-2">
      <Download size={18} /> {t("logoEditor.download")}
    </button>
    <button onClick={saveDesign} className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-2 rounded-lg flex items-center gap-2">
      <ShoppingCart size={18} /> {t("logoEditor.toCart")}
    </button>
  </div>

  {/* CANVAS */}
  <div className="bg-white p-3 rounded-lg shadow-md border border-gray-300 dark:border-gray-700">
    <canvas ref={canvasRef} />
  </div>
</div>
);
}