import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageSelect: (image: File) => void;
  className?: string;
}

export const ImageUpload = ({ onImageSelect, className }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  /*<<<<< Drag handlers >>>>>*/
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) processImage(imageFile);
  }, []);

  /*<<<<< File input change handler >>>>>*/
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith('image/')) processImage(file);
  }, []);

  /*<<<<< Process selected image >>>>>*/
  const processImage = (file: File) => {
    setUploadedImage(file);
    onImageSelect(file);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /*<<<<< Clear uploaded image >>>>>*/ 
  const clearImage = () => {
    setUploadedImage(null);
    setPreview(null);
    onImageSelect(null as any);
  };

  return (
    <Card className={cn('relative overflow-hidden bg-gradient-card shadow-soft', className)}>
      {!uploadedImage ? (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ease-smooth',
            'hover:border-[#263184] hover:bg-[#2631840D]',
            dragActive && 'border-[#263184] bg-[#2631841A] scale-105'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="flex flex-col items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-glow"
              style={{ background: 'linear-gradient(135deg, #263184 0%, #1a245d 100%)' }}
            >
              <Upload className="w-8 h-8 text-white" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Sube una imagen de la habitación
              </h3>
              <p className="text-muted-foreground">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Formatos: JPG, PNG, WebP (máx. 10MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview!}
            alt="Imagen subida"
            className="w-full h-64 object-cover rounded-lg"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />

          <Button
            size="sm"
            onClick={clearImage}
            className="absolute top-3 right-3 w-8 h-8 p-0 shadow-medium"
            style={{ background: 'rgba(250,250,250,100)' }}
          >
            <X className="w-4 h-4" color="#263184" />
          </Button>

          <div className="absolute bottom-3 left-3 text-white">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{uploadedImage.name}</span>
            </div>
            <p className="text-xs opacity-80">
              {(uploadedImage.size / 1024 / 1024).toFixed(1)} MB
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
