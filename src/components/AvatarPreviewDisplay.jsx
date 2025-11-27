import React, { useEffect, useRef } from "react";

const SKIN_TONE_MAP = {
  1: "very_pale_skin_mask_fit_silhouette.png",
  2: "fair_light_skin_mask_fit_silhouette.png",
  3: "light_beige_skin_mask_fit_silhouette.png",
  4: "warm_medium_skin_mask_fit_silhouette.png",
  5: "olive_tan_skin_mask_fit_silhouette.png",
  6: "medium_brown_skin_mask_fit_silhouette.png",
  7: "deep_dark_brown_skin_mask_fit_silhouette.png",
  8: "very_dark_black_skin_mask_fit_silhouette.png",
};

export default function AvatarPreviewDisplay({ avatar = {}, size = "large" }) {
  const canvasRef = useRef(null);
  
  const sizeClasses = {
    small: "w-24 h-24",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  };

  const sizePx = {
    small: 96,
    medium: 128,
    large: 192,
  };

  const gender = avatar.gender || "female";
  const silhouetteIndex = avatar.silhouetteIndex || 1;
  const skinToneIndex = avatar.skinToneIndex || 1;

  const silhouetteImage = `/src/assets/avatar/base/${gender}_silhouette_base_${silhouetteIndex}.png`;
  const skinToneImage = `/src/assets/avatar/skin/${SKIN_TONE_MAP[skinToneIndex]}`;
  const canvasSize = sizePx[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img1 = new Image();
    const img2 = new Image();

    img1.crossOrigin = "anonymous";
    img2.crossOrigin = "anonymous";

    let loadedCount = 0;

    const onLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        // Clear canvas
        ctx.clearRect(0, 0, canvasSize, canvasSize);

        // Draw skin tone
        ctx.drawImage(img2, 0, 0, canvasSize, canvasSize);

        // Use silhouette as mask - draw it with destination-in blend mode
        ctx.globalCompositeOperation = "destination-in";
        ctx.drawImage(img1, 0, 0, canvasSize, canvasSize);

        // Draw silhouette outline on top
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(img1, 0, 0, canvasSize, canvasSize);
      }
    };

    img1.onload = onLoad;
    img2.onload = onLoad;

    img1.src = silhouetteImage;
    img2.src = skinToneImage;
  }, [silhouetteImage, skinToneImage, canvasSize]);

  return (
    <div className={`${sizeClasses[size]} mx-auto relative rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-2 border-cyan-500/20 overflow-hidden flex items-center justify-center`}>
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        className="w-full h-full"
      />
    </div>
  );
}
