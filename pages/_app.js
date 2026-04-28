import "../styles/globals.css";
import Head from "next/head";

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {}
  })();
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </Head>
      <style global jsx>{`
        /* =============================================
           Duguilan.mn — Global Dark / Light Mode Tokens
           ============================================= */

        :root,
        [data-theme="light"] {
          /* ── Backgrounds: noticeably darker than pure white ── */
          --bg-page:        #f0ebfa;
          --bg-hero:        radial-gradient(ellipse at 30% 50%, #ddd5f8 0%, #e8e1f9 35%, #f0ebfa 65%, #f0ebfa 100%);
          --bg-section:     #ece6f7;
          --bg-card:        #faf8ff;
          --bg-card-border: rgba(124, 58, 237, 0.14);
          --bg-input:       #f5f0ff;
          --bg-header:      rgba(240, 235, 250, 0.95);

          /* ── Text: rich dark purple, strong secondary ── */
          --text-primary:   #12022a;
          --text-secondary: #3d2460;
          --text-muted:     #6b4f9a;
          --text-accent:    #7c3aed;

          --border-subtle:  rgba(124, 58, 237, 0.15);
          --border-card:    rgba(26, 5, 51, 0.1);

          --shadow-card:       0 4px 24px rgba(26, 5, 51, 0.09);
          --shadow-card-hover: 0 20px 52px rgba(26, 5, 51, 0.14);

          --input-text:     #12022a;
          --input-border:   rgba(124, 58, 237, 0.25);
        }

        [data-theme="dark"] {
          --bg-page:        #0d0118;
          --bg-hero:        radial-gradient(ellipse at 30% 50%, #1a0533 0%, #120028 40%, #0d0118 70%, #0d0118 100%);
          --bg-section:     #110020;
          --bg-card:        #1c0638;
          --bg-card-border: rgba(167, 139, 250, 0.18);
          --bg-input:       #200840;
          --bg-header:      rgba(13, 1, 24, 0.96);

          /* ── Text: bright, clearly readable on dark purple ── */
          --text-primary:   #f4eeff;
          --text-secondary: #d8c8ff;
          --text-muted:     #b89fe0;
          --text-accent:    #c4b5fd;

          --border-subtle:  rgba(167, 139, 250, 0.18);
          --border-card:    rgba(167, 139, 250, 0.14);

          --shadow-card:       0 4px 24px rgba(0, 0, 0, 0.45);
          --shadow-card-hover: 0 20px 52px rgba(0, 0, 0, 0.55);

          --input-text:     #f0e6ff;
          --input-border:   rgba(167, 139, 250, 0.35);
        }

        html, body {
          background: var(--bg-page);
          color: var(--text-primary);
          transition: background 0.3s ease, color 0.3s ease;
        }

        /* Page backgrounds react to theme */
        .min-h-screen {
          background: var(--bg-page) !important;
          transition: background 0.3s;
        }

        /* Input fields */
        input, textarea, select {
          background: var(--bg-input) !important;
          color: var(--input-text) !important;
          border-color: var(--input-border) !important;
          transition: background 0.3s, color 0.3s, border-color 0.3s;
        }
        input::placeholder, textarea::placeholder {
          color: var(--text-muted) !important;
        }

        /* Cards react to dark mode */
        [data-theme="dark"] .p1-card,
        [data-theme="dark"] .hb-how-card,
        [data-theme="dark"] .pp-club-card,
        [data-theme="dark"] .pp-stat-card,
        [data-theme="dark"] .pp-modal {
          background: var(--bg-card) !important;
          border-color: var(--border-subtle) !important;
          color: var(--text-primary) !important;
        }

        /* Category/clubs page text */
        [data-theme="dark"] .p1-display,
        [data-theme="dark"] .p1-sans,
        [data-theme="dark"] .p1-card-title,
        [data-theme="dark"] .p1-card-desc,
        [data-theme="dark"] .pp-display,
        [data-theme="dark"] .pp-sans,
        [data-theme="dark"] .hb-display,
        [data-theme="dark"] .hb-sans,
        [data-theme="dark"] .si-display,
        [data-theme="dark"] .si-sans,
        [data-theme="dark"] .su-display,
        [data-theme="dark"] .su-sans,
        [data-theme="dark"] .st-sans {
          color: var(--text-primary);
        }

        /* Explicitly make card desc text lighter in dark mode */
        [data-theme="dark"] .p1-card-desc {
          color: var(--text-secondary) !important;
        }

        /* Search input dark */
        [data-theme="dark"] .p1-search {
          background: var(--bg-input) !important;
          color: var(--input-text) !important;
          border-color: var(--input-border) !important;
        }
        [data-theme="dark"] .p1-search::placeholder { color: var(--text-muted) !important; }

        /* Profile / settings inputs */
        [data-theme="dark"] .pp-input,
        [data-theme="dark"] .si-input,
        [data-theme="dark"] .su-input {
          background: var(--bg-input) !important;
          color: var(--input-text) !important;
          border-color: var(--input-border) !important;
        }

        /* Back button */
        [data-theme="dark"] .p1-back {
          background: rgba(167,139,250,0.1) !important;
          color: var(--text-secondary) !important;
          border-color: var(--border-subtle) !important;
        }
        [data-theme="dark"] .p1-back:hover {
          background: rgba(167,139,250,0.2) !important;
          color: var(--text-accent) !important;
        }

        /* Filter buttons */
        [data-theme="dark"] .p1-filter-btn {
          background: rgba(167,139,250,0.1);
          color: var(--text-secondary);
          border-color: var(--border-subtle);
        }

        /* Scrollbar */
        [data-theme="dark"] {
          scrollbar-color: #4c1d95 #1a0533;
        }
        [data-theme="light"] {
          scrollbar-color: #c4b5fd #e8e1f9;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}