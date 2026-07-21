export type Background = {
  id: string;
  name: string;
  /** CSS background for the exported frame */
  css: string;
  /** Small preview swatch background (defaults to css) */
  swatch?: string;
  transparent?: boolean;
};

export const BACKGROUNDS: Background[] = [
  {
    id: "graphite",
    name: "Graphite",
    css: "linear-gradient(115deg, #e6e6e6 0%, #b9b9b9 10%, #6b6b6b 24%, #1c1c1c 42%, #050505 55%, #2e2e2e 68%, #9a9a9a 84%, #d9d9d9 94%, #a8a8a8 100%)",
  },
  {
    id: "prismatic",
    name: "Prismatic",
    css: "radial-gradient(120% 140% at 10% 0%, #ff7a18 0%, transparent 45%), radial-gradient(120% 140% at 90% 10%, #af2896 0%, transparent 50%), radial-gradient(140% 140% at 50% 100%, #2563eb 0%, transparent 60%), linear-gradient(160deg, #0b0b0f 0%, #1b1035 100%)",
  },
  {
    id: "aurora",
    name: "Aurora",
    css: "radial-gradient(110% 120% at 15% 10%, #22e1a5 0%, transparent 45%), radial-gradient(120% 130% at 85% 15%, #2bd2ff 0%, transparent 50%), radial-gradient(150% 150% at 50% 110%, #5b2bff 0%, transparent 60%), #030712",
  },
  {
    id: "sunset",
    name: "Sunset",
    css: "linear-gradient(135deg, #ff9966 0%, #ff5e62 35%, #a4508b 70%, #5f0a87 100%)",
  },
  {
    id: "ocean",
    name: "Ocean",
    css: "linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 70%, #4ca1af 100%)",
  },
  {
    id: "candy",
    name: "Candy",
    css: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 50%, #96e6a1 100%)",
  },
  {
    id: "ember",
    name: "Ember",
    css: "radial-gradient(120% 130% at 20% 0%, #ff4d00 0%, transparent 45%), radial-gradient(130% 130% at 90% 20%, #b91c1c 0%, transparent 55%), linear-gradient(160deg, #170504 0%, #300a02 100%)",
  },
  {
    id: "midnight",
    name: "Midnight",
    css: "radial-gradient(120% 150% at 50% 0%, #1e293b 0%, #0f172a 55%, #020617 100%)",
  },
  {
    id: "lavender",
    name: "Lavender",
    css: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  },
  {
    id: "mono",
    name: "Mono",
    css: "#101010",
  },
  {
    id: "transparent",
    name: "None",
    css: "none",
    swatch:
      "repeating-conic-gradient(#3f3f46 0% 25%, #18181b 0% 50%) 0 0 / 12px 12px",
    transparent: true,
  },
];

const WALLPAPER_FILES = [
  "glaze_1",
  "glaze_2",
  "red_distortion_1",
  "red_distortion_2",
  "red_distortion_3",
  "red_distortion_4",
  "blue_distortion_1",
  "blue_distortion_2",
  "mono_dark_distortion_1",
  "mono_dark_distortion_2",
  "mono_light_distortion_1",
  "mono_light_distortion_2",
  "chromatic_dark_1",
  "chromatic_dark_2",
  "chromatic_light_1",
  "chromatic_light_2",
  "cube_prod",
  "cube_mono",
  "loupe",
  "loupe-mono-dark",
  "loupe-mono-light",
  "blob",
  "blob-red",
  "raycast-logo",
  "autumnal-peach",
  "blossom-2",
  "blushing-fire",
  "bright-rain",
  "floss",
  "glass-rainbow",
  "good-vibes",
  "moonrise",
  "ray-of-lights",
  "rose-thorn",
];

/** Official Raycast wallpapers, downloaded to /public/wallpapers */
export const WALLPAPERS: Background[] = WALLPAPER_FILES.map((file) => ({
  id: `wp-${file}`,
  name: file
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()),
  css: `url(/wallpapers/${file}.jpg) center / cover no-repeat`,
}));

