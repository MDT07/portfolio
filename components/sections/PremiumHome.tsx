import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/emir-semenov-bullet-portrait.png";
import Container from "@/components/layout/Container";
import ExpertiseExplorer from "@/components/interactive/ExpertiseExplorer";
import ProjectBrief from "@/components/interactive/ProjectBrief";
import SystemObservatory from "@/components/interactive/SystemObservatory";
import Reveal from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/config";
import type { Dictionary } from "@/lib/dictionaries/ru";
import { getAllWorks } from "@/lib/mdx";
import { withLocale, type Locale } from "@/lib/i18n";

interface PremiumHomeProps {
  dict: Dictionary;
  lang: Locale;
}

export default function PremiumHome({ dict, lang }: PremiumHomeProps) {
  const home = dict.home;
  const selectedOrder = ["metric", "norde", "atlas"];
  const selectedWorks = selectedOrder
    .map((slug) => getAllWorks(lang).find((work) => work.slug === slug))
    .filter((work): work is NonNullable<typeof work> => Boolean(work));
  const homeHref = withLocale(lang, "/");
  const sectionHref = (id: string) => `${homeHref}#${id}`;
  const portraitAlt =
    lang === "ru"
      ? "Графический портрет Эмира Семенова из точечных символов"
      : "Graphic bullet-symbol portrait of Emir Semenov";
  const conceptLabel =
    lang === "ru" ? "Концепт · рабочий прототип" : "Concept · working prototype";

  return (
    <article className="premium-home">
      <section className="premium-hero" aria-labelledby="home-title">
        <Container>
          <div className="premium-hero__grid">
            <div className="premium-hero__copy">
              <p className="editorial-label">{home.hero.eyebrow}</p>
              <h1 id="home-title">{home.hero.title}</h1>
              <p className="premium-hero__lede">{home.hero.description}</p>
              <div className="premium-actions">
                <Link className="signal-button" href={sectionHref("selected-work")}>
                  {home.hero.primary}
                  <span aria-hidden>↓</span>
                </Link>
                <Link className="quiet-button" href={sectionHref("contact")}>
                  {home.hero.secondary}
                  <span aria-hidden>↘</span>
                </Link>
              </div>
            </div>

            <SystemObservatory lang={lang} />
          </div>

          <dl className="hero-signals">
            {home.hero.signals.map((signal) => (
              <div key={signal.label}>
                <dt>{signal.label}</dt>
                <dd>{signal.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section id="services" className="ledger-section scroll-mt-24">
        <Container>
          <Reveal>
            <header className="section-intro">
              <p className="editorial-label">01 / {home.services.label}</p>
              <h2>{home.services.title}</h2>
              <p>{home.services.intro}</p>
            </header>
          </Reveal>

          <div className="service-ledger">
            {home.services.items.map((item, index) => (
              <Reveal key={item.title} i={index}>
                <article>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <strong>{item.outcome}</strong>
                    <p>{item.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="selected-work" className="ledger-section ledger-section--ink scroll-mt-24">
        <Container>
          <Reveal>
            <header className="section-intro section-intro--light">
              <p className="editorial-label">02 / {home.work.label}</p>
              <h2>{home.work.title}</h2>
              <p>{home.work.intro}</p>
            </header>
          </Reveal>

          <div className="selected-work-grid">
            {selectedWorks.map((work, index) => (
              <Reveal key={work.slug} i={index} className={index === 0 ? "selected-work-card--lead" : ""}>
                <Link
                  href={withLocale(lang, `/works/${work.slug}`)}
                  className="selected-work-card"
                >
                  <figure>
                    <Image
                      src={work.frontmatter.cover}
                      alt=""
                      fill
                      sizes={index === 0 ? "(min-width: 1024px) 70vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                      className="object-cover"
                    />
                  </figure>
                  <div className="selected-work-card__meta">
                    <span>{conceptLabel}</span>
                    <span>{work.frontmatter.year}</span>
                  </div>
                  <h3>{work.frontmatter.title}</h3>
                  <p>{work.frontmatter.description}</p>
                  <div className="selected-work-card__link">
                    {home.work.openCase}<span aria-hidden>↗</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <a
            className="crmp-ledger"
            href={siteConfig.crmpUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div>
              <p className="editorial-label">{home.work.featuredLabel}</p>
              <h3>{home.work.featuredTitle}</h3>
              <p>{home.work.featuredText}</p>
              <strong>{home.work.featuredLink} ↗</strong>
            </div>
            <div className="crmp-ledger__system" aria-hidden>
              <span>INPUT</span><i /><span>AGENT P</span><i /><span>ACTION</span>
            </div>
          </a>

          <div className="work-disclosure">
            <p>{home.work.disclosure}</p>
            <Link href={withLocale(lang, "/works")}>{dict.works.allWorks}</Link>
          </div>
        </Container>
      </section>

      <section id="expertise" className="ledger-section scroll-mt-24">
        <Container>
          <Reveal>
            <header className="section-intro">
              <p className="editorial-label">03 / {home.expertise.label}</p>
              <h2>{home.expertise.title}</h2>
              <p>{home.expertise.intro}</p>
            </header>
          </Reveal>
          <ExpertiseExplorer groups={home.expertise.groups} label={home.expertise.label} />
        </Container>
      </section>

      <section id="process" className="ledger-section ledger-section--blue scroll-mt-24">
        <Container>
          <Reveal>
            <header className="section-intro section-intro--light">
              <p className="editorial-label">04 / {home.process.label}</p>
              <h2>{home.process.title}</h2>
            </header>
          </Reveal>
          <ol className="process-route">
            {home.process.items.map((item, index) => (
              <li key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="ledger-section ai-bridge">
        <Container>
          <div className="ai-bridge__grid">
            <div>
              <p className="editorial-label">05 / {home.ai.label}</p>
              <h2>{home.ai.title}</h2>
              <p>{home.ai.description}</p>
              <Link href={withLocale(lang, "/ai-works")} className="signal-button">
                {home.ai.link}<span aria-hidden>→</span>
              </Link>
            </div>
            <ul role="list">
              {home.ai.points.map((point, index) => (
                <li key={point}><span>0{index + 1}</span>{point}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section id="about" className="ledger-section profile-section scroll-mt-24">
        <Container>
          <div className="profile-grid">
            <figure>
              <Image
                src={portrait}
                alt={portraitAlt}
                sizes="(min-width: 768px) 36vw, 100vw"
                placeholder="blur"
                className="h-auto w-full"
              />
              <figcaption>EMIR SEMENOV / WEB · AI</figcaption>
            </figure>
            <div>
              <p className="editorial-label">06 / {home.profile.label}</p>
              <h2>{home.profile.title}</h2>
              <p>{home.profile.description}</p>
              <ul role="list">
                {home.profile.notes.map((note) => <li key={note}>{note}</li>)}
              </ul>
              <div className="profile-links">
                <a href={siteConfig.profiUrl} target="_blank" rel="noopener noreferrer">ПРОФИ.РУ ↗</a>
                <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="ledger-section faq-section">
        <Container>
          <header className="section-intro section-intro--compact">
            <p className="editorial-label">07 / {home.faq.label}</p>
            <h2>{home.faq.title}</h2>
          </header>
          <div className="faq-list">
            {home.faq.items.map((item, index) => (
              <details key={item.question}>
                <summary><span>0{index + 1}</span>{item.question}<i aria-hidden>+</i></summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section id="contact" className="contact-stage scroll-mt-20">
        <Container>
          <div className="contact-stage__grid">
            <div>
              <p className="editorial-label">08 / {home.contact.label}</p>
              <h2>{home.contact.title}</h2>
              <p>{home.contact.intro}</p>
              <div className="contact-direct">
                <span>{home.contact.direct}</span>
                <a href={siteConfig.telegramUrl} target="_blank" rel="noopener noreferrer">Telegram ↗</a>
                <a href={siteConfig.profiUrl} target="_blank" rel="noopener noreferrer">ПРОФИ.РУ ↗</a>
              </div>
            </div>
            <ProjectBrief copy={home.contact} lang={lang} />
          </div>
        </Container>
      </section>
    </article>
  );
}
