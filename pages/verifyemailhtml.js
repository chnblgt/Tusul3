import Link from "next/link";

function verifyEmailHtml(displayName, verifyLink, note = '') {
  return `<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Имэйл баталгаажуулах — Duguilan.com</title>
</head>
<body style="margin:0;padding:0;background:#f0ebff;font-family:'Helvetica Neue',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebff;padding:48px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">

        <!-- Wordmark -->
        <tr>
          <td align="center" style="padding-bottom:28px;">
            <p style="margin:0;font-size:22px;font-weight:800;color:#1a0533;letter-spacing:-0.02em;">
              Duguilan<span style="color:#7c3aed;">.com</span>
            </p>
            <p style="margin:4px 0 0;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#9879d4;">
              Nest IT School
            </p>
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 16px 56px rgba(124,58,237,0.1);">

            <!-- Top accent bar -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="height:4px;background:linear-gradient(90deg,#4c1d95 0%,#7c3aed 50%,#4c1d95 100%);"></td>
              </tr>
            </table>

            <!-- Body -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:52px 48px 44px;">

                  <!-- Greeting -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:10px;">
                        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#9879d4;">
                          Email Verification
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom:20px;">
                        <h1 style="margin:0;font-size:28px;font-weight:800;color:#1a0533;letter-spacing:-0.025em;line-height:1.2;">
                          Сайн байна уу, ${displayName}
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-bottom:${note ? '16px' : '36px'};">
                        <p style="margin:0;font-size:15px;color:#555555;line-height:1.75;">
                          Бүртгэлээ идэвхжүүлэхийн тулд имэйл хаягаа баталгаажуулна уу. Доорх товчийг дарснаар таны бүртгэл нэн даруй идэвхтэй болно.
                        </p>
                      </td>
                    </tr>
                    ${note ? `
                    <tr>
                      <td style="padding-bottom:36px;">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="background:#f5f0ff;border-left:3px solid #7c3aed;border-radius:0 8px 8px 0;padding:12px 18px;">
                              <p style="margin:0;font-size:13px;color:#4c1d95;line-height:1.6;">${note}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>` : ''}
                  </table>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding-bottom:40px;">
                        <Link href="${verifyLink}"
                           style="display:inline-block;padding:16px 48px;background:#7c3aed;color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.02em;">
                          Имэйл баталгаажуулах
                        </Link>
                      </td>
                    </tr>
                  </table>

                  <!-- Divider -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="border-top:1px solid #f0ebff;padding-top:32px;">

                        <!-- Fallback link -->
                        <p style="margin:0 0 6px;font-size:12px;color:#aaaaaa;text-align:center;">
                          Товч ажиллахгүй байвал доорх холбоосыг хуулж хөтөч дээрээ нээнэ үү:
                        </p>
                        <p style="margin:0 0 24px;text-align:center;">
                          <Link href="${verifyLink}" style="font-size:11px;color:#7c3aed;word-break:break-all;text-decoration:none;">
                            ${verifyLink}
                          </Link>
                        </p>

                        <!-- Expiry notice -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background:#fffbeb;border:1px solid rgba(245,158,11,0.22);border-radius:8px;padding:12px 18px;">
                              <p style="margin:0;font-size:12.5px;color:#92400e;text-align:center;line-height:1.5;">
                                Энэхүү баталгаажуулах холбоос нь илгээсэн цагаас хойш
                                <strong>24 цагийн</strong> дотор хүчинтэй байна.
                              </p>
                            </td>
                          </tr>
                        </table>

                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding-top:32px;">
            <p style="margin:0 0 5px;font-size:12px;font-weight:700;letter-spacing:0.06em;color:#7c3aed;">
              Duguilan.com
            </p>
            <p style="margin:0 0 5px;font-size:11px;color:#9879d4;">
              Nest IT School &mdash; Ulaanbaatar, Mongolia
            </p>
            <p style="margin:0;font-size:11px;color:#b8a8d0;">
              Хэрэв та энэхүү хүсэлтийг өөрөө гаргаагүй бол энэ имэйлийг үл тоомсорлоно уу.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

module.exports = verifyEmailHtml;