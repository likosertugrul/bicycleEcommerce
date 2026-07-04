import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: "Bisiklet Dünyası mesafeli satış sözleşmesi.",
};

export default function DistanceSalesPage() {
  return (
    <LegalPage title="Mesafeli Satış Sözleşmesi" updated="4 Temmuz 2026">
      <Section title="1. Taraflar">
        <p>
          <strong>Satıcı:</strong> [Firma Ünvanı], [Adres], [Vergi Dairesi/No],
          [E-posta], [Telefon].
        </p>
        <p>
          <strong>Alıcı:</strong> Sipariş sırasında belirtilen ad, adres ve
          iletişim bilgilerine sahip müşteri.
        </p>
      </Section>
      <Section title="2. Konu">
        <p>
          İşbu sözleşme, Alıcı&apos;nın Satıcı&apos;ya ait web sitesinden
          elektronik ortamda sipariş verdiği ürünün satışı ve teslimi ile ilgili
          6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamındaki hak ve
          yükümlülükleri düzenler.
        </p>
      </Section>
      <Section title="3. Ürün ve Ödeme">
        <p>
          Sipariş edilen ürünün cinsi, adedi ve satış bedeli sipariş özetinde ve
          onay ekranında belirtilir. Ödeme, sunulan yöntemlerle (online ödeme,
          havale/EFT veya mağazadan ödeme) yapılır.
        </p>
      </Section>
      <Section title="4. Teslimat">
        <p>
          Ürün, Alıcı&apos;nın belirttiği adrese kargo ile ya da mağazadan teslim
          seçeneğiyle teslim edilir. Kargo ücreti sipariş özetinde gösterilir.
          Teslim süresi, ödeme onayından itibaren makul süre içindedir.
        </p>
      </Section>
      <Section title="5. Cayma Hakkı">
        <p>
          Alıcı, teslim tarihinden itibaren 14 gün içinde gerekçe göstermeksizin
          cayma hakkına sahiptir. Ürünün kullanılmamış ve yeniden satılabilir
          durumda iade edilmesi gerekir. Kişiye özel üretilen veya hijyen gereği
          iadesi uygun olmayan ürünlerde cayma hakkı istisnaları geçerlidir.
        </p>
      </Section>
      <Section title="6. Uyuşmazlık">
        <p>
          Uyuşmazlıklarda Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri
          yetkilidir.
        </p>
      </Section>
    </LegalPage>
  );
}
