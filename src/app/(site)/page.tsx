import Image from "next/image";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { LocalClock } from "@/components/local-clock";
import { RichText } from "@/components/rich-text";
import { Section } from "@/components/section";
import { getHomeContent } from "@/sanity/lib/home";
import { urlForImage } from "@/sanity/lib/images";
import "./home.css";

export const metadata: Metadata = { title: { absolute: "Nabil Savero" } };

export default async function HomePage() {
  const site = await getHomeContent();

  const avatarSrc =
    (site.heroProfileImageRaw?.asset
      ? urlForImage(site.heroProfileImageRaw)?.width(512).height(512).quality(100).fit("crop").url()
      : null) || site.heroProfileImage.src;

  return (
    <div className="home-page min-h-screen flex flex-col">
      <div className="w-full max-w-[560px] mx-auto px-4 min-[560px]:px-0 pb-0 flex-1 flex flex-col">
        {/* Hero Profile Header */}
        <header
          aria-labelledby="intro-heading"
          className="home-panel pt-10 md:pt-14 pb-10 flex flex-col items-center text-center mx-auto w-full"
        >
          {/* Profile Avatar Frame */}
          <div className="w-[56px] h-[56px] rounded-[12px] overflow-hidden relative mx-auto">
            <Image
              src={avatarSrc}
              alt={site.heroProfileImage.alt || "Nabil Savero"}
              width={56}
              height={56}
              className="w-full h-full object-cover"
              unoptimized
              priority
              style={{ imageRendering: "-webkit-optimize-contrast" }}
            />
            {/* Figma Inner Shadow 2px White Overlay */}
            <div className="absolute inset-0 rounded-[12px] ring-2 ring-inset ring-[#ffffff] pointer-events-none z-10" />
          </div>

          {/* Profile Typography */}
          <h1 id="intro-heading" className="mt-3 font-medium text-[16px] leading-[20px] text-[#1c1c1c] text-center">
            {site.heroDisplayName}
          </h1>
          <p className="mt-1 font-sans font-[450] text-[14px] leading-[20px] text-[#999999] text-center">
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
              <p>
                Previously collaborated with{" "}
                <a href="https://faction.ai" target="_blank" rel="noopener noreferrer">
                  Faction
                </a>
                ,{" "}
                <a href="https://servinghours.com" target="_blank" rel="noopener noreferrer">
                  Serving Hours
                </a>
                ,{" "}
                <a href="https://plied.ai" target="_blank" rel="noopener noreferrer">
                  Plied
                </a>
                ,{" "}
                <a href="https://caraflorist.com/" target="_blank" rel="noopener noreferrer">
                  Cara Florist
                </a>
                , and others.
              </p>
            </div>
          </Section>
        </main>

        {/* Contact and Footer - strictly untouched */}
        <Footer variant="home" />
      </div>
    </div>
  );
}
