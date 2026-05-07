import "../styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

const themeScript = `
  (function() {
    try {
      var t = localStorage.getItem('theme') || 'light';
      var valid = ['light', 'dark', 'purple'].includes(t) ? t : 'light';
      document.documentElement.setAttribute('data-theme', valid);
    } catch(e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
`;

export default function App({ Component, pageProps }) {
  const router = useRouter();

  function applyTheme() {
    try {
      const t = localStorage.getItem("theme") || "light";
      const valid = ["light", "dark", "purple"].includes(t) ? t : "light";
      document.documentElement.setAttribute("data-theme", valid);
    } catch (e) {}
  }

  useEffect(() => {
    applyTheme();
    router.events.on("routeChangeComplete", applyTheme);
    return () => router.events.off("routeChangeComplete", applyTheme);
  }, []);

  return (
    <>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}