import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { EmergencyNotification } from '@shared/schema';

interface EmergencyModalProps {
  notification: EmergencyNotification | null;
  onClose: () => void;
}

export function EmergencyModal({ notification, onClose }: EmergencyModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const { setIsPageBlinking } = useApp();

  useEffect(() => {
    if (notification) {
      setIsPageBlinking(true);
      setAcknowledged(false);
    } else {
      setIsPageBlinking(false);
    }
  }, [notification, setIsPageBlinking]);

  const handleClose = () => {
    if (acknowledged) {
      setIsPageBlinking(false);
      onClose();
    }
  };

  if (!notification) return null;

  return (
    <Dialog open={!!notification} onOpenChange={() => {}}>
      <DialogContent className="max-w-md border-l-4 border-l-red-500">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Notificação de Emergência
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-700">{notification.message}</p>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acknowledge"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
            />
            <label
              htmlFor="acknowledge"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Li e compreendi a mensagem
            </label>
          </div>
          
          <Button
            onClick={handleClose}
            disabled={!acknowledged}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Confirmar Leitura
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
