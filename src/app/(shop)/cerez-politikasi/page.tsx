import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description: "Bisiklet Dünyası çerez (cookie) politikası.",
};

export default function CookiePage() {
  return (
    <LegalPage title="Çerez Politikası" updated="4 Temmuz 2026">
      <Section title="1. Çerez Nedir?">
        <p>
          Çerezler, siteyi ziyaret ettiğinizde tarayıcınıza kaydedilen küçük
          metin dosyalarıdır. Siteyi çalıştırmak ve deneyiminizi iyileştirmek
          için kullanılır.
        </p>
      </Section>
      <Section title="2. Kullandığımız Çerezler">
        <ul className="list-disc pl-5">
          <li>
            <strong>Zorunlu çerezler:</strong> Sepet ve oturum gibi temel
            işlevler için gereklidir (ör. <code>bisiklet_cart</code>,
            oturum çerezleri, dil/çerez tercihi).
          </li>
          <li>
            <strong>Tercih çerezleri:</strong> Dil ve favori gibi tercihlerinizi
            hatırlar (ör. <code>lang</code>, <code>bisiklet_favs</code>).
          </li>
          <li>
            <strong>Analitik çerezler:</strong> (Kullanılıyorsa) ziyaret
            istatistikleri için kullanılabilir.
          </li>
        </ul>
      </Section>
      <Section title="3. Çerezleri Yönetme">
        <p>
          Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz.
          Ancak zorunlu çerezler devre dışı bırakılırsa sepet ve oturum gibi
          işlevler çalışmayabilir.
        </p>
      </Section>
      <Section title="4. İletişim">
        <p>Sorularınız için: [E-posta].</p>
      </Section>
    </LegalPage>
  );
}
