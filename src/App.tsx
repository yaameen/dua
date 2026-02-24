import { useEffect, useState } from "react";

// const DUAS_URL = `/duas.json`;
const DUAS_URL = `https://raw.githubusercontent.com/yaameen/dua/refs/heads/main/public/duas.json?v=${Date.now()}`;

type DuaItem = { label?: string; text: string; translation?: string };
type DuasData = {
  header?: { title?: string; subtitle?: string };
  duas?: Record<string, DuaItem[]>;
  footer?: { title?: string; text?: string };
};

const fetchDuas = (): Promise<DuasData> =>
  fetch(DUAS_URL)
    .then((r) => r.json())
    .catch((err) => {
      console.error("Error fetching duas:", err);
      return {};
    });

function getPageUrl(dayKey: string): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${window.location.pathname}#day-${dayKey}`;
}

function getShareText(dua: DuaItem, pageUrl: string): string {
  const parts = [dua.text];
  if (dua.translation != null && dua.translation !== "")
    parts.push(dua.translation);
  parts.push(pageUrl);
  return parts.join("\n\n");
}

function getShareUrl(
  platform: "facebook" | "x" | "whatsapp" | "telegram" | "viber",
  shareText: string,
  pageUrl: string
): string {
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedText = encodeURIComponent(shareText);
  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "x":
      return `https://x.com/intent/tweet?text=${encodedText}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodedText}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    case "viber":
      return `https://viber.com/forward?text=${encodedText}`;
    default:
      return "#";
  }
}

const shareIcons = {
  facebook: (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  viber: (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M11.4 0c-.2 0-.4 0-.6.1-2.2.3-4 1.5-5.2 3.4-1.2 1.9-1.6 4.1-1.2 6.3.4 2.2 1.6 4.1 3.4 5.3 1.8 1.2 3.9 1.7 6.1 1.4.4 0 .8-.1 1.2-.2.4-.1.8-.3 1.1-.5.3-.2.6-.5.8-.8.2-.3.4-.7.5-1.1.1-.4.2-.8.2-1.2v-2.8c0-.4-.1-.8-.3-1.1-.2-.3-.5-.6-.8-.8-.3-.2-.7-.3-1.1-.4-.4 0-.8 0-1.2.1l-1.5.4c-.2.1-.5.1-.7 0-.2-.1-.4-.2-.5-.4-.1-.2-.2-.4-.2-.6v-1.9c0-.5-.2-1-.5-1.4-.3-.4-.8-.7-1.3-.8-.5-.1-1-.1-1.5 0zm5.9 5.5c.2 0 .4.1.6.2.2.1.3.3.4.5.1.2.1.4.1.6v1.9c0 .2.1.4.2.6.1.2.3.3.5.4.2.1.5.1.7 0l1.5-.4c.4-.1.8-.1 1.2-.1.4 0 .8.1 1.1.4.3.2.6.5.8.8.2.3.3.7.3 1.1v2.8c0 .4-.1.8-.2 1.2-.1.4-.3.8-.5 1.1-.2.3-.5.6-.8.8-.3.2-.7.4-1.1.5-.4.1-.8.2-1.2.2-2.2.3-4.3-.2-6.1-1.4-1.8-1.2-3-3.1-3.4-5.3-.4-2.2 0-4.4 1.2-6.3 1.2-1.9 3-3.1 5.2-3.4.2 0 .4-.1.6-.1z" />
    </svg>
  ),
  x: (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  telegram: (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  whatsapp: (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
};

function App() {
  const [data, setData] = useState<DuasData>({});
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchDuas()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const days = data.duas ? Object.entries(data.duas) : [];

  if (loading) {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center bg-[#0a0704]">
        <p className="font-[Amiri] text-2xl text-gradient-gold text-glow">
          بِسْمِ اللهِ...
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen text-[#f0e6c8]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        {/* Header */}
        <header className="relative text-center animate-fade-up">
          <p className="mb-4 font-[Amiri] text-3xl font-medium sm:text-4xl text-gradient-gold text-glow">
            بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <div className="mx-auto mb-5 flex max-w-sm items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#c8a84b]/50 to-transparent" />
            <span className="text-[#c8a84b]/80">۞</span>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8a84b]/50 to-transparent" />
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-[#f0e6c8] sm:text-3xl">
            {data.header?.title}
          </h1>
          <p
            className="text-sm tracking-widest text-[#b09060] sm:text-base"
            dir="ltr"
          >
            {data.header?.subtitle}
          </p>
          <div className="mx-auto mt-5 h-px max-w-xs bg-gradient-to-r from-transparent via-[#3d2e10] to-transparent" />
        </header>

        {/* Flowing sections by day */}
        <main className="mt-16 space-y-16">
          {days.length === 0 ? (
            <p className="text-center font-[Amiri] text-lg text-[#b09060] py-12 animate-fade-up">
              لا أدعية متاحة الآن. تفضّل بالعودة لاحقاً.
            </p>
          ) : (
            days.map(([dayKey, items], sectionIndex) => (
              <section
                key={dayKey}
                id={`day-${dayKey}`}
                className="space-y-8 animate-fade-up scroll-mt-24"
                style={{ animationDelay: `${sectionIndex * 0.08}s` }}
              >
                <a
                  href={`#day-${dayKey}`}
                  className="group flex items-center gap-4 no-underline hover:opacity-90 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#c8a84b]/20 to-[#c8a84b]/5 text-[#e8c97a] ring-1 ring-[#c8a84b]/30 group-hover:ring-[#c8a84b]/50 transition-all duration-200">
                    {parseInt(dayKey, 10)}
                  </span>
                  <h2 className="text-lg font-semibold tracking-wide text-[#e8c97a]">
                    دُعَاء رَقْم {parseInt(dayKey, 10)} — Dua Number{" "}
                    {parseInt(dayKey, 10)}
                  </h2>
                  <span className="h-px flex-1 max-w-32 bg-gradient-to-l from-[#3d2e10]/80 via-[#c8a84b]/20 to-transparent" />
                </a>
                <div className="space-y-12">
                  {items.map((dua, i) => (
                    <article
                      key={`${dayKey}-${i}`}
                      className="relative space-y-4 border-r-2 border-[#c8a84b]/20 pr-5"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c8a84b]/15 text-xs font-semibold text-[#c8a84b] tabular-nums">
                          {i + 1}
                        </span>
                        {dua.label != null && dua.label !== "" && (
                          <p className="text-xl font-waheed font-semibold uppercase tracking-widest text-[#b09060]">
                            {dua.label}
                          </p>
                        )}
                      </div>
                      <p
                        className="dua-arabic text-right text-xl leading-[2.15] text-[#f0e6c8] sm:text-2xl"
                        dir="rtl"
                      >
                        {dua.text}
                      </p>
                      {dua.translation != null && dua.translation !== "" && (
                        <p className="text-xl font-waheed leading-relaxed text-[#b09060] max-w-xl border-r border-[#3d2e10]/50 pr-4">
                          {dua.translation}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-1 pt-2">
                        <span className="mr-2 text-xs text-[#b09060]/80">
                          Share:
                        </span>
                        {(
                          [
                            "facebook",
                            "x",
                            "whatsapp",
                            "telegram",
                            "viber",
                          ] as const
                        ).map((platform) => {
                          const pageUrl = getPageUrl(dayKey);
                          const shareText = getShareText(dua, pageUrl);
                          const url = getShareUrl(platform, shareText, pageUrl);
                          return (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3d2e10]/50 text-[#b09060] hover:bg-[#c8a84b]/20 hover:text-[#e8c97a] transition-colors"
                              title={
                                platform.charAt(0).toUpperCase() +
                                platform.slice(1)
                              }
                              aria-label={`Share on ${platform}`}
                            >
                              {shareIcons[platform]}
                            </a>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => {
                            const pageUrl = getPageUrl(dayKey);
                            const shareText = getShareText(dua, pageUrl);
                            navigator.clipboard
                              ?.writeText(shareText)
                              .then(() => {
                                setCopiedId(`${dayKey}-${i}`);
                                setTimeout(() => setCopiedId(null), 2000);
                              });
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3d2e10]/50 text-[#b09060] hover:bg-[#c8a84b]/20 hover:text-[#e8c97a] transition-colors"
                          title="Copy (paste in Instagram)"
                          aria-label="Copy to clipboard for Instagram"
                        >
                          {shareIcons.instagram}
                        </button>
                        {copiedId === `${dayKey}-${i}` && (
                          <span className="ml-1 text-xs text-[#c8a84b]">
                            Copied!
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
                <div className="flex items-center gap-3 py-2">
                  <span className="h-px flex-1 max-w-[8rem] bg-gradient-to-l from-transparent via-[#c8a84b]/30 to-transparent" />
                  <span className="text-[#c8a84b]/50">✦ ✦ ✦</span>
                  <span className="h-px flex-1 max-w-[8rem] bg-gradient-to-r from-transparent via-[#c8a84b]/30 to-transparent" />
                </div>
              </section>
            ))
          )}
        </main>

        {/* Footer */}
        <footer className="mt-24 space-y-5 text-center animate-fade-up">
          <p className="font-[Amiri] text-xl text-[#c8a84b] text-glow">
            وَالحَمْدُ لِلَّهِ رَبِّ العَالَمِين
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#c8a84b]/40" />
            <span className="text-[#c8a84b]/70">۞</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#c8a84b]/40" />
          </div>
          <p className="text-xs tracking-widest text-[#b09060]" dir="ltr">
            {data.footer?.title} · {data.footer?.text}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
