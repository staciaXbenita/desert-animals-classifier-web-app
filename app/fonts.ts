import { Inter, Roboto_Slab, Geist, Geist_Mono, Abyssinica_SIL } from "next/font/google";
import BitCount_Double_Grid from 'next/font/local';


export const roboto = Roboto_Slab({
  subsets: ["latin"],
  variable: '--font-roboto',   // ⬅️ important
  display: 'swap',
  weight: "400",
})

export const bitcountGridDouble = BitCount_Double_Grid({
  src: './bitcount/BitcountGridDouble_Cursive-Light.ttf',
  variable: '--font-bitcount',   // ⬅️ important
  display: 'swap',
})
