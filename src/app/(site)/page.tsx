import Image from "next/image";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { LocalClock } from "@/components/local-clock";
import { RichText } from "@/components/rich-text";
import { Section } from "@/components/section";
import { getHomeContent, getHomeExperiences } from "@/sanity/lib/home";
import "./home.css";

export const metadata: Metadata = { title: { absolute: "Nabil Savero" } };

export default async function HomePage() {
  const [site, experiences] = await Promise.all([getHomeContent(), getHomeExperiences()]);

  return (
    <div className="home-page min-h-screen">
      <div className="w-full max-w-[560px] mx-auto px-4 min-[560px]:px-0 pt-8 pb-20 flex flex-col gap-[40px]">
        {/* Hero Banner & Profile Header */}
        <section aria-labelledby="intro-heading" className="w-full max-w-[560px]">
          {/* Cover / Banner Image Frame */}
          <div className="w-full max-w-[560px] h-[132px] rounded-[12px] overflow-hidden relative bg-[#EBEBEB]" />

          {/* Profile Avatar & Info Frame */}
          {/* Overlapping bottom-left area of banner and centered cleanly above Name and Location/Time block */}
          <div className="relative -mt-[32px] ml-[20px] w-fit flex flex-col items-center text-center gap-[12px]">
            {/* Profile Avatar Frame */}
            <div className="w-[64px] h-[64px] rounded-[12px] overflow-hidden relative bg-[#FFFFFF]/[0.01] after:content-[''] after:absolute after:inset-0 after:rounded-[12px] after:shadow-[inset_0_0_0_2px_#ffffff] after:pointer-events-none">
              <Image
                src={site.heroProfileImage.src}
                alt={site.heroProfileImage.alt}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            {/* Profile Typography */}
            <div className="flex flex-col gap-[2px]">
              <h1 id="intro-heading" className="font-medium text-[18px] leading-[24px] text-[#1c1c1c]">
                {site.heroDisplayName}
              </h1>
              <p className="font-[450] text-[14px] leading-[20px] text-[#999999]">
                <LocalClock city="Balikpapan" />
              </p>
            </div>
          </div>
        </section>

        <main id="main-content" tabIndex={-1} className="flex flex-col gap-[40px]">
          {/* About Section */}
          <section id="about" aria-labelledby="about-heading" className="w-full max-w-[560px] flex flex-col gap-[12px] p-0">
            <h2 id="about-heading" className="font-sans text-[0.875rem] font-normal leading-[1.6] tracking-[-0.02em] text-[#808080]">
              About
            </h2>
            <div className="h-[1px] w-full bg-[#E5E5E5]" role="separator" />
            <div className="home-prose">
              <RichText value={site.about} />
            </div>
          </section>

          {/* Currently Section */}
          <section id="currently" aria-labelledby="currently-heading" className="w-full max-w-[560px] flex flex-col gap-[12px] p-0">
            <h2 id="currently-heading" className="font-sans text-[0.875rem] font-normal leading-[1.6] tracking-[-0.02em] text-[#808080]">
              Currently
            </h2>
            <div className="h-[1px] w-full bg-[#E5E5E5]" role="separator" />
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
          </section>

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
