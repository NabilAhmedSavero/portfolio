import Image from "next/image";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { LocalClock } from "@/components/local-clock";
import { RichText } from "@/components/rich-text";
import { Section } from "@/components/section";
import { getHomeContent, getHomeExperiences } from "@/sanity/lib/home";
import { urlForImage } from "@/sanity/lib/images";
import "./home.css";

export const metadata: Metadata = { title: { absolute: "Nabil Savero" } };

export default async function HomePage() {
  const [site, experiences] = await Promise.all([getHomeContent(), getHomeExperiences()]);

  const avatarSrc =
    (site.heroProfileImageRaw?.asset
      ? urlForImage(site.heroProfileImageRaw)?.width(512).height(512).quality(100).fit("crop").url()
      : null) || site.heroProfileImage.src;

  return (
    <div className="home-page min-h-screen">
      <div className="w-full max-w-[560px] mx-auto px-4 min-[560px]:px-0 pb-20">
        {/* Hero Profile Header */}
        <header
          aria-labelledby="intro-heading"
          className="home-panel pt-8 md:pt-12 pb-10 flex flex-col items-center text-center mx-auto"
        >
          {/* Profile Avatar Frame */}
          <div className="relative w-[64px] h-[64px] rounded-[12px] overflow-hidden">
            <Image
              src={avatarSrc}
              alt={site.heroProfileImage.alt || "Nabil Savero"}
              width={64}
              height={64}
              className="w-full h-full object-cover"
              unoptimized
              priority
              style={{ imageRendering: "-webkit-optimize-contrast" }}
            />
            {/* Figma Inner Shadow 2px White Overlay */}
            <div className="absolute inset-0 rounded-[12px] ring-2 ring-inset ring-[#ffffff] pointer-events-none z-10" />
          </div>

          {/* Profile Typography */}
          <h1 id="intro-heading" className="mt-3 font-medium text-[18px] leading-[24px] text-[#1c1c1c]">
            {site.heroDisplayName}
          </h1>
          <p className="mt-1 font-sans font-[450] text-[14px] leading-[20px] text-[#999999]">
            <LocalClock city="Balikpapan" />
          </p>
        </header>

        <main id="main-content" tabIndex={-1}>
          {/* About Section */}
          <Section id="about" title="About" className="home-panel">
            <div className="home-prose font-sans text-[15px] leading-[24px]">
              <RichText value={site.about} />
            </div>
          </Section>

          {/* Currently Section */}
          <Section id="currently" title="Currently" className="home-panel">
            <div className="home-prose font-sans text-[15px] leading-[24px]">
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

          {/* Experience Section - strictly untouched */}
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

        {/* Contact and Footer - strictly untouched */}
        <Footer variant="home" />
      </div>
    </div>
  );
}
