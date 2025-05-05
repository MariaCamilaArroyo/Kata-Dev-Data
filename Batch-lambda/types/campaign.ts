import { z } from 'zod';

export const campaignSchema = z.object({
  monto_tarjeta: z.number().nonnegative(),
  nombre_cliente: z.string().min(1),
  tasa_interes: z.number().min(0),
  tipo_cliente: z.enum(['Masivo', 'Preferente', 'Premium'])
});

export type Campaign = z.infer<typeof campaignSchema>;
