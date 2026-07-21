import type { ThemeRegistration } from "shiki";

/**
 * Monochrome theme: bold white identifiers over grey keywords/strings,
 * matching the Raycast/Vercel-style promo screenshots.
 */
export const MONO_THEME: ThemeRegistration = {
  name: "code-share-mono",
  displayName: "Mono (code/share)",
  type: "dark",
  colors: {
    "editor.background": "#0d0d0d",
    "editor.foreground": "#ededed",
  },
  settings: [
    {
      settings: { foreground: "#ededed" },
    },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#5a5a5a" },
    },
    {
      scope: [
        "keyword",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "keyword.operator",
        "variable.language",
      ],
      settings: { foreground: "#8f8f8f" },
    },
    {
      scope: [
        "punctuation",
        "meta.brace",
        "punctuation.definition.string",
        "punctuation.separator",
        "punctuation.terminator",
      ],
      settings: { foreground: "#8f8f8f" },
    },
    {
      scope: ["string", "string.quoted"],
      settings: { foreground: "#b8b8b8" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant"],
      settings: { foreground: "#d4d4d4" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call entity.name.function",
        "variable.function",
      ],
      settings: { foreground: "#ffffff", fontStyle: "bold" },
    },
    {
      scope: [
        "meta.object-literal.key",
        "meta.object-literal.key string",
        "support.type.property-name",
        "entity.name.tag",
        "entity.name.type",
        "entity.name.class",
        "support.class",
      ],
      settings: { foreground: "#ffffff", fontStyle: "bold" },
    },
    {
      scope: ["variable", "variable.other", "variable.parameter", "entity.name"],
      settings: { foreground: "#ededed" },
    },
  ],
};
