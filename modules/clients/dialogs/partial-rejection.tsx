import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const rejectionReasons = [
  { value: "documento-ilegible", label: "Documento ilegible" },
  { value: "informacion-incompleta", label: "Información incompleta" },
  { value: "datos-no-coinciden", label: "Los datos no coinciden" },
  { value: "foto-no-valida", label: "Foto de perfil no válida" },
  { value: "otro", label: "Otro motivo" },
];

type PartialRejectionProps = {
  status: string;
};

export default function PartialRejection({ status }: PartialRejectionProps) {
  const [isPartialRejectModalOpen, setIsPartialRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectDetails, setRejectDetails] = useState("");
  const [error, setError] = useState("");

  const handlePartialReject = () => {
    if (rejectReason === "otro" && rejectDetails.trim() === "") {
      setError("Debe especificar los detalles si selecciona 'Otro motivo'.");
      return;
    }
    setError("");
    setIsPartialRejectModalOpen(false);
    setRejectReason("");
    setRejectDetails("");
  };

  return (
    <Dialog open={isPartialRejectModalOpen} onOpenChange={setIsPartialRejectModalOpen} modal={true}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={status === "REJECTED" || status === "APPROVED"}>
          Rechazar parcialmente
        </Button>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Rechazo Parcial de KYC</DialogTitle>
          <DialogDescription>Especifique el motivo del rechazo.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Motivo</Label>
            <Select
              onValueChange={(value) => {
                setRejectReason(value);
                setError("");
              }}
              value={rejectReason}
            >
              <SelectTrigger id="reason">
                <SelectValue placeholder="Seleccione un motivo..." />
              </SelectTrigger>
              <SelectContent>
                {rejectionReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="details">Detalles adicionales</Label>
            <Textarea
              id="details"
              placeholder="Escriba los detalles aquí..."
              value={rejectDetails}
              onChange={(e) => {
                setRejectDetails(e.target.value);
                setError("");
              }}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsPartialRejectModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handlePartialReject}>Aceptar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
