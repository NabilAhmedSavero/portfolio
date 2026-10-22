import Image from "next/image";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { LocalClock } from "@/components/local-clock";
import { RichText } from "@/components/rich-text";
import { Section } from "@/components/section";
import { SiteContainer } from "@/components/site-container";
import { getHomeContent, getHomeExperiences } from "@/sanity/lib/home";
import "./home.css";

export const metadata: Metadata = { title: { absolute: "Nabil Savero" } };

export default async function HomePage() {
  const [site, experiences] = await Promise.all([getHomeContent(), getHomeExperiences()]);

  return (
    <div className="home-page">
      <SiteContainer className="home-container">
        <header className="home-location home-panel">
          <span className="home-place">
            <svg className="home-location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 10c0 3.976-7 11-7 11s-7-7.024-7-11 3.134-7 7-7 7 3.024 7 7z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{site.locationTimezoneLabel}</span>
          </span>
          <LocalClock />
        </header>

        <main id="main-content" tabIndex={-1}>
          <section aria-labelledby="intro-heading" className="home-hero home-panel">
            <Image src={site.heroProfileImage.src} alt={site.heroProfileImage.alt} width={48} height={48} className="home-profile" preload />
            <div className="home-identity">
              <h1 id="intro-heading">{site.heroDisplayName}</h1>
              <p className="home-role">{site.heroRole}</p>
            </div>
          </section>

          <Section id="about" title="About" className="home-panel">
            <div className="home-prose">
              <RichText value={site.about} />
            </div>
          </Section>

          <Section id="currently" title="Currently" className="home-panel">
            <div className="home-prose">
              <RichText value={site.currently} />
              <p>{site.freelanceStartingPrice}</p>
              <p>
                {site.currentlyContactIntro}{site.currentlyContactIntro && " "}
                {site.currentlyContactCta.href ? (
                  <a href={site.currentlyContactCta.href} target="_blank" rel="noopener noreferrer">{site.currentlyContactCta.text}</a>
                ) : site.currentlyContactCta.text}.
              </p>
            </div>
          </Section>

          <Section id="experience" title="Experience" className="home-panel">
            <ul className="home-experiences">
              {experiences.map((experience) => (
                <li key={experience.id} className="home-experience">
                  {experience.logo ? (
                    <Image src={experience.logo.src} alt={experience.logo.alt} width={28} height={28} className="home-experience-logo" />
                  ) : <span className={`home-experience-mark${experience.monogram ? " home-monogram" : ""}`} aria-hidden="true">{experience.monogram}</span>}
                  <div>
                    <h3>{experience.position}</h3>
                    <p className="home-experience-period">
                      <span>{experience.company}</span>
                      {experience.company && experience.period && <span aria-hidden="true">·</span>}
                      <span>{experience.period}</span>
                    </p>
                    {experience.description && <p className="home-experience-description">{experience.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        </main>
        <Footer variant="home" />
      </SiteContainer>
    </div>
  );
}
