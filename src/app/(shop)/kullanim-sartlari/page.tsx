import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description: "Bisiklet Dünyası web sitesi kullanım şartları.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Kullanım Şartları" updated="4 Temmuz 2026">
      <Section title="1. Taraflar ve Kabul">
        <p>
          Bu web sitesini ([Alan Adı]) kullanarak işbu kullanım şartlarını kabul
          etmiş sayılırsınız. Site, [Firma Ünvanı] tarafından işletilir.
        </p>
      </Section>
      <Section title="2. Hizmetler">
        <p>
          Sitede sıfır ve ikinci el bisiklet ile ilgili ürünler satışa sunulur.
          Ürün görselleri temsilî olabilir; renk ve detaylarda küçük farklar
          olabilir.
        </p>
      </Section>
      <Section title="3. Üyelik ve Hesap Güvenliği">
        <p>
          Üyelik isteğe bağlıdır. Hesap bilgilerinizin gizliliğinden ve
          hesabınız üzerinden yapılan işlemlerden siz sorumlusunuz.
        </p>
      </Section>
      <Section title="4. Fiyatlandırma">
        <p>
          Fiyatlar ABD doları (USD) cinsindendir ve KDV dahil/­hariç durumu
          sipariş ekranında belirtilir. Fiyatlar önceden haber verilmeksizin
          değiştirilebilir; siparişinizde geçerli olan, sipariş anındaki fiyattır.
        </p>
      </Section>
      <Section title="5. Fikri Mülkiyet">
        <p>
          Sitedeki içerik, tasarım ve markalar [Firma Ünvanı]&apos;na aittir ve
          izinsiz kullanılamaz.
        </p>
      </Section>
      <Section title="6. Sorumluluğun Sınırlandırılması">
        <p>
          Site, kesintisiz ve hatasız hizmet garantisi vermez. Mücbir sebep ve
          üçüncü taraf hizmet kesintilerinden doğan zararlardan sorumlu tutulamaz.
        </p>
      </Section>
      <Section title="7. Uygulanacak Hukuk">
        <p>
          İşbu şartlara Türkiye Cumhuriyeti hukuku uygulanır; uyuşmazlıklarda
          [Şehir] mahkemeleri ve icra daireleri yetkilidir.
        </p>
      </Section>
    </LegalPage>
  );
}
