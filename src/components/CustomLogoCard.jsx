import React, { useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const CustomLogoCard = ({ baseImageUrl, name, price, minOrder }) => {
  const [logo, setLogo] = useState(null);
  const [baseImage] = useImage(baseImageUrl);
  const [logoImage] = useImage(logo);
  const [selectedShape, setSelectedShape] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // фиксированные стартовые зоны
  const getLogoPosition = () => {
    if (name.includes("Тапочки")) {
      return { x: 80, y: 50, width: 100, height: 60 };
    }
    if (name.includes("Халат")) {
      return { x: 120, y: 80, width: 80, height: 80 };
    }
    if (name.includes("Коробка")) {
      return { x: 70, y: 70, width: 150, height: 100 };
    }
    return { x: 100, y: 100, width: 100, height: 100 };
  };

  const logoProps = getLogoPosition();

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2">{name} с логотипом</h3>

      {/* Canvas для предпросмотра */}
      <Stage width={300} height={300}>
        <Layer>
          {/* Базовое изображение */}
          <KonvaImage image={baseImage} width={300} height={300} />

          {/* Логотип с drag-n-drop */}
          {logoImage && (
            <KonvaImage
              image={logoImage}
              {...logoProps}
              draggable
              opacity={0.85}
              globalCompositeOperation="multiply"
              onClick={(e) => setSelectedShape(e.target)}
              onTap={(e) => setSelectedShape(e.target)}
            />
          )}

          {/* Трансформер (масштабирование, вращение) */}
          {selectedShape && (
            <Transformer
              nodes={[selectedShape]}
              rotateEnabled={true}
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
              ]}
              boundBoxFunc={(oldBox, newBox) => {
                // минимальный размер логотипа
                if (newBox.width < 30 || newBox.height < 30) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>

      {/* Загрузка логотипа */}
      <input
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="mt-2 text-sm"
      />

      {/* Кнопка добавления */}
      <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        В корзину (мин. {minOrder} шт)
      </button>
    </div>
  );
};

export default CustomLogoCard;
