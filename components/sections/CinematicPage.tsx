"use client";

import { useScene } from "@/components/providers/SceneProvider";
import CanvasEnvironment from "@/components/canvas/CanvasEnvironment";
import CameraRig from "@/components/camera/CameraRig";
import SceneNav from "@/components/navigation/SceneNav";
import CustomCursor from "@/components/cursor/CustomCursor";
import CinematicHero from "@/components/sections/CinematicHero";
import CapabilitiesScene from "@/components/sections/CapabilitiesScene";
import SpatialWorksScene from "@/components/sections/SpatialWorksScene";
import ExperimentsScene from "@/components/sections/ExperimentsScene";
import TechScene from "@/components/sections/TechScene";
import ContactScene from "@/components/sections/ContactScene";
import type { Dictionary } from "@/lib/dictionaries/ru";
import type { Locale } from "@/lib/i18n";

interface WorkPreview {
  slug: string;
  title: string;
  year: string;
  tags: string[];
  cover: string;
  role: string;
  featured?: boolean;
}

interface CinematicPageProps {
  dict: Dictionary;
  lang: Locale;
  works: WorkPreview[];
}

export default function CinematicPage({ dict, lang, works }: CinematicPageProps) {
  const { reducedMotion } = useScene();

  if (reducedMotion) {
    return <StaticFallback dict={dict} lang={lang} works={works} />;
  }

  return (
    <div className="cinematic-page" style={{ height: "700vh" }}>
      <CanvasEnvironment />
      <CameraRig>
        <section id="scene-portal" className="cinematic-scene" aria-label="Portal" />
        <CinematicHero dict={dict} />
        <CapabilitiesScene dict={dict} />
        <SpatialWorksScene dict={dict} lang={lang} works={works} />
        <ExperimentsScene dict={dict} />
        <TechScene dict={dict} />
        <ContactScene dict={dict} />
      </CameraRig>
      <SceneNav />
      <CustomCursor />
    </div>
  );
}

function StaticFallback({ dict, lang, works }: { dict: Dictionary; lang: Locale; works: WorkPreview[] }) {
  return (
    <div className="space-y-24 py-24">
      <CinematicHero dict={dict} />
      <CapabilitiesScene dict={dict} />
      <SpatialWorksScene dict={dict} lang={lang} works={works} />
      <ExperimentsScene dict={dict} />
      <TechScene dict={dict} />
      <ContactScene dict={dict} />
    </div>
  );
}
