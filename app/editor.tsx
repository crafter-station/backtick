"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toBlob, toPng } from "html-to-image";
import {
  bundledLanguagesInfo,
  bundledThemesInfo,
  getSingletonHighlighter,
  type BundledLanguage,
  type BundledTheme,
} from "shiki";
import { BACKGROUNDS, WALLPAPERS, type Background } from "@/lib/backgrounds";
import { MONO_THEME } from "@/lib/mono-theme";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";

const DEFAULT_CODE = `async function share(code: string) {
  const frame = await paint(code, {
    background: "graphite",
    chrome: "macos",
  });

  return frame.toPng({ scale: 2 });
}`;

type ChromeStyle = "colors" | "mono" | "none";

const LANGUAGES = [...bundledLanguagesInfo].sort((a, b) =>
  a.name.localeCompare(b.name),
);

export default function Editor() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [lang, setLang] = useState<BundledLanguage>("typescript");
  const [theme, setTheme] = useState<string>(MONO_THEME.name!);
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const [padding, setPadding] = useState<number>(64);
  const [opacity, setOpacity] = useState<number>(88);
  const [fontSize, setFontSize] = useState<number>(14);
  const [lineNumbers, setLineNumbers] = useState(false);
  const [chrome, setChrome] = useState<ChromeStyle>("mono");
  const [title, setTitle] = useState("untitled");
  const [html, setHtml] = useState("");
  const [themeBg, setThemeBg] = useState("#101010");
  const [themeFg, setThemeFg] = useState("#dbd7ca");
  const [busy, setBusy] = useState<"png" | "copy" | null>(null);
  const [copied, setCopied] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stale = false;
    (async () => {
      const highlighter = await getSingletonHighlighter();
      await Promise.all([
        highlighter.loadTheme(
          theme === MONO_THEME.name ? MONO_THEME : (theme as BundledTheme),
        ),
        highlighter.loadLanguage(lang),
      ]);
      if (stale) return;
      setHtml(highlighter.codeToHtml(code, { lang, theme }));
      const t = highlighter.getTheme(theme);
      setThemeBg(t.bg);
      setThemeFg(t.fg);
    })();
    return () => {
      stale = true;
    };
  }, [code, lang, theme]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key !== "Tab") return;
      e.preventDefault();
      const el = e.currentTarget;
      const { selectionStart, selectionEnd, value } = el;
      const next = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
      setCode(next);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = selectionStart + 2;
      });
    },
    [],
  );

  const exportPng = useCallback(async () => {
    if (!frameRef.current) return;
    setBusy("png");
    try {
      const dataUrl = await toPng(frameRef.current, { pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${title.trim() || "code"}.png`;
      a.click();
    } finally {
      setBusy(null);
    }
  }, [title]);

  const copyPng = useCallback(async () => {
    if (!frameRef.current) return;
    setBusy("copy");
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": toBlob(frameRef.current, { pixelRatio: 2 }).then(
            (b) => b ?? new Blob(),
          ),
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } finally {
      setBusy(null);
    }
  }, []);

  const codeStyle = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: "var(--font-geist-mono), monospace",
      fontSize,
      lineHeight: 1.7,
      padding: "20px 28px 24px",
      paddingLeft: lineNumbers ? "calc(28px + 3.2em)" : "28px",
    }),
    [fontSize, lineNumbers],
  );

  return (
    <div className="flex min-h-dvh flex-col bg-[#09090b] text-zinc-200">
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 font-mono text-sm tracking-tight text-zinc-400">
          <span className="inline-block size-2 rounded-full bg-emerald-400" />
          <span className="text-zinc-600">`</span>backtick
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyPng}
            disabled={busy !== null}
          >
            {copied ? "Copied!" : busy === "copy" ? "Copying…" : "Copy image"}
          </Button>
          <Button size="sm" onClick={exportPng} disabled={busy !== null}>
            {busy === "png" ? "Exporting…" : "Export PNG"}
          </Button>
        </div>
      </header>

      <main className="grid flex-1 place-items-center overflow-auto px-6 py-8">
        <div
          className="rounded-2xl"
          style={
            background.transparent
              ? { background: background.swatch }
              : undefined
          }
        >
          <div
            ref={frameRef}
            style={{
              background: background.transparent ? "none" : background.css,
              padding,
            }}
          >
            <div
              className="overflow-hidden rounded-xl shadow-[0_24px_68px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
              style={{
                background: hexToRgba(themeBg, opacity / 100),
                minWidth: 440,
              }}
            >
              {chrome !== "none" && (
                <div className="grid grid-cols-[68px_1fr_68px] items-center px-4 pt-3.5 pb-1">
                  <div className="flex gap-2">
                    {(chrome === "colors"
                      ? ["#ff5f57", "#febc2e", "#28c840"]
                      : ["#8886", "#8886", "#8886"]
                    ).map((c, i) => (
                      <span
                        key={i}
                        className="size-3 rounded-full"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    spellCheck={false}
                    className="w-full bg-transparent text-center font-mono text-xs outline-none"
                    style={{ color: themeFg, opacity: 0.55 }}
                  />
                  <span />
                </div>
              )}
              <div className={`relative ${lineNumbers ? "with-ln" : ""}`}>
                <div
                  className="code-block"
                  style={codeStyle}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  wrap="off"
                  className="absolute inset-0 resize-none overflow-hidden whitespace-pre bg-transparent text-transparent outline-none"
                  style={{ ...codeStyle, caretColor: themeFg }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 flex justify-center px-6 pb-6">
        <div className="flex max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-2xl border border-white/10 bg-zinc-900/80 px-5 py-3.5 shadow-2xl backdrop-blur-xl">
          <Control label="Gradient">
            <Swatches
              items={BACKGROUNDS}
              active={background.id}
              onPick={setBackground}
            />
          </Control>

          <Control label="Raycast wallpapers">
            <Swatches
              items={WALLPAPERS}
              active={background.id}
              onPick={setBackground}
              scroll
            />
          </Control>

          <Control label="Language">
            <Select
              value={lang}
              onValueChange={(v) => setLang(v as BundledLanguage)}
            >
              <SelectTrigger size="sm" className="w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Control>

          <Control label="Theme">
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger size="sm" className="w-40 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value={MONO_THEME.name!}>
                  {MONO_THEME.displayName}
                </SelectItem>
                {bundledThemesInfo.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Control>

          <Control label={`Opacity · ${opacity}%`}>
            <Slider
              value={[opacity]}
              onValueChange={([v]) => setOpacity(v)}
              min={50}
              max={100}
              step={1}
              className="w-24"
            />
          </Control>

          <Control label={`Padding · ${padding}px`}>
            <Slider
              value={[padding]}
              onValueChange={([v]) => setPadding(v)}
              min={16}
              max={160}
              step={8}
              className="w-32"
            />
          </Control>

          <Control label={`Size · ${fontSize}px`}>
            <Slider
              value={[fontSize]}
              onValueChange={([v]) => setFontSize(v)}
              min={12}
              max={20}
              step={1}
              className="w-24"
            />
          </Control>

          <Control label="Chrome">
            <Select
              value={chrome}
              onValueChange={(v) => setChrome(v as ChromeStyle)}
            >
              <SelectTrigger size="sm" className="w-24 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mono">Mono</SelectItem>
                <SelectItem value="colors">macOS</SelectItem>
                <SelectItem value="none">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </Control>

          <Control label="Lines">
            <Toggle
              size="sm"
              variant="outline"
              pressed={lineNumbers}
              onPressedChange={setLineNumbers}
              className="h-8 px-3 text-xs"
            >
              {lineNumbers ? "On" : "Off"}
            </Toggle>
          </Control>
        </div>
      </footer>
    </div>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const m = /^#?([\da-f]{6})/i.exec(hex);
  if (!m || alpha >= 1) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function Swatches({
  items,
  active,
  onPick,
  scroll,
}: {
  items: Background[];
  active: string;
  onPick: (bg: Background) => void;
  scroll?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 py-0.5 ${
        scroll ? "max-w-72 overflow-x-auto px-1 [scrollbar-width:thin]" : ""
      }`}
    >
      {items.map((bg) => (
        <button
          key={bg.id}
          title={bg.name}
          onClick={() => onPick(bg)}
          className={`size-6 shrink-0 rounded-full transition hover:scale-110 ${
            active === bg.id
              ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
              : "ring-1 ring-white/20"
          }`}
          style={{ background: bg.swatch ?? bg.css }}
        />
      ))}
    </div>
  );
}

function Control({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}
