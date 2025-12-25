"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Rect,
  Transformer,
  Text,
} from "react-konva";
import { useEffect, useRef, useState } from "react";

const SHIRT_MAP: Record<string, string> = {
  black: "/tshirts/black.png",
  navy: "/tshirts/navy.png",
  maroon: "/tshirts/maroon.png",
  darkgrey: "/tshirts/darkgrey.png",
  white: "/tshirts/white.png",
};

type ControlBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shirt = searchParams.get("shirt") || "white";
  const shirtImage = SHIRT_MAP[shirt] || SHIRT_MAP.white;

  const [uploadedImg, setUploadedImg] = useState<HTMLImageElement | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [controlBox, setControlBox] = useState<ControlBox | null>(null);

  const imageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* Update bounding box safely */
  const updateControlBox = () => {
    if (!imageRef.current) return;
    const box = imageRef.current.getClientRect();
    setControlBox(box);
  };

  /* Attach transformer */
  useEffect(() => {
    if (showControls && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer()?.batchDraw();
      updateControlBox();
    }
  }, [showControls]);

  /* Upload image */
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new window.Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      setUploadedImg(img);
      setShowControls(false);
      setControlBox(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
  };

  /* Delete image */
  const deleteImage = () => {
    setUploadedImg(null);
    setShowControls(false);
    setControlBox(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "24px",
        fontFamily: "Arial",
        color: "#f9fafb",
      }}
    >
      {/* Back */}
      <button
        onClick={() => router.push("/")}
        style={{
          marginBottom: "16px",
          background: "transparent",
          border: "none",
          color: "#a855f7",
          cursor: "pointer",
          fontSize: "15px",
        }}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: "26px" }}>Design Your T-Shirt</h1>
      <p style={{ color: "#cbd5e1" }}>
        Editing: <b>{shirt.toUpperCase()}</b> T-shirt
      </p>

      <div style={{ display: "flex", gap: "24px", marginTop: "20px" }}>
        {/* TOOLS */}
        <div
          style={{
            width: "220px",
            background: "#1f2933",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          <label style={toolBtn}>
            Upload Image
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={onUpload}
            />
          </label>
        </div>

        {/* CANVAS */}
        <div
          style={{
            flex: 1,
            background: "#111827",
            padding: "24px",
            borderRadius: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 360,
              height: 420,
              background: shirt === "white" ? "#e5e7eb" : "#ffffff",
              borderRadius: "18px",
              position: "relative",
            }}
          >
            {/* Shirt */}
            <img
              src={shirtImage}
              alt="shirt"
              style={{
                width: "70%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            />

            <Stage
              width={360}
              height={420}
              onMouseDown={(e) => {
                if (e.target === e.target.getStage()) {
                  setShowControls(false);
                  setControlBox(null);
                }
              }}
            >
              {/* MAIN LAYER */}
              <Layer>
                <Rect
                  x={118}
                  y={134}
                  width={120}
                  height={185}
                  stroke="#a855f7"
                  dash={[6, 4]}
                />

                {uploadedImg && (
                  <KonvaImage
                    ref={imageRef}
                    image={uploadedImg}
                    x={140}
                    y={160}
                    width={80}
                    height={80}
                    draggable
                    onClick={() => {
                      setShowControls(true);
                      updateControlBox();
                    }}
                    onTap={() => {
                      setShowControls(true);
                      updateControlBox();
                    }}
                    onDragMove={updateControlBox}
                    onTransformEnd={updateControlBox}
                  />
                )}

                {showControls && (
                  <Transformer
                    ref={trRef}
                    rotateEnabled={false}
                    borderStroke="#a855f7"
                    anchorStroke="#a855f7"
                    anchorFill="#a855f7"
                    anchorSize={8}
                  />
                )}
              </Layer>

              {/* UI LAYER */}
              <Layer listening>
                {showControls && controlBox && (
                  <Text
                    text="✕"
                    fontSize={16}
                    fill="#ef4444"
                    x={controlBox.x + controlBox.width - 6}
                    y={controlBox.y - 18}
                    cursor="pointer"
                    onClick={deleteImage}
                  />
                )}
              </Layer>
            </Stage>
          </div>
        </div>
      </div>
    </div>
  );
}

const toolBtn: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "none",
  background: "#374151",
  color: "#f9fafb",
  cursor: "pointer",
};
