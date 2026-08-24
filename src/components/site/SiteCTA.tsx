import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SiteCTAProps {
  title?: string;
  body?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export default function SiteCTA({
  title = "Transformăm viziunea ta în mobilier premium",
  body = "Moodilier înseamnă mobilier la comandă realizat cu precizie, rafinament și pasiune pentru design interior premium.",
  primaryHref = "/contact",
  primaryLabel = "Solicită o ofertă gratuită",
  secondaryHref = "/proiecte",
  secondaryLabel = "Descoperă portofoliul",
}: SiteCTAProps) {
  return (
    <section className="aw-cta" aria-labelledby="aw-site-cta-title">
      <div className="aw-container">
        <p className="aw-label">Hai să lucrăm împreună</p>
        <h2 id="aw-site-cta-title" className="aw-h2">
          {title}
        </h2>
        {body ? <p className="aw-body">{body}</p> : null}
        <div className="aw-cta-actions">
          <Link href={primaryHref} className="aw-btn aw-btn-primary aw-btn-fill">
            {primaryLabel}
            <ArrowRight size={14} />
          </Link>
          <Link href={secondaryHref} className="aw-btn aw-btn-outline-dark aw-btn-fill">
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
