import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { codeToTokens } from "shiki";

export const alt = "Backtick - beautiful code screenshots";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CODE = `async function share(code: string) {
  const frame = await paint(code, {
    background: "graphite",
    chrome: "macos",
  });

  return frame.toPng({ scale: 2 });
}`;

async function loadGeistMono() {
  const css = await (
    await fetch("https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400")
  ).text();
  const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!url) throw new Error("font url not found");
  return (await fetch(url)).arrayBuffer();
}

export default async function Image() {
  const [font, wallpaper, { tokens }] = await Promise.all([
    loadGeistMono(),
    readFile(join(process.cwd(), "public/wallpapers/red_distortion_1.jpg")),
    codeToTokens(CODE, { lang: "typescript", theme: "vesper" }),
  ]);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
        <img
          src={`data:image/jpeg;base64,${wallpaper.toString("base64")}`}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "rgba(16, 16, 16, 0.98)",
              borderRadius: 16,
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 24px 68px rgba(0, 0, 0, 0.55)",
              padding: "18px 40px 30px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                marginBottom: 14,
                height: 28,
              }}
            >
              <div style={{ display: "flex", gap: 9, position: "absolute", left: 0 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: 13,
                      background: "rgba(136, 136, 136, 0.4)",
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 15, color: "rgba(219, 215, 202, 0.55)" }}>
                function.ts
              </span>
            </div>
            {tokens.map((line, i) => (
              <div key={i} style={{ display: "flex", height: 34, alignItems: "center" }}>
                <span
                  style={{
                    color: "rgba(219, 215, 202, 0.28)",
                    fontSize: 20,
                    width: 44,
                    display: "flex",
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ display: "flex", whiteSpace: "pre", fontSize: 20 }}>
                  {line.length === 0
                    ? " "
                    : line.map((t, j) => (
                        <span key={j} style={{ color: t.color, whiteSpace: "pre" }}>
                          {t.content}
                        </span>
                      ))}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 14,
              marginTop: 36,
            }}
          >
            <span style={{ fontSize: 30, color: "#e4e4e7", display: "flex" }}>
              <span style={{ color: "#a1a1aa" }}>`</span>backtick
            </span>
            <span style={{ fontSize: 20, color: "rgba(228, 228, 231, 0.6)" }}>
              beautiful code screenshots
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Geist Mono", data: font, style: "normal", weight: 400 }],
    },
  );
}
