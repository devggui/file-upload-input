'use client'

import React, { useState } from 'react';
import { UseFormRegister, UseFormSetValue, FieldValues } from 'react-hook-form';

interface FileUploadInputProps {
  name: string;
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}

export const PDFFileUploadInput: React.FC<FileUploadInputProps> = ({ name, register, setValue }) => {
  const [pdfs, setPdfs] = useState<string[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const base64Strings = await Promise.all(fileArray.map(convertToBase64));
      setPdfs(base64Strings);
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

  const handleRemovePdf = (index: number) => {
    const newPdfs = pdfs.filter((_, i) => i !== index);
    setPdfs(newPdfs);
    setValue(name, newPdfs);
  };

  const handleDownloadPdf = (base64: string) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = 'document.pdf';
    link.click();
  };

  const handlePdfClick = (base64: string) => {
    const newTab = window.open();
    if (newTab) {
      newTab.document.body.innerHTML = `<iframe src="${base64}" width="100%" height="100%"></iframe>`;
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="application/pdf"
        multiple
        {...register(name)}
        onChange={handleFileChange}
        className="mb-4"
      />
      <div className="flex flex-wrap gap-4">
        {pdfs.map((base64, index) => (
          <div key={index} className="relative">
            <div className="border p-2 cursor-pointer">
              <iframe src={base64} width="128" height="128" />
              <p className="text-center">PDF {index + 1}</p>
            </div>
            <button
              type="button"
              onClick={() => handleRemovePdf(index)}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
            >
              X
            </button>
            <button
              type="button"
              onClick={() => handleDownloadPdf(base64)}
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded"
            >
              Download
            </button>
            <button
              type="button"
              onClick={() => handlePdfClick(base64)}
              className="absolute bottom-0 left-0 bg-blue-500 text-white p-1 rounded"
            >
              Abrir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
