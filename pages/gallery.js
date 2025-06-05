import React, { useEffect, useState } from "react";
import { sanity } from "../lib/sanity";
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(sanity);
function urlFor(source) {
  return builder.image(source).auto('format').fit('max').url();
}

export default function Gallery() {
  const [categories, setCategories] = useState([]);
  const [models, setModels] = useState([]);
  const [buses, setBuses] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedBus, setSelectedBus] = useState("");
  const [previewImg, setPreviewImg] = useState(null); // { img, imgUrl }

  // Fetch all categories on mount
  useEffect(() => {
    sanity.fetch(`*[_type == "category"]{_id, title}`).then(setCategories);
  }, []);

  // Fetch models when category selected
  useEffect(() => {
    if (!selectedCategory) return setModels([]);
    sanity
      .fetch(
        `*[_type == "model" && parentCategory._ref == $catId]{_id, title}`,
        { catId: selectedCategory }
      )
      .then(setModels);
    setSelectedModel("");
    setBuses([]);
    setSelectedBus("");
    setImages([]);
  }, [selectedCategory]);

  // Fetch buses when model selected
  useEffect(() => {
    if (!selectedModel) return setBuses([]);
    sanity
      .fetch(
        `*[_type == "bus" && model._ref == $modelId]{_id, serialNumber}`,
        { modelId: selectedModel }
      )
      .then(setBuses);
    setSelectedBus("");
    setImages([]);
  }, [selectedModel]);

  // Fetch images when bus selected
  useEffect(() => {
    if (!selectedBus) return setImages([]);
    sanity
      .fetch(
        `*[_type == "busImage" && bus._ref == $busId]{_id, label, image}`,
        { busId: selectedBus }
      )
      .then(setImages);
  }, [selectedBus]);

  // WhatsApp share: single image
  function handleWhatsAppShareImage(imgUrl) {
    const text = `Check out this bus photo from Gobind Coach: ${imgUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  }
  // WhatsApp share: all images
  function handleWhatsAppShareBus() {
    const text = `View all images for this bus on Gobind Coach Gallery!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  }

  // Download an image
  async function handleDownloadImage(imgUrl, label = "bus-image") {
    const response = await fetch(imgUrl);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${label}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  // Modal: close on background or ESC
  useEffect(() => {
    if (!previewImg) return;
    const listener = (e) => {
      if (e.key === "Escape") setPreviewImg(null);
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [previewImg]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-800 drop-shadow">Bus Image Gallery</h1>

      {/* Category Dropdown */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">--Select Category--</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Model Dropdown */}
      {models.length > 0 && (
        <div className="mb-4">
          <label className="font-semibold mr-2">Model:</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">--Select Model--</option>
            {models.map((m) => (
              <option key={m._id} value={m._id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Bus Dropdown */}
      {buses.length > 0 && (
        <div className="mb-4">
          <label className="font-semibold mr-2">Bus:</label>
          <select
            value={selectedBus}
            onChange={(e) => setSelectedBus(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">--Select Bus--</option>
            {buses.map((bus) => (
              <option key={bus._id} value={bus._id}>
                {bus.serialNumber}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* WhatsApp Share for Folder */}
      {selectedBus && images.length > 0 && (
        <div className="mb-4">
          <button
            className="bg-green-600 text-white rounded px-3 py-1 font-semibold"
            onClick={handleWhatsAppShareBus}
          >
            Share Entire Bus Folder via WhatsApp
          </button>
        </div>
      )}

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((img) => {
          let imgUrl = "";
          if (img.image && img.image.asset) {
            imgUrl = urlFor(img.image);
          }
          return (
            <div
              key={img._id}
              className="border rounded-xl shadow hover:shadow-xl bg-white p-3 flex flex-col items-center cursor-pointer transition-all"
              onClick={() => imgUrl && setPreviewImg({ img, imgUrl })}
            >
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt={img.label}
                  className="w-full h-40 object-cover rounded-xl mb-2 border"
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-gray-400 bg-gray-100 rounded-xl mb-2 border">
                  No Image
                </div>
              )}
              <div className="font-medium">{img.label}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleWhatsAppShareImage(imgUrl);
                }}
                className="mt-2 bg-green-500 text-white px-2 py-1 rounded text-sm shadow"
              >
                WhatsApp Image
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await handleDownloadImage(imgUrl, img.label);
                }}
                className="mt-1 bg-blue-500 text-white px-2 py-1 rounded text-sm shadow"
              >
                Download
              </button>
            </div>
          );
        })}
      </div>

      {/* Image Preview Modal */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center transition"
          onClick={() => setPreviewImg(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute top-2 right-2 text-gray-600 text-2xl hover:text-red-500"
              title="Close"
            >
              ×
            </button>
            <img
              src={previewImg.imgUrl}
              alt={previewImg.img.label}
              className="w-full max-h-[400px] object-contain rounded-xl mb-4"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="text-lg font-bold mb-2">{previewImg.img.label}</div>
              <div className="flex gap-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded font-semibold"
                  onClick={() => handleWhatsAppShareImage(previewImg.imgUrl)}
                >
                  WhatsApp Image
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                  onClick={async () => await handleDownloadImage(previewImg.imgUrl, previewImg.img.label)}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
