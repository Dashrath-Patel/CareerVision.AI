import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        move: "move 5s linear infinite",
        spotlight: "spotlight 2s ease 0.75s 1 forwards",
        "spotlight-traverse": "spotlightTraverse 6s ease-in-out infinite",
        scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
      keyframes: {
        move: {
          "0%": { transform: "translateX(-200px)" },
          "100%": { transform: "translateX(200px)" },
        },
        spotlight: {
          "0%": { 
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)" 
          },
          "100%": { 
            opacity: "1",
            transform: "translate(-50%, -40%) scale(1)" 
          },
        },
        spotlightTraverse: {
          "0%": { 
            transform: "translateX(-100vw) rotate(12deg)",
            opacity: "0.1"
          },
          "25%": { 
            opacity: "0.15"
          },
          "50%": { 
            transform: "translateX(0vw) rotate(12deg)",
            opacity: "0.2"
          },
          "75%": { 
            opacity: "0.15"
          },
          "100%": { 
            transform: "translateX(100vw) rotate(12deg)",
            opacity: "0.1"
          },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
