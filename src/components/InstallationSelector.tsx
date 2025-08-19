import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Filter, Zap, ZapOff } from 'lucide-react';
import electricalDiagramsData from '@/data/electrical-diagrams.json';

/* ------------------------- Diagrams Imports ------------------------- */
import electricalDiagram1 from '@/assets/blueprints/electrical-diagram-1.png';
import electricalDiagram2 from '@/assets/blueprints/electrical-diagram-2.png';
import electricalDiagram3 from '@/assets/blueprints/electrical-diagram-3.png';
import specDiagram1 from '@/assets/specs/electrical-diagram-1_m.png';
import specDiagram2 from '@/assets/specs/electrical-diagram-2_m.png';
import specDiagram3 from '@/assets/specs/electrical-diagram-3_m.png';

const imageMap: Record<string, string> = {
  '/src/assets/blueprints/electrical-diagram-1.png': electricalDiagram1,
  '/src/assets/blueprints/electrical-diagram-2.png': electricalDiagram2,
  '/src/assets/blueprints/electrical-diagram-3.png': electricalDiagram3,
};

const specImageMap: Record<string, string> = {
  '/src/assets/specs/electrical-diagram-1_m.png': specDiagram1,
  '/src/assets/specs/electrical-diagram-2_m.png': specDiagram2,
  '/src/assets/specs/electrical-diagram-3_m.png': specDiagram3,
};

interface InstallationSelectorProps {
  onDiagramSelect: (diagram: string, specImage: string) => void;
  selectedDiagram?: string;
  className?: string;
}

type InstallationType = 'all' | 'monofasico' | 'trifasico';

export const InstallationSelector = ({
  onDiagramSelect,
  selectedDiagram,
  className,
}: InstallationSelectorProps) => {
  const [filter, setFilter] = useState<InstallationType>('all');

  const [hoveredDiagram, setHoveredDiagram] = useState<string | null>(null);

  const filteredDiagrams = electricalDiagramsData.filter(diagram => 
    filter === 'all' || diagram.type === filter
  );

  const handleDiagramSelect = (diagram: any) => {
    const blueprintImage = imageMap[diagram.blueprints];
    const specImage = specImageMap[diagram.specs];
    if (blueprintImage) {
      onDiagramSelect(blueprintImage, specImage);
    }
  };

  return (
    <Card className={cn('bg-gradient-card shadow-soft', className)}>
      <div className="p-6">
        {/* Título */}
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-5 h-5 text-[#263184]" />
          <h3 className="text-lg font-semibold text-foreground">
            Selección de Instalación
          </h3>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filtrar por tipo:</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={cn(
                'transition-all duration-200',
                filter === 'all' 
                  ? 'bg-[#263184] text-white shadow-soft hover:shadow-glow' 
                  : 'text-[#263184] border-[#263184]/30 hover:bg-[#263184]/10'
              )}
            >
              Todos
            </Button>
            <Button
              variant={filter === 'monofasico' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('monofasico')}
              className={cn(
                'transition-all duration-200',
                filter === 'monofasico' 
                  ? 'bg-[#263184] text-white shadow-soft hover:shadow-glow' 
                  : 'text-[#263184] border-[#263184]/30 hover:bg-[#263184]/10'
              )}
            >
              <ZapOff className="w-3 h-3 mr-1" />
              Monofásico
            </Button>
            <Button
              variant={filter === 'trifasico' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('trifasico')}
              className={cn(
                'transition-all duration-200',
                filter === 'trifasico' 
                  ? 'bg-[#263184] text-white shadow-soft hover:shadow-glow' 
                  : 'text-[#263184] border-[#263184]/30 hover:bg-[#263184]/10'
              )}
            >
              <Zap className="w-3 h-3 mr-1" />
              Trifásico
            </Button>
          </div>
        </div>

        {/* Diagram List */}
        <div className="space-y-3">
          {filteredDiagrams.map((diagram) => {
            const blueprintImage = imageMap[diagram.blueprints];
            const isSelected = selectedDiagram === blueprintImage;
            const isHovered = hoveredDiagram === diagram.id;

            return (
              <div
                key={diagram.id}
                className={cn(
                  'relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-smooth',
                  'border-2 border-transparent hover:border-[#263184]',
                  'bg-white shadow-sm hover:shadow-medium',
                  isSelected && 'border-[#263184] ring-2 ring-[#263184]/20 shadow-medium',
                  (isHovered || isSelected) && 'transform scale-[1.02]'
                )}
                onClick={() => handleDiagramSelect(diagram)}
                onMouseEnter={() => setHoveredDiagram(diagram.id)}
                onMouseLeave={() => setHoveredDiagram(null)}
              >
                <div className="flex items-center p-4">
                  {/* Preview Image */}
                  <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                    {blueprintImage && (
                      <img 
                        src={blueprintImage} 
                        alt={diagram.name} 
                        className="w-full h-full object-cover" 
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-[#263184] truncate">
                        {diagram.name}
                      </h4>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          'text-xs',
                          diagram.type === 'monofasico' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-blue-100 text-blue-700'
                        )}
                      >
                        {diagram.type === 'monofasico' ? 'Monofásico' : 'Trifásico'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {diagram.description}
                    </p>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="w-6 h-6 bg-[#263184] rounded-full flex items-center justify-center shadow-glow flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredDiagrams.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No hay instalaciones del tipo seleccionado</p>
          </div>
        )}
      </div>
    </Card>
  );
};