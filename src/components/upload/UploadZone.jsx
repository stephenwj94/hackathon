import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function UploadZone({ company, onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (files?.[0]) {
      processFile(files[0]);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      onUpload(text, file.name);
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
        isDragging
          ? 'border-permira-orange bg-permira-orange/5'
          : 'border-permira-border hover:border-permira-orange/50'
      }`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById(`upload-${company.slug}`).click()}
    >
      <div className="flex items-center gap-2 justify-center mb-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: company.color }} />
        <span className="font-semibold text-sm">{company.name}</span>
      </div>

      {fileName ? (
        <div className="text-xs text-permira-success">
          ✓ {fileName}
        </div>
      ) : (
        <div className="text-xs text-permira-text-secondary">
          Drop CSV here or click to browse
        </div>
      )}

      <input
        id={`upload-${company.slug}`}
        type="file"
        accept=".csv"
        onChange={handleFileInput}
        className="hidden"
      />
    </motion.div>
  );
}
