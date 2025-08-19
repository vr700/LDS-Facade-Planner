import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Phone, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WhatsAppFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const WhatsAppField = ({ value, onChange, className }: WhatsAppFieldProps) => {
  const [focused, setFocused] = useState(false);
  const { toast } = useToast();

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatPhoneNumber(raw);
    onChange(formatted);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const digits = value.replace(/\D/g, '');
      const newDigits = digits.slice(0, -1);
      onChange(formatPhoneNumber(newDigits));
      e.preventDefault();
    }
    if (e.key === "Delete") {
      onChange("");
      e.preventDefault();
    }
  };

  const validatePhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 9;
  };

  const handleSendWhatsApp = () => {
    if (!value || !validatePhoneNumber(value)) {
      toast({
        title: "Número inválido",
        description: "Ingrese un número de teléfono válido de 9 dígitos",
        variant: "destructive"
      });
      return;
    }

    const phoneNumber = `51${value.replace(/\D/g, '')}`;
    const message = "Estimado cliente, le envío el plan de instalación.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');

    try {
      // @ts-ignore
      if (window.electronAPI?.openDownloadsFolder) {
        // @ts-ignore
        window.electronAPI.openDownloadsFolder();
      } else {
        toast({
          title: "WhatsApp abierto",
          description: "Revise su carpeta de descargas para el archivo PDF",
          duration: 5000
        });
      }
    } catch (error) {
      console.warn("No se puede abrir la carpeta de descargas directamente en este navegador.");
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center text-white/70">
            <Phone className="w-4 h-4" />
          </div>
          <div className="absolute inset-y-0 left-10 flex items-center text-white/60 text-sm">
            +51
          </div>
          <Input
            id="whatsapp-phone"
            type="tel"
            placeholder="987 654 321"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`
              bg-white/10 border-white/20 text-white placeholder:text-white/60
              focus:border-white/40 focus:bg-white/15 transition-all duration-200
              pl-20 pr-4
              ${focused ? 'ring-2 ring-white/20' : ''}
            `}
            maxLength={13}
          />
        </div>
        <Button
          onClick={handleSendWhatsApp}
          disabled={!value || !validatePhoneNumber(value)}
          className="bg-green-600 hover:bg-green-700 text-white border-0 px-4"
          size="default"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
