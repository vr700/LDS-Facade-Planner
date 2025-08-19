import { useState } from 'react';
import * as THREE from 'three';

import { ImageUpload } from '@/components/ImageUpload';
import { InstallationSelector } from '@/components/InstallationSelector';
import { Scene3D } from '@/components/Scene3D';
import { WhatsAppField } from '@/components/WhatsAppField';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

import logo600b from '@/assets/brand/luz-del-sur-sa--600b.png';
import logo600c from '@/assets/brand/luz-del-sur-sa--600c.png';


interface DiagramItem {
  id: string;
  texture: THREE.Texture;
  transform: {
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  };
  selected: boolean;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('');
  const [selectedDiagram, setSelectedDiagram] = useState<string>('');
  const [diagramImages, setDiagramImages] = useState<DiagramItem[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedTransform, setSelectedTransform] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [currentSpecImage, setCurrentSpecImage] = useState<string>('');

  const getDefaultTransform = () => {
    if (diagramImages.length === 0) {
      return {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      };
    }
    return { ...diagramImages[diagramImages.length - 1].transform };
  };

  const handleImageSelect = (image: File) => {
    setSelectedImage(image);
    setBackgroundImageUrl(URL.createObjectURL(image));
  };

  const handleDiagramSelect = (diagram: string, specImage: string) => {
    setSelectedDiagram(diagram);
    setCurrentSpecImage(specImage);

    const loader = new THREE.TextureLoader();
    loader.load(diagram, (texture) => {
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.generateMipmaps = true;

      const newItem: DiagramItem = {
        id: Date.now().toString(),
        texture,
        transform: getDefaultTransform(),
        selected: false,
      };

      setDiagramImages((prev) => [...prev, newItem]);
      setSelectedImageId(newItem.id);
      setSelectedTransform(newItem.transform);
    });
  };

  const handleSelectionChange = (imageId: string | null, transform?: any) => {
    setSelectedImageId(imageId);
    setSelectedTransform(transform || null);
  };

  const handleTransformChange = (imageId: string, newTransform: any) => {
    setDiagramImages((prev) =>
      prev.map((item) =>
        item.id === imageId ? { ...item, transform: newTransform } : item
      )
    );
    setSelectedTransform(newTransform);
  };

  const handleDeleteImage = (imageId: string) => {
    setDiagramImages((prev) => prev.filter((item) => item.id !== imageId));
    setSelectedImageId(null);
    setSelectedTransform(null);
  };

return (
  <div className="min-h-screen bg-gradient-secondary">
    {/* Header */}
    <header
      className="border-b border-border sticky top-0 z-50 px-4 py-2"
      style={{
        background:
          'linear-gradient(90deg, rgba(249, 226, 76, 1) 0%, rgba(238, 119, 16, 1) 100%)',
      }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <img
            src={logo600b}
            alt="Luz del Sur"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#263184' }}>
              LDS Facade Planner
            </h1>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="flex items-center gap-4">
          <WhatsAppField
            value={phoneNumber}
            onChange={setPhoneNumber}
            className="w-64"
          />

          {/* Info Keybinds */}
          <button
          onClick={() => {
            alert('Atajos del teclado:\n\nG = Mover\nR = Rotar\nS = Escalar\nSupr = Eliminar');
          }}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 bg-[linear-gradient(135deg,#263184,#1a245d)] text-white hover:brightness-110 transition"
            title="Ver atajos del teclado"
          >
            Atajos
          </button>
        </div>
      </div>
    </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ResizablePanelGroup direction="horizontal" className="min-h-[800px] rounded-lg border">
          {/* Left Panel */}
          <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
            <div className="p-4 space-y-6 h-full overflow-auto">
              {!selectedImage && (
                <Card
                  className="shadow-soft border-l-4"
                  style={{ borderLeftColor: '#263184', background: '#f9fafb' }}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-glow"
                        style={{ background: '#263184' }}
                      >
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-foreground" style={{ color: '#263184' }}>
                          ¡Bienvenido!
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Visualiza instalaciones eléctricas en 3D
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm text-muted-foreground">
                      {[1, 2, 3, 4].map((step) => (
                        <div className="flex items-start gap-2" key={step}>
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                            style={{ backgroundColor: '#26318420' }}
                          >
                            <span className="text-xs font-bold" style={{ color: '#263184' }}>
                              {step}
                            </span>
                          </div>
                          <span>
                            {[
                              'Sube una foto de la habitación',
                              'Selecciona un diagrama eléctrico',
                              'Ajusta la perspectiva en 3D',
                              'Exporta el resultado final',
                            ][step - 1]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              <ImageUpload onImageSelect={handleImageSelect} className="h-fit" />

              {selectedImage && (
                <InstallationSelector
                  onDiagramSelect={handleDiagramSelect}
                  selectedDiagram={selectedDiagram}
                  className={cn(
                    'transform transition-all duration-500 ease-bounce',
                    selectedImage ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  )}
                />
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel */}
          <ResizablePanel defaultSize={70} minSize={60}>
            <div className="h-full p-4">
              <Scene3D
                backgroundImage={backgroundImageUrl}
                diagramImages={diagramImages}
                onImageAdd={() => {
                  if (selectedDiagram) handleDiagramSelect(selectedDiagram, currentSpecImage);
                }}
                onSelectionChange={handleSelectionChange}
                onTransformChange={handleTransformChange}
                onDeleteImage={handleDeleteImage}
                specImage={currentSpecImage}
                phoneNumber={phoneNumber}
                className="h-full"
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 backdrop-blur-sm mt-16">
        {/* Extra Footer Section */}
        <div className="bg-plomo2 pt-12 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="lg:w-3/4 flex items-center justify-center lg:justify-start mb-6 lg:mb-0">
                <img src={logo600c} alt="Logo Luz del Sur" className="h-12" />
              </div>
              <div className="lg:w-1/2 text-right text-sm text-muted-foreground space-y-1">
                <p>© 2024 LUZ DEL SUR S.A.A.</p>
                <p>RUC: 20331898008</p>
                <p>Todos los derechos reservados</p>
                <p>LDS Facade Planner - Guía visual para instalaciones eléctricas de fachadas</p>
                <p className="mt-1">Autor: Mariano Moises Oblitas Davila</p>
                <p>
                  <a
                    href="/legal"
                    className="text-blue-600 hover:underline hover:text-blue-800 transition"
                  >
                    Información legal y licencias
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
