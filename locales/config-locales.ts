// ----------------------------------------------------------------------

export type LanguageValue = "en" | "es" | "pt";

export const fallbackLng = (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as LanguageValue) ?? "pt";
export const languages = ["pt", "es", "en"];
export const defaultNS = "common";
export const cookieName = "i18next";

// ----------------------------------------------------------------------

export function i18nOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    lng,
    fallbackLng,
    ns,
    defaultNS,
    fallbackNS: defaultNS,
    supportedLngs: languages,
  };
}

// ----------------------------------------------------------------------

export const changeLangMessages: Record<
  LanguageValue,
  { success: string; error: string; loading: string }
> = {
  en: {
    success: "Language has been changed!",
    error: "Error changing language!",
    loading: "Loading...",
  },
  es: {
    success: "¡Se ha cambiado el idioma!",
    error: "¡Error al cambiar el idioma!",
    loading: "Cargando...",
  },
  pt: {
    success: "O idioma foi alterado!",
    error: "Erro ao alterar o idioma!",
    loading: "Carregando...",
  },
};
