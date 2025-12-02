import React, { useCallback } from 'react';
import { useEditorStore } from '../editor/useEditorStore';
import EditorCanvas from '../editor/EditorCanvas';
import EditorSidebar from '../editor/EditorSidebar';
import { useTranslation } from 'react-i18next';
import './editor-theme.css';

export default function LogoConstructor() {
  const { t } = useTranslation();
  const store = useEditorStore({});
  const { layers, setLayers, designId, setDesignId, productKey, requestSave } = store;

  const ensureDesign = useCallback(async () => {
    if (designId) return designId;
    const r = await fetch('/api/designs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productType: productKey,
        baseProductId: productKey,
        sceneJson: '[]'
      })
    });
    const j = await r.json();
    if (j.success) {
      setDesignId(j.design.id);
      return j.design.id;
    }
    throw new Error(t('logoEditor.errors.createDesign'));
  }, [designId, productKey, setDesignId, t]);

  const onAddText = () => {
    const id = crypto.randomUUID();
    setLayers(ls => ([
      ...ls,
      {
        id,
        type: 'text',
        text: t('logoEditor.defaultText'),
        font: 'Inter',
        size: 28,
        x: 50,
        y: 50,
        w: 240,
        h: 80,
        angle: 0,
        opacity: 1
      }
    ]));
    requestSave();
  };

  const onUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToDataUrl(file);
    const id = await ensureDesign();
    const r = await fetch(`/api/designs/${id}/layers/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64: b64 })
    });
    const j = await r.json();
    if (j.success) {
      const layerId = crypto.randomUUID();
      setLayers(ls => ([...ls, { id: layerId, type: 'image', src: j.url, x: 80, y: 80, w: 300, h: 200, angle: 0, opacity: 1 }]));
      requestSave();
    } else {
      alert(t('logoEditor.errors.uploadFailed'));
    }
    e.target.value = '';
  };

  const onGenerateAI = async (prompt) => {
    if (!prompt?.trim()) return;
    const id = await ensureDesign();
    const r = await fetch(`/api/designs/${id}/ai-generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, size: '1024x1024' })
    });
    const j = await r.json();
    if (j.success) {
      const layerId = crypto.randomUUID();
      setLayers(ls => ([...ls, { id: layerId, type: 'image', src: j.url, x: 120, y: 120, w: 320, h: 320, angle: 0, opacity: 1 }]));
      requestSave();
    } else {
      alert(j.message || t('logoEditor.errors.aiFailed'));
    }
  };

  const onExport = async (mode) => {
    const id = await ensureDesign();
    const printPngBase64 = await exportPrintPng(layers, productKey);
    const mockupPngBase64 = await exportMockupPng();

    const r = await fetch(`/api/designs/${id}/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        printPngBase64,
        mockupPngBase64,
        width: 0,
        height: 0
      })
    });
    const j = await r.json();
    if (j.success) {
      if (mode === 'cart') {
        await fetch('/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: 'box',
            name: t('logoEditor.cartItemName'),
            price: '0',
            quantity: 3000,
            designId: id
          })
        });
        alert(t('logoEditor.success.addedToCart'));
      } else {
        alert(t('logoEditor.success.saved'));
      }
    } else {
      alert(t('logoEditor.errors.renderFailed'));
    }
  };

  return (
    <div className={`editor-wrap ${document.documentElement.classList.contains('light') ? 'light' : ''}`}>
      <EditorSidebar
        store={store}
        onAddText={onAddText}
        onUploadImage={onUploadImage}
        onGenerateAI={onGenerateAI}
        onExport={onExport}
      />
      <EditorCanvas store={store} />
    </div>
  );
}

// helpers
function fileToDataUrl(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(file);
  });
}

async function exportMockupPng() {
  const c = document.querySelector('.editor-canvas-wrap canvas');
  return c.toDataURL('image/png');
}

async function exportPrintPng(layers, productKey) {
  const { printSize } = (await import('../editor/templates')).PRODUCT_TEMPLATES[productKey];
  const cv = document.createElement('canvas');
  cv.width = printSize.w;
  cv.height = printSize.h;
  const ctx = cv.getContext('2d');
  return cv.toDataURL('image/png');
}
