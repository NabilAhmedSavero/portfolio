import { Section } from "@/components/section";
import { getSiteContent } from "@/sanity/lib/content";
import { getHomeContent } from "@/sanity/lib/home";
import { safeHref } from "@/sanity/lib/links";

export async function Footer({ variant = "foundation" }: { variant?: "home" | "foundation" } = {}) {
  if (variant === "home") {
    const home = await getHomeContent();
    const emailHref = safeHref(`mailto:${home.contactEmail}`);

    return (
      <>
        <Section id="contact" title="Contact" className="home-panel">
          <dl className="home-contact-list">
            {emailHref && (
              <div className="home-contact-row">
                <dt>Email</dt>
                <dd><a href={emailHref}>{home.contactEmail}</a></dd>
              </div>
            )}
            {home.socialLinks.map((link) => (
              <div key={link.id} className="home-contact-row">
                <dt>{link.label}</dt>
                <dd><a href={link.href} target="_blank" rel="noopener noreferrer">{link.displayText}</a></dd>
              </div>
            ))}
          </dl>
        </Section>
        <footer className="home-footer home-panel"><p>{home.footerText}</p></footer>
      </>
    );
  }

  const site = await getSiteContent();
  const emailHref = site?.contactEmail ? safeHref(`mailto:${site.contactEmail}`) : null;
  const socialLinks = (site?.socialLinks ?? []).flatMap((link) => {
    const href = safeHref(link.href);
    return href && link.label?.trim() ? [{ id: link._key, label: link.label, href }] : [];
  });
  const hasContactContent = Boolean(emailHref || socialLinks.length || site?.footerText?.trim());

  return (
    <footer className="site-footer">
      <Section id="contact" title="Contact">
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
