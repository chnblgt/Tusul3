import Header from "@/waterbottle/Header";
import Footer from "@/waterbottle/Footer";

export default function AboutPage() {
  const team = [
    "Khangarid Jargalsaikhan",
    "Chinbiligt Dovchinbazar",
    "Temuulen Temuujin",
    "Delgermurun Ganbold",
    "Gan-Erdene Undrakhtamir"
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "radial-gradient(ellipse at 20% 30%, #ddd6fe 0%, #ede9fe 30%, #f5f3ff 55%, #faf5ff 75%, #ffffff 100%)" }}>
      <style>{fonts}</style>
      <Header />

      <main style={{ flex: 1, padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          
          <section style={{ textAlign: "center", marginBottom: "100px" }} className="ab-a1">
            <span className="ab-sans" style={{ 
              color: "#7c3aed", fontWeight: 700, fontSize: "14px", 
              letterSpacing: "0.1em", textTransform: "uppercase" 
            }}>
              Our Mission
            </span>
            <h1 className="ab-display" style={{ 
              fontSize: "clamp(40px, 8vw, 64px)", color: "#1a0533", 
              lineHeight: 1.1, marginTop: "20px", letterSpacing: "-0.04em" 
            }}>
              Spend your time <br />
              <span style={{ color: "#7c3aed", fontStyle: "italic" }}>productively.</span>
            </h1>
            <p className="ab-sans" style={{ 
              fontSize: "18px", color: "#555", maxWidth: "600px", 
              margin: "30px auto 0", lineHeight: 1.6 
            }}>
              Duguilan.mn provides quick access to clubs and activities across Ulaanbaatar. 
              We believe that every student deserves an easy way to discover their passions 
              and turn their free time into meaningful growth.
            </p>
          </section>

          <section style={{ 
            background: "rgba(255, 255, 255, 0.6)", 
            backdropFilter: "blur(10px)",
            borderRadius: "32px",
            padding: "60px",
            border: "1px solid rgba(124, 58, 237, 0.1)",
            marginBottom: "100px"
          }} className="ab-a2">
            <h2 className="ab-display" style={{ fontSize: "32px", color: "#1a0533", marginBottom: "40px" }}>
              The Story
            </h2>
            <div className="ab-sans" style={{ fontSize: "16px", color: "#444", lineHeight: 1.8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
              <div>
                <p>
                  What started as a simple idea at <strong>Nest IT School</strong> has grown into a 
                  dedicated platform for the Mongolian student community. We noticed that while 
                  Ulaanbaatar is full of talent, finding the right place to start 
                  is often the hardest part.
                </p>
              </div>
              <div>
                <p>
                  Duguilan.mn bridges that gap by centralizing information and helping 
                  club leaders reach the people who need them most. We are committed 
                  to building a digital space where community and productivity meet.
                </p>
              </div>
            </div>
          </section>

          <section className="ab-a3">
            <h2 className="ab-display" style={{ fontSize: "32px", color: "#1a0533", marginBottom: "40px", textAlign: "center" }}>
              The Team
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "24px" 
            }}>
              {team.map((member) => (
                <div key={member} style={{ 
                  background: "#fff", 
                  padding: "32px 24px", 
                  borderRadius: "20px", 
                  border: "1.5px solid rgba(124, 58, 237, 0.08)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}>
                  <div style={{ 
                    width: "56px", height: "56px", background: "#f5f0ff", 
                    borderRadius: "14px", marginBottom: "20px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#7c3aed", fontWeight: 800, fontSize: "22px",
                    lineHeight: 1
                  }}>
                    {member[0]}
                  </div>
                  <p className="ab-sans" style={{ fontWeight: 600, color: "#1a0533", margin: "0 0 4px 0", lineHeight: 1.2 }}>
                    {member}
                  </p>
                  <p className="ab-sans" style={{ fontSize: "12px", color: "#7c3aed", margin: 0, fontWeight: 500, letterSpacing: "0.02em" }}>
                    Developer
                  </p>
                </div>
              ))}
            </div>
            <p className="ab-sans" style={{ textAlign: "center", marginTop: "48px", color: "#7a6090", fontSize: "14px" }}>
              Built with ❤️ by a student team at <strong>Nest IT School</strong>
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,800;1,9..144,700&family=DM+Sans:wght@400;500;600;700&display=swap');
  .ab-display { font-family: 'Fraunces', serif; }
  .ab-sans { font-family: 'DM Sans', sans-serif; }

  @keyframes ab-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ab-a1 { animation: ab-fadeUp 0.7s ease-out forwards; }
  .ab-a2 { animation: ab-fadeUp 0.7s ease-out 0.2s forwards; opacity: 0; }
  .ab-a3 { animation: ab-fadeUp 0.7s ease-out 0.4s forwards; opacity: 0; }

  @media (max-width: 768px) {
    .ab-sans div { grid-template-columns: 1fr !important; gap: 20px !important; }
  }
`;