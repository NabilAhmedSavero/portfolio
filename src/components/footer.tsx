import { LocalClock } from "@/components/local-clock";
import { Section } from "@/components/section";
import { getSiteContent } from "@/sanity/lib/content";
import { safeHref } from "@/sanity/lib/links";

export async function Footer({ variant = "foundation" }: { variant?: "home" | "foundation" } = {}) {
  if (variant === "home") {
    return (
      <footer className="home-panel home-footer mt-auto flex items-center justify-between pt-24 pb-16 px-4 font-sans text-[14px] leading-[20px] text-[#737373] w-full">
        <span>© saverovkn</span>
        <LocalClock />
      </footer>
    );
  }

  const content = await getSiteContent();
  // Keep Work's current footer until its existing CMS migration switch is enabled.
  const site = content?.useCmsProjects === true ? content : null;
  const emailHref = site?.contactEmail ? safeHref(`mailto:${site.contactEmail}`) : null;
  const socialLinks = (site?.socialLinks ?? []).flatMap((link) => {
    const href = safeHref(link.href);
    return href && link.label?.trim() ? [{ id: link._key, label: link.label, href }] : [];
  });
  const hasContactContent = Boolean(emailHref || socialLinks.length || site?.footerText?.trim());

  return (
    <footer className="site-footer">
      <Section id="contact" title="Contacts">
        {hasContactContent ? (
          <>
            {emailHref && (
              <p><a href={emailHref} className="underline underline-offset-4">{site?.contactEmail}</a></p>
            )}
            {socialLinks.length > 0 && (
              <ul>
                {socialLinks.map((link) => (
                  <li key={link.id}><a href={link.href} className="underline underline-offset-4">{link.label}</a></li>
                ))}
              </ul>
            )}
            {site?.footerText?.trim() && <p className="text-muted whitespace-pre-line">{site.footerText}</p>}
          </>
        ) : (
          <p className="text-muted">
            Contact details placeholder — final email or booking link to be added.
          </p>
        )}
      </Section>
    </footer>
  );
}
