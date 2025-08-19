import { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Move3D, Download, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShareCaseButton } from '@/components/ShareCaseButton';

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

interface Scene3DProps {
  backgroundImage?: string | null;
  diagramImages: DiagramItem[];
  className?: string;
  onImageAdd?: () => void;
  onSelectionChange?: (selectedId: string | null, transform?: any) => void;
  onTransformChange?: (imageId: string, transform: any) => void;
  onDeleteImage?: (imageId: string) => void;
  onExport?: () => Promise<string>;
  specImage?: string;
  phoneNumber?: string;
}

/* ---------------- DiagramPlane ---------------- */
const DiagramPlane = ({
  item,
  isSelected,
  onClick,
  hideControls,
  onTransformChange,
  transformMode
}: {
  item: DiagramItem;
  isSelected: boolean;
  onClick: () => void;
  hideControls?: boolean;
  onTransformChange?: (transform: any) => void;
  transformMode: 'translate' | 'rotate' | 'scale';
}) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const transformControlsRef = useRef<any>(null);
  const [planeSize, setPlaneSize] = useState({ width: 2, height: 1.5 });

  useEffect(() => {
    if (item.texture && (item.texture.image as any)) {
      const img = item.texture.image as HTMLImageElement | { width?: number; height?: number };
      const iw = (img as any).width || 1;
      const ih = (img as any).height || 1;
      const aspectRatio = iw / ih;
      const maxSize = 2;
      let width: number, height: number;
      if (aspectRatio > 1) {
        width = maxSize;
        height = maxSize / aspectRatio;
      } else {
        height = maxSize;
        width = maxSize * aspectRatio;
      }
      setPlaneSize({ width, height });
    }
  }, [item.texture]);

  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.position.set(item.transform.position.x, item.transform.position.y, item.transform.position.z);
    meshRef.current.rotation.set(item.transform.rotation.x, item.transform.rotation.y, item.transform.rotation.z);
    meshRef.current.scale.set(item.transform.scale.x, item.transform.scale.y, item.transform.scale.z);
  }, [item.transform]);

  useEffect(() => {
    if (transformControlsRef.current) {
      try { transformControlsRef.current.setMode(transformMode); } catch { /* no-op */ }
    }
  }, [transformMode]);

  const handleTransformChange = () => {
    if (meshRef.current && onTransformChange) {
      onTransformChange({
        position: { x: meshRef.current.position.x, y: meshRef.current.position.y, z: meshRef.current.position.z },
        rotation: { x: meshRef.current.rotation.x, y: meshRef.current.rotation.y, z: meshRef.current.rotation.z },
        scale: { x: meshRef.current.scale.x, y: meshRef.current.scale.y, z: meshRef.current.scale.z }
      });
    }
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <planeGeometry args={[planeSize.width, planeSize.height]} />
        <meshBasicMaterial
          map={item.texture}
          transparent={true}
          opacity={1.0}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {!hideControls && isSelected && meshRef.current && (
        <TransformControls
          ref={transformControlsRef}
          object={meshRef.current as any}
          mode={transformMode}
          showX showY showZ
          space="local"
          onObjectChange={handleTransformChange}
        />
      )}
    </group>
  );
};

/* ---------------- Scene ---------------- */
const Scene = ({
  backgroundImage,
  diagramImages,
  hideControls,
  onSelectionChange,
  onTransformChange
}: {
  backgroundImage?: string | null;
  diagramImages: DiagramItem[];
  hideControls?: boolean;
  onSelectionChange?: (selectedId: string | null, transform?: any) => void;
  onTransformChange?: (imageId: string, transform: any) => void;
}) => {
  const { scene, gl, camera, size } = useThree();
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const orbitControlsRef = useRef<any>(null);
  const backgroundMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    let cancelled = false;
    const planeZ = -5;

    const cleanupPrev = () => {
      if (!backgroundMeshRef.current) return;
      try {
        scene.remove(backgroundMeshRef.current);
        // dispose geometry
        if (backgroundMeshRef.current.geometry) backgroundMeshRef.current.geometry.dispose();
        // dispose material and map
        const mat = backgroundMeshRef.current.material as THREE.Material | THREE.Material[] | null;
        if (Array.isArray(mat)) {
          mat.forEach(m => {
            const mm = m as THREE.MeshBasicMaterial;
            if (mm.map) mm.map.dispose();
            mm.dispose();
          });
        } else if (mat) {
          const mm = mat as THREE.MeshBasicMaterial;
          if (mm.map) mm.map.dispose();
          mm.dispose();
        }
      } catch (err) {
        // ignore
      }
      backgroundMeshRef.current = null;
    };

    if (!backgroundImage) {
      cleanupPrev();
      return;
    }

    const loader = new THREE.TextureLoader();
    loader.load(
      backgroundImage,
      (texture) => {
        if (cancelled) {
          try { texture.dispose(); } catch {}
          return;
        }
        try {
          if ('colorSpace' in texture) {
            (texture as any).colorSpace = 'srgb';
          } else if ((THREE as any).sRGBEncoding !== undefined) {
            (texture as any).encoding = (THREE as any).sRGBEncoding;
          }
        } catch (e) {
          console.warn('No se pudo asignar colorSpace/encoding:', e);
        }


        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const iw = (texture.image && (texture.image as any).width) ? (texture.image as any).width : 1;
        const ih = (texture.image && (texture.image as any).height) ? (texture.image as any).height : 1;
        const imgAspect = iw / ih;

        const cam = camera as THREE.PerspectiveCamera;
        const fov = cam.fov;
        const distance = Math.abs(cam.position.z - planeZ);
        const fovRad = THREE.MathUtils.degToRad(fov);
        const frustumHeight = 2 * Math.tan(fovRad / 2) * distance;
        const frustumWidth = frustumHeight * (size.width / Math.max(1, size.height));
        const frustumAspect = frustumWidth / frustumHeight;

        let planeWidth: number;
        let planeHeight: number;
        if (imgAspect > frustumAspect) {
          planeWidth = frustumWidth;
          planeHeight = frustumWidth / imgAspect;
        } else {
          planeHeight = frustumHeight;
          planeWidth = frustumHeight * imgAspect;
        }

        cleanupPrev();

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
        material.depthWrite = false;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, planeZ);
        mesh.renderOrder = -1;
        scene.add(mesh);
        backgroundMeshRef.current = mesh;
      },
      undefined,
      (err) => {
        console.error('Error cargando background image', err);
      }
    );

    return () => {
      cancelled = true;
      cleanupPrev();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundImage, scene, camera, size.width, size.height]);

  useEffect(() => {
    if (gl && gl.domElement) {
      gl.domElement.style.background = 'transparent';
    }
  }, [gl]);

  const handleImageClick = (imageId: string, transform: any) => {
    setSelectedImageId(imageId);
    onSelectionChange?.(imageId, transform);
  };

  const handleTransformChange = (transform: any) => {
    if (selectedImageId) {
      onTransformChange?.(selectedImageId, transform);
    }
  };

  /*<<<<< Keybinds G/R/S/Delete >>>>>*/  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedImageId) return;
      const key = event.key.toLowerCase();
      switch (key) {
        case 'g':
          setTransformMode('translate');
          event.preventDefault();
          break;
        case 'r':
          setTransformMode('rotate');
          event.preventDefault();
          break;
        case 's':
          setTransformMode('scale');
          event.preventDefault();
          break;
        case 'delete':
        case 'backspace':
          onSelectionChange?.(selectedImageId, null);
          event.preventDefault();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageId, onSelectionChange]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.1} />

      {diagramImages.map((item) => (
        <DiagramPlane
          key={item.id}
          item={item}
          isSelected={selectedImageId === item.id}
          onClick={() => handleImageClick(item.id, item.transform)}
          hideControls={hideControls}
          onTransformChange={handleTransformChange}
          transformMode={transformMode}
        />
      ))}

  


      <OrbitControls
        ref={orbitControlsRef}
        enablePan={true}
        enableZoom={false} 
        enableRotate={false}
        panSpeed={1}
        zoomSpeed={1.0}
      />
    </>
  );
};

/* ---------------- Scene3D (export) ---------------- */
export const Scene3D = ({
  backgroundImage,
  diagramImages,
  className,
  onImageAdd,
  onSelectionChange,
  onTransformChange,
  onDeleteImage,
  onExport,
  specImage,
  phoneNumber
}: Scene3DProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedTransform, setSelectedTransform] = useState<any>(null);

  const exportImage = () => {
    setIsExporting(true);
    setTimeout(() => {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
      if (!canvas) {
        setIsExporting(false);
        return;
      }
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      if (ctx) ctx.drawImage(canvas, 0, 0);
      const link = document.createElement('a');
      link.download = 'wall-design-3d.png';
      link.href = tempCanvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 100);
  };

  const exportForPDF = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      setIsExporting(true);
      setTimeout(() => {
        try {
          const canvas = document.querySelector('canvas') as HTMLCanvasElement | null;
          if (!canvas) {
            setIsExporting(false);
            reject(new Error('Canvas not found'));
            return;
          }
          const tempCanvas = document.createElement('canvas');
          const ctx = tempCanvas.getContext('2d');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          if (ctx) ctx.drawImage(canvas, 0, 0);
          const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
          setIsExporting(false);
          resolve(dataUrl);
        } catch (error) {
          setIsExporting(false);
          reject(error);
        }
      }, 100);
    });
  };

  const handleSelectionChange = (imageId: string | null, transform?: any) => {
    if (transform === null && imageId) {
      onDeleteImage?.(imageId);
      setSelectedImageId(null);
      setSelectedTransform(null);
    } else {
      setSelectedImageId(imageId);
      setSelectedTransform(transform);
      onSelectionChange?.(imageId, transform);
    }
  };

  const handleTransformChange = (newTransform: any) => {
    if (selectedImageId) {
      setSelectedTransform(newTransform);
      onTransformChange?.(selectedImageId, newTransform);
    }
  };

  return (
    <div className="flex gap-4 h-full">
      <Card className={cn("relative overflow-hidden bg-gradient-card shadow-soft flex-1", className)}>
        <div className="absolute top-4 right-4 z-10 flex gap-2">

          <Button
            onClick={exportImage}
            className="bg-[linear-gradient(135deg,#263184,#1a245d)] text-white hover:brightness-110 shadow-glow transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Imagen
          </Button>

          <ShareCaseButton
            onExport={onExport || exportForPDF}
            specImage={specImage}
            phoneNumber={phoneNumber}
          />

        </div>

        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 60 }}
            gl={{
              preserveDrawingBuffer: true,
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
              toneMapping: THREE.NoToneMapping
            }}
            style={{ background: 'transparent' }}
          >
            <Scene
              backgroundImage={backgroundImage ?? null}
              diagramImages={diagramImages}
              hideControls={isExporting}
              onSelectionChange={handleSelectionChange}
              onTransformChange={onTransformChange}
            />
          </Canvas>
        </div>

        {!backgroundImage && diagramImages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#26318433] flex items-center justify-center">
                <Move3D className="w-8 h-8 text-[#263184]" />
              </div>
              <p className="text-lg font-medium">Vista 3D</p>
              <p className="text-sm">Sube una imagen y selecciona un diagrama para comenzar</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
