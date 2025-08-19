import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, RotateCw, Move3D, Maximize2 } from 'lucide-react';

interface Transform {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

interface TransformControlsProps {
  selectedImageId?: string;
  transform?: Transform;
  onTransformChange: (transform: Transform) => void;
  onDeleteSelected: () => void;
  className?: string;
}

const COLOR_PRIMARY = '#263184';

export const TransformControls: React.FC<TransformControlsProps> = ({
  selectedImageId,
  transform,
  onTransformChange,
  onDeleteSelected,
  className = ''
}) => {
  if (!selectedImageId || !transform) {
    return (
      <Card className={`p-4 text-center text-muted-foreground ${className}`}>
        <div
          className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center"
          style={{ color: COLOR_PRIMARY }}
        >
          <Move3D className="w-6 h-6" />
        </div>
        <p className="text-sm">Selecciona una imagen para editarla</p>
      </Card>
    );
  }

  const handlePositionChange = (axis: keyof Transform['position'], value: number) => {
    onTransformChange({
      ...transform,
      position: { ...transform.position, [axis]: value }
    });
  };

  const handleRotationChange = (axis: keyof Transform['rotation'], value: number) => {
    onTransformChange({
      ...transform,
      rotation: { ...transform.rotation, [axis]: value }
    });
  };

  const handleScaleChange = (value: number) => {
    onTransformChange({
      ...transform,
      scale: { x: value, y: value, z: value }
    });
  };

  const renderPositionInputs = () =>
    (['x', 'y', 'z'] as const).map((axis) => (
      <div key={axis}>
        <Label className="text-xs text-muted-foreground">{axis.toUpperCase()}</Label>
        <Input
          type="number"
          step={0.1}
          className="h-8"
          value={transform.position[axis].toFixed(2)}
          onChange={(e) => handlePositionChange(axis, parseFloat(e.target.value) || 0)}
        />
      </div>
    ));

  const renderRotationSliders = () =>
    (['x', 'y', 'z'] as const).map((axis) => (
      <div key={axis}>
        <Label className="text-xs text-muted-foreground">
          {axis.toUpperCase()}: {Math.round((transform.rotation[axis] * 180) / Math.PI)}°
        </Label>
        <Slider
          value={[transform.rotation[axis]]}
          onValueChange={([value]) => handleRotationChange(axis, value)}
          min={-Math.PI}
          max={Math.PI}
          step={0.1}
          className="mt-1"
        />
      </div>
    ));

  return (
    <Card className={`p-4 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Controles de Transformación</h3>
        <Button
          size="sm"
          onClick={onDeleteSelected}
          className="flex items-center bg-gradient-to-r from-yellow-400 via-orange-600 to-orange-500 text-white shadow-md"
          style={{ background: 'linear-gradient(90deg, rgba(249, 226, 76, 1) 0%, rgba(238, 119, 16, 1) 100%)' }}
        >
          <Trash2 className="w-4 h-4 mr-2" color={COLOR_PRIMARY} />
          Eliminar
        </Button>
      </div>

      {/* Position */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Move3D className="w-4 h-4" color={COLOR_PRIMARY} />
          <Label className="text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
            Posición
          </Label>
        </div>
        <div className="grid grid-cols-3 gap-3">{renderPositionInputs()}</div>
      </section>

      {/* Rotation */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <RotateCw className="w-4 h-4" color={COLOR_PRIMARY} />
          <Label className="text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
            Rotación (grados)
          </Label>
        </div>
        <div className="space-y-3">{renderRotationSliders()}</div>
      </section>

      {/* Scale */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4" color={COLOR_PRIMARY} />
          <Label className="text-sm font-medium" style={{ color: COLOR_PRIMARY }}>
            Escala: {transform.scale.x.toFixed(2)}x
          </Label>
        </div>
        <Slider
          value={[transform.scale.x]}
          onValueChange={([value]) => handleScaleChange(value)}
          min={0.1}
          max={5.0}
          step={0.1}
          className="mt-1"
        />
      </section>

      {/* Footer */}
      <footer className="text-xs text-muted-foreground pt-2 border-t">
        <p>💡 Usa las teclas de flecha y Supr para controles rápidos</p>
      </footer>
    </Card>
  );
};
