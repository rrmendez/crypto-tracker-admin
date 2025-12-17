import {
  bnb_logo,
  bsc_logo,
  btc_logo,
  eth_logo,
  leht_logo,
  pol_logo,
  usbb_logo,
  usdc_logo,
  usdm_logo,
  usdt_logo,
  uspb_logo,
} from "@/components/custom/vectors/currencies";
import { z } from "zod";
import { formatEther } from "ethers";

// ----------------------------------------------------------------------

export function getCurrencyLogo(code?: string) {
  switch (code) {
    case "BNB":
      return bnb_logo;
    case "tBNB":
      return bnb_logo;
    case "USDT":
      return usdt_logo;
    case "ETH":
      return eth_logo;
    case "BSC":
      return bsc_logo;
    case "BTC":
      return btc_logo;
    case "BTCB":
      return btc_logo;
    case "USPB":
      return uspb_logo;
    case "USBB":
      return usbb_logo;
    case "USDM":
      return usdm_logo;
    case "POL":
      return pol_logo;
    case "USDC":
      return usdc_logo;
    case "LEHT":
      return leht_logo;
    default:
      return bnb_logo;
  }
}

// ----------------------------------------------------------------------

// Definimos los validadores para cada red
export const networkValidators = {
  bitcoin: z
    .string()
    .min(26, "Direccion no válida")
    .max(35, "Direccion no válida")
    .regex(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, "Formato Bitcoin inválido")
    .or(z.string().regex(/^bc1[a-z0-9]{39,59}$/i, "Formato Bech32 inválido")),

  ethereum: z
    .string()
    .length(42, "Direccion no válida")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Formato Ethereum inválido"),

  // Binance tiene dos tipos de direcciones:
  // Direcciones de Binance Chain (BEP-2) - formato bnb...
  bep2: z
    .string()
    .startsWith("bnb", "Dirección BEP-2 debe comenzar con 'bnb'")
    .length(42, "Dirección BEP-2 debe tener 42 caracteres")
    .regex(/^bnb[a-z0-9]{39}$/i, "Formato BEP-2 inválido"),

  // Direcciones de Binance Smart Chain (BEP-20) - formato 0x... (como Ethereum)
  bsc: z
    .string()
    .length(42, "Direccion no válida")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Formato BEP-20 inválido"),

  // Puedes añadir más redes según necesites
  litecoin: z.string().regex(/^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/, "Formato Litecoin inválido"),

  tron: z
    .string()
    .length(34, "Direccion no válida")
    .regex(/^T[a-zA-Z0-9]{33}$/, "Formato TRON inválido"),

  polygon: z
    .string()
    .length(42, "Direccion no válida")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Formato Polygon inválido"),
};

// ----------------------------------------------------------------------

export function calculateGasCostInBNB(gasUsed: bigint, gasPriceWei: bigint): string {
  const totalCost = gasUsed * gasPriceWei;
  return formatEther(totalCost);
}
