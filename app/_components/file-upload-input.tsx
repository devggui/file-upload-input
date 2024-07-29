'use client'

import Image from "next/image";
import React, { useState } from 'react';
import { UseFormRegister, UseFormSetValue, FieldValues } from 'react-hook-form';

interface FileUploadInputProps {
  name: string;
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;  
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({ name, register, setValue }) => {
  const [images, setImages] = useState<string[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const base64Strings = await Promise.all(fileArray.map(convertToBase64));
      setImages(base64Strings);
      setValue(name, base64Strings);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setValue(name, newImages);
  };

  const handleDownloadImage = (base64: string) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = 'image.png';
    link.click();
  };

  const handleImageClick = (base64: string) => {
    const newTab = window.open();
    if (newTab) {
      newTab.document.body.innerHTML = `<img src="${base64}" alt="Image" style="width:374px; height:auto; "/>`;
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        {...register(name)}
        onChange={handleFileChange}        
        className="mb-4"
      />
      <div className="flex flex-wrap gap-4">
        {images.map((base64, index) => (
          <div key={index} className="relative">
            <Image src={base64} alt={`image-${index}`} className="object-cover" width={128} height={128} onClick={() => handleImageClick(base64)} />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
            >
              X
            </button>
            <button
              type="button"
              onClick={() => handleDownloadImage(base64)}
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};