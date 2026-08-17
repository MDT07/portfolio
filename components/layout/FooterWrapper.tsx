import PosterFooter from "@/components/layout/PosterFooter";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/ru";

interface FooterWrapperProps {
  lang: Locale;
  dict: Dictionary;
}

export default function FooterWrapper({ lang, dict }: FooterWrapperProps) {
  return <PosterFooter lang={lang} dict={dict} />;
}
