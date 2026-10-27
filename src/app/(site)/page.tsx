import Image from "next/image";
import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { RichText, VerifiedBadge } from "@/components/rich-text";
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

  const handleText = site.roleSubtitle || "@saverovkn";
  const hasAtPrefix = handleText.startsWith("@");

  return (
    <div className="home-page min-h-screen flex flex-col m-0 p-0">
      <div className="w-full max-w-[560px] mx-auto min-h-screen flex flex-col m-0 p-0">
        {/* Hero Profile Header */}
        <header
          aria-labelledby="intro-heading"
          className="home-panel pt-20 md:pt-28 pb-8 px-4 flex items-center gap-3.5 w-full"
        >
          {/* Profile Avatar Frame */}
          <div className="w-[44px] h-[44px] rounded-[10px] overflow-hidden relative shrink-0">
            <Image
              src={avatarSrc}
              alt={site.heroProfileImage.alt || "Nabil Savero"}
              width={44}
              height={44}
              className="w-full h-full object-cover"
              unoptimized
              priority
              style={{ imageRendering: "-webkit-optimize-contrast" }}
            />
            {/* Figma Inner Shadow 2px White Overlay */}
            <div className="absolute inset-0 rounded-[10px] ring-2 ring-inset ring-[#ffffff] pointer-events-none z-10" />
          </div>

          {/* Profile Typography */}
          <div className="h-[44px] flex flex-col justify-between py-[2px] text-left leading-[18px]">
            <div className="inline-flex items-center gap-[5px]">
              <h1 id="intro-heading" className="font-sans text-[15px] leading-[18px] font-medium text-[#1c1c1c]">
                {site.heroDisplayName}
              </h1>
              <VerifiedBadge />
            </div>
            <p className="font-sans text-[15px] leading-[18px] font-normal text-[#999999]">
              {hasAtPrefix ? (
                <span className="inline-flex items-center">
                  <span className="-translate-y-[0.5px]">@</span>
                  <span>{handleText.slice(1)}</span>
                </span>
              ) : (
                handleText
              )}
            </p>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="m-0 p-0 flex flex-col gap-20">
          {/* Intro / About Section (No heading label) */}
          <Section id="about" ariaLabel="About" className="home-panel">
            <div className="home-prose font-sans text-[15px] leading-[24px] font-[450]">
              <RichText value={site.about} cityHoverColor={site.cityHoverColor} />
            </div>
          </Section>

          {/* Currently Section */}
          <Section id="currently" title="Currently" className="home-panel">
            <div className="home-prose font-sans text-[15px] leading-[24px] font-[450]">
              <RichText value={site.currently} />
            </div>
          </Section>

          {/* Contacts Section */}
          <Section id="contact" title="Contacts" className="home-panel">
            <div className="home-prose font-sans text-[15px] leading-[24px] font-[450]">
              <RichText value={site.contactsCopy} />
            </div>
          </Section>
        </main>

        {/* Minimalist Footer with Live Local Clock */}
        <Footer variant="home" />
      </div>
    </div>
  );
}
