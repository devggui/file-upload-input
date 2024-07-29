'use client'

import { FileUploadInput } from "./_components/file-upload-input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFFileUploadInput } from "./_components/pdf-upload-input";

const schema = z.object({
  anexo: z.array(z.string()).optional(),
  pdf: z.array(z.string()).optional()
})

type FormData = z.infer<typeof schema>

export default function Home() {
  const {
    register,
    setValue,
  } = useForm<FormData>({ resolver: zodResolver(schema) })
  
  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <label>Anexar</label>
        <FileUploadInput
          name="anexo"
          register={register}    
          setValue={setValue}   
        />
      </div>

      <div className="flex flex-col gap-1">
        <label>PDF Anexar</label>
        <PDFFileUploadInput 
          name="pdf"
          register={register}    
          setValue={setValue}  
        />
      </div>
    </form>
  );
}
