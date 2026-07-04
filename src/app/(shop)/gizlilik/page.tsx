import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Gizlilik ve KVKK Politikası",
  description:
    "Bisiklet Dünyası kişisel verilerin korunması ve gizlilik politikası.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Gizlilik ve KVKK Politikası" updated="4 Temmuz 2026">
      <Section title="1. Veri Sorumlusu">
        <p>
          İşbu politika, [Firma Ünvanı] (&quot;Bisiklet Dünyası&quot;, &quot;biz&quot;)
          tarafından 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
          kapsamında hazırlanmıştır. İletişim: [Adres], [E-posta], [Telefon].
        </p>
      </Section>
      <Section title="2. Toplanan Kişisel Veriler">
        <p>Hizmetlerimizi sunmak için aşağıdaki verileri işleyebiliriz:</p>
        <ul className="list-disc pl-5">
          <li>Kimlik ve iletişim: ad soyad, e-posta, telefon, teslimat adresi.</li>
          <li>Sipariş bilgileri: ürünler, tutarlar, sipariş geçmişi.</li>
          <li>İşlem güvenliği: IP adresi, oturum ve çerez verileri.</li>
        </ul>
      </Section>
      <Section title="3. İşleme Amaçları">
        <p>
          Verileriniz; siparişlerin oluşturulması ve teslimi, müşteri desteği,
          yasal yükümlülüklerin yerine getirilmesi ve hizmet iyileştirme
          amaçlarıyla işlenir.
        </p>
      </Section>
      <Section title="4. Verilerin Aktarımı">
        <p>
          Verileriniz; kargo, ödeme kuruluşları (ör. iyzico) ve barındırma
          sağlayıcıları gibi hizmet aldığımız tedarikçilerle, yalnızca hizmetin
          gerektirdiği ölçüde ve yasal çerçevede paylaşılabilir.
        </p>
      </Section>
      <Section title="5. Saklama Süresi">
        <p>
          Kişisel verileriniz, ilgili mevzuatta öngörülen veya işlendikleri amaç
          için gerekli olan süre boyunca saklanır; sürenin sonunda silinir,
          yok edilir veya anonim hale getirilir.
        </p>
      </Section>
      <Section title="6. Haklarınız (KVKK m. 11)">
        <p>
          Verilerinize erişme, düzeltilmesini veya silinmesini isteme, işlemeye
          itiraz etme ve aktarım hakkında bilgi talep etme haklarına sahipsiniz.
          Taleplerinizi [E-posta] adresine iletebilirsiniz.
        </p>
      </Section>
      <Section title="7. Değişiklikler">
        <p>
          Bu politika zaman zaman güncellenebilir. Güncel sürüm bu sayfada
          yayımlanır.
        </p>
      </Section>
    </LegalPage>
  );
}
