import { Bebas_Neue, DM_Sans } from "next/font/google";

/**
 * Display font follows the bold condensed style used in the reference app.
 */
export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

/**
 * Body font keeps readable neutral rhythm for dashboard interfaces.
 */
export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});
