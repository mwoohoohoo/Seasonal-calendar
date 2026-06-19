import { Languages } from "lucide-react";

export default function Footer({ language, setLanguage, t }) {
  return (
    <footer className="py-8 w-full">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-10">
        {/* TOP DIVIDER */}
        <div className="border-t border-border mb-8" />

        {/* FOOTER CONTENT */}
        <div className="flex flex-col gap-6">
          {/* SOURCES */}
          <div className="flex flex-col gap-4 items-start sm:items-center">
            <h3 className="text-xs uppercase tracking-wider">{t.sources}</h3>

            <ul className="flex flex-col sm:flex-row text-xs text-muted-foreground gap-2 sm:gap-8">
              <li>
                <a
                  href="https://www.greenpeace.org/static/planet4-netherlands-stateless/2024/10/e7090572-seizoensgids-greenpeace.pdf"
                  target="_blank"
                >
                  Greenpeace
                </a>
              </li>
              <li>
                <a href="https://www.veggipedia.nl/" target="_blank">
                  Veggipedia
                </a>
              </li>
              <li>
                <a href="https://www.verseoogst.nl/" target="_blank">
                  Verse Oogst
                </a>
              </li>
              <li>
                <a
                  href="https://www.voedingscentrum.nl/Assets/Uploads/voedingscentrum/Documents/Consumenten/Veelgestelde%20vragen/Voedingscentrum%20seizoengroente-%20en%20fruitkalender.pdf"
                  target="_blank"
                >
                  Voedingscentrum
                </a>
              </li>
            </ul>
          </div>

          <div className="flex w-full items-center justify-between ">
            {/* COPYRIGHT */}
            <div className="text-xs text-muted-foreground">
              © Merri Hookway {new Date().getFullYear()}
            </div>

            {/* LANGUAGE TOGGLE */}
            <div className="flex items-center gap-2 text-sm">
              <Languages size={14} className="text-muted-foreground" />

              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`
      cursor-pointer
      transition-colors
      hover:text-primary
      ${
        language === "en"
          ? "font-semibold text-primary"
          : "text-muted-foreground"
      }
    `}
                aria-label="Switch to English"
              >
                EN
              </button>

              <span className="text-muted-foreground">|</span>

              <button
                type="button"
                onClick={() => setLanguage("nl")}
                className={`
      cursor-pointer
      transition-colors
      hover:text-primary
      ${
        language === "nl"
          ? "font-semibold text-primary"
          : "text-muted-foreground"
      }
    `}
                aria-label="Wissel naar Nederlands"
              >
                NL
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
