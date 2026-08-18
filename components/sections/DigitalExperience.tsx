import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/emir-semenov-bullet-portrait.png";
import Container from "@/components/layout/Container";
import AIProcessDiagram from "@/components/interactive/AIProcessDiagram";
import ExpertiseExplorer from "@/components/interactive/ExpertiseExplorer";
import ProjectBrief from "@/components/interactive/ProjectBrief";
import ProjectReel from "@/components/interactive/ProjectReel";
import SceneNavigator from "@/components/interactive/SceneNavigator";
import WebGLSignal from "@/components/interactive/WebGLSignal";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/config";
import type { Dictionary } from "@/lib/dictionaries/ru";
import { getAllWorks } from "@/lib/works";
import { withLocale, type Locale } from "@/lib/i18n";

interface DigitalExperienceProps {
  dict: Dictionary;
  lang: Locale;
}

export default function DigitalExperience({ dict, lang }: DigitalExperienceProps) {
  const { home, aiWorks } = dict;
  const works = getAllWorks(lang);
  const portraitAlt = lang === "ru"
    ? "Графический портрет Эмира Семенова из точечных символов"
    : "Graphic bullet-symbol portrait of Emir Semenov";
  const homeHref = withLocale(lang, "/");

  return (
    <article className="digital-experience">
      <SceneNavigator lang={lang} />

      <section id="signal" className="experience-scene signal-scene" aria-labelledby="home-title">
        <Container>
          <div className="scene-coordinate">
            <span>SCENE 01 / SIGNAL</span>
            <span>{lang === "ru" ? "Эмир Семенов · Creative developer" : "Emir Semenov · Creative developer"}</span>
          </div>
          <div className="signal-scene__grid">
            <div className="signal-scene__copy">
              <p className="scene-kicker">{home.hero.eyebrow}</p>
              <h1 id="home-title">
                <span>{lang === "ru" ? "Проектирую" : "I design"}</span>
                <span>{lang === "ru" ? "цифровые" : "digital"}</span>
                <span>{lang === "ru" ? "системы." : "systems."}</span>
              </h1>
              <p>{home.hero.description}</p>
              <div className="scene-actions">
                <a href="#work">{home.hero.primary}<span aria-hidden>↓</span></a>
                <a href="#contact">{home.hero.secondary}<span aria-hidden>↘</span></a>
              </div>
            </div>
            <WebGLSignal lang={lang} />
          </div>
          <div className="signal-scene__rail">
            {home.hero.signals.map((signal, index) => (
              <div key={signal.label}>
                <span>0{index + 1}</span>
                <strong>{signal.label}</strong>
                <p>{signal.value}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="identity" className="experience-scene identity-scene">
        <div className="kinetic-band" aria-hidden>
          <div>DESIGN / CODE / INTELLIGENCE / SHIP / DESIGN / CODE / INTELLIGENCE / SHIP /</div>
        </div>
        <Container>
          <div className="scene-coordinate">
            <span>SCENE 02 / IDENTITY</span>
            <span>{lang === "ru" ? "Не CV. Рабочая позиция." : "Not a CV. A working position."}</span>
          </div>
          <div className="identity-scene__grid">
            <figure>
              <div className="identity-scene__portrait">
                <Image src={portrait} alt={portraitAlt} placeholder="blur" sizes="(min-width: 768px) 42vw, 92vw" />
                <span aria-hidden>EMIR / 2026</span>
              </div>
              <figcaption>PORTRAIT BUILT FROM A SINGLE SYMBOL / •</figcaption>
            </figure>
            <div className="identity-scene__copy">
              <p className="scene-kicker">{home.profile.label}</p>
              <h2>{home.profile.title}</h2>
              <p className="identity-scene__lead">{home.profile.description}</p>
              <ul>
                {home.profile.notes.map((note, index) => (
                  <li key={note}><span>0{index + 1}</span>{note}</li>
                ))}
              </ul>
              <div className="identity-scene__links">
                <a href={siteConfig.profiUrl} target="_blank" rel="noreferrer">ПРОФИ.РУ ↗</a>
                <a href={siteConfig.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="systems" className="experience-scene systems-scene">
        <Container>
          <div className="scene-coordinate scene-coordinate--light">
            <span>SCENE 03 / SYSTEMS</span>
            <span>WEB / MOTION / AI / DELIVERY</span>
          </div>
          <div id="services" className="systems-scene__intro scroll-mt-24">
            <p className="scene-kicker">{home.services.label}</p>
            <h2>{home.services.title}</h2>
            <p>{home.services.intro}</p>
          </div>
          <div className="systems-grid">
            {home.services.items.map((item, index) => (
              <Reveal key={item.title} i={index}>
                <article>
                  <span>SYS / 0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <strong>{item.outcome}</strong>
                  <p>{item.description}</p>
                  <i aria-hidden />
                </article>
              </Reveal>
            ))}
          </div>
          <div className="systems-expertise">
            <header>
              <p className="scene-kicker">{home.expertise.label}</p>
              <h3>{home.expertise.title}</h3>
              <p>{home.expertise.intro}</p>
            </header>
            <ExpertiseExplorer groups={home.expertise.groups} label={home.expertise.label} />
          </div>
        </Container>
      </section>

      <section id="work" className="experience-scene work-scene">
        <Container>
          <div className="scene-coordinate">
            <span>SCENE 04 / PROOF</span>
            <span>{lang === "ru" ? "Интерактивные концепты · без вымышленных клиентов" : "Interactive concepts · no fabricated clients"}</span>
          </div>
          <div className="work-scene__intro">
            <div>
              <p className="scene-kicker">{home.work.label}</p>
              <h2>{home.work.title}</h2>
            </div>
            <div>
              <p>{home.work.intro}</p>
              <p>{home.work.disclosure}</p>
              <Link href={withLocale(lang, "/works")}>{dict.works.allWorks}</Link>
            </div>
          </div>
        </Container>
        <ProjectReel works={works} lang={lang} />
      </section>

      <section id="intelligence" className="experience-scene intelligence-scene">
        <Container>
          <div className="scene-coordinate scene-coordinate--light">
            <span>SCENE 05 / INTELLIGENCE</span>
            <span>{lang === "ru" ? "Контекст → проверка → действие" : "Context → validation → action"}</span>
          </div>
          <div className="intelligence-scene__intro">
            <div>
              <p className="scene-kicker">{home.ai.label}</p>
              <h2>{home.ai.title}</h2>
            </div>
            <div>
              <p>{home.ai.description}</p>
              <Link href={withLocale(lang, "/ai-works")}>{home.ai.link} ↗</Link>
            </div>
          </div>
          <AIProcessDiagram process={aiWorks.process} scenarios={aiWorks.scenarios} />
          <a className="intelligence-proof" href={siteConfig.crmpUrl} target="_blank" rel="noreferrer">
            <div>
              <span>{home.work.featuredLabel}</span>
              <h3>{home.work.featuredTitle}</h3>
              <p>{home.work.featuredText}</p>
            </div>
            <div className="intelligence-proof__route" aria-hidden>
              <span>INPUT</span><i /><span>AGENT P</span><i /><span>HUMAN CHECK</span><i /><span>ACTION ↗</span>
            </div>
          </a>
        </Container>
      </section>

      <section id="protocol" className="experience-scene protocol-scene">
        <Container>
          <div className="scene-coordinate">
            <span>SCENE 06 / PROTOCOL</span>
            <span>{lang === "ru" ? "От неопределённости к запуску" : "From ambiguity to launch"}</span>
          </div>
          <div className="protocol-scene__intro">
            <p className="scene-kicker">{home.process.label}</p>
            <h2>{home.process.title}</h2>
          </div>
          <ol className="protocol-route">
            {home.process.items.map((item, index) => (
              <li key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{item.title}</h3><p>{item.description}</p></div>
              </li>
            ))}
          </ol>
          <div className="protocol-faq">
            <header><p className="scene-kicker">{home.faq.label}</p><h3>{home.faq.title}</h3></header>
            <div>
              {home.faq.items.map((item, index) => (
                <details key={item.question}>
                  <summary><span>0{index + 1}</span>{item.question}<i aria-hidden>+</i></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="contact" className="experience-scene contact-scene scroll-mt-20">
        <Container>
          <div className="scene-coordinate scene-coordinate--light">
            <span>SCENE 07 / CONTACT</span>
            <span>{lang === "ru" ? "Сигнал принят" : "Signal received"}</span>
          </div>
          <div className="contact-scene__grid">
            <div>
              <p className="scene-kicker">{home.contact.label}</p>
              <h2>{home.contact.title}</h2>
              <p>{home.contact.intro}</p>
              <div className="contact-scene__direct">
                <span>{home.contact.direct}</span>
                <a href={siteConfig.telegramUrl} target="_blank" rel="noreferrer">Telegram ↗</a>
                <a href={siteConfig.profiUrl} target="_blank" rel="noreferrer">ПРОФИ.РУ ↗</a>
              </div>
            </div>
            <ProjectBrief copy={home.contact} lang={lang} />
          </div>
          <a className="contact-scene__return" href={`${homeHref}#signal`}>
            <span>{lang === "ru" ? "Вернуться к сигналу" : "Return to signal"}</span>
            <span aria-hidden>↑</span>
          </a>
        </Container>
      </section>
    </article>
  );
}
