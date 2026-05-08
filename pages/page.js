import Header from "../waterbottle/Header";
import Body from "../waterbottle/Body";
import Footer from "../waterbottle/Footer";
import Link from "next/link";


export default function Page() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-page)", transition: "background 0.3s" }}>
      <Header />
      <Body />
      <Footer />
    </div>
  );
}