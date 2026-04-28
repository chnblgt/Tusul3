function verifyEmailHtml(displayName, verifyLink, note = '') {
    return `<!DOCTYPE html>
<html lang="mn">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Имэйл баталгаажуулах</title>
</head>
<body style="margin:0;padding:0;background:#f0ebff;font-family:'Helvetica Neue',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebff;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr>
          <td align="center" style="padding-bottom:24px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:linear-gradient(135deg,#1a0533,#3b0764);border-radius:14px;padding:12px 20px;">
                  <span style="font-size:20px;font-weight:800;color:#ffffff;letter-spacing:-0.03em;">
                    Duguilan<span style="color:#c4b5fd;">.mn</span>
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(124,58,237,0.12);">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="height:4px;background:linear-gradient(90deg,#4c1d95,#7c3aed,#c4b5fd,#7c3aed,#4c1d95);"></td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:48px 48px 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding-bottom:32px;">
                        <div style="display:inline-block;width:80px;height:80px;background:linear-gradient(135deg,#f5f0ff,#ede9fe);border-radius:24px;border:2px solid rgba(124,58,237,0.15);text-align:center;line-height:80px;font-size:36px;">
                          ✉️
                        </div>
                      </td>
                    </tr>
                  </table>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding-bottom:12px;">
                        <h1 style="margin:0;font-size:26px;font-weight:800;color:#1a0533;letter-spacing:-0.03em;line-height:1.2;">
                          Сайн байна уу, ${displayName}!
                        </h1>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="padding-bottom:${note ? '12px' : '36px'};">
                        <p style="margin:0;font-size:15px;color:#666666;line-height:1.7;max-width:360px;">
                          Имэйл хаягаа баталгаажуулахын тулд доорх товчийг дарна уу.
                        </p>
                      </td>
                    </tr>
                    ${note ? `
                    <tr>
                      <td align="center" style="padding-bottom:36px;">
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background:#f5f0ff;border:1px solid rgba(124,58,237,0.15);border-radius:10px;padding:10px 20px;">
                              <p style="margin:0;font-size:13px;color:#7c3aed;font-weight:600;">
                                ℹ️ &nbsp;${note}
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>` : ''}
                  </table>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding-bottom:36px;">
                        <a href="${verifyLink}"
                           style="display:inline-block;padding:16px 44px;background:linear-gradient(135deg,#7c3aed,#4c1d95);color:#ffffff;text-decoration:none;border-radius:14px;font-size:15px;font-weight:700;letter-spacing:0.01em;box-shadow:0 8px 28px rgba(124,58,237,0.38);">
                          Имэйл баталгаажуулах &nbsp;→
                        </a>
                      </td>
                    </tr>
                  </table>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="border-top:1px solid #f0ebff;padding-top:28px;">

                        <!-- Link fallback -->
                        <p style="margin:0 0 8px;font-size:12px;color:#aaaaaa;text-align:center;">
                          Товч ажиллахгүй байвал доорх линкийг хуулж ашиглана уу:
                        </p>
                        <p style="margin:0 0 20px;text-align:center;">
                          <a href="${verifyLink}" style="font-size:11px;color:#9879d4;word-break:break-all;text-decoration:none;">
                            ${verifyLink}
                          </a>
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background:#fffbeb;border:1px solid rgba(245,158,11,0.2);border-radius:10px;padding:12px 16px;">
                              <p style="margin:0;font-size:12.5px;color:#92400e;text-align:center;">
                                ⏱ &nbsp;Энэ линк <strong>24 цагийн</strong> дотор хүчинтэй.
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
        <tr>
          <td align="center" style="padding-top:28px;">
            <p style="margin:0 0 6px;font-size:12px;color:#9879d4;font-weight:600;">
              Duguilan.mn — Nest IT School
            </p>
            <p style="margin:0;font-size:11px;color:#c4b5fd;">
              Энэ имэйлийг та өөрөө хүсэлт гаргаагүй бол үл тоомсорлоно уу.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}