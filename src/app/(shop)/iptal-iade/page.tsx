import type { Metadata } from "next";
import { LegalPage, Section } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "İptal ve İade Koşulları",
  description: "Bisiklet Dünyası sipariş iptali, cayma ve iade koşulları.",
};

export default function RefundPage() {
  return (
    <LegalPage title="İptal ve İade Koşulları" updated="4 Temmuz 2026">
      <Section title="1. Sipariş İptali">
        <p>
          Kargoya verilmemiş siparişler için iptal talebinizi [E-posta] veya
          [Telefon] üzerinden iletebilirsiniz. Ödemesi alınmış iptal
          siparişlerinde bedel, aynı ödeme yöntemiyle iade edilir.
        </p>
      </Section>
      <Section title="2. Cayma Hakkı">
        <p>
          Teslim tarihinden itibaren 14 gün içinde gerekçe göstermeksizin cayma
          hakkınız vardır. Ürünün kullanılmamış, hasarsız ve yeniden satılabilir
          durumda; aksesuar ve faturasıyla birlikte iade edilmesi gerekir.
        </p>
      </Section>
      <Section title="3. İade Süreci">
        <ul className="list-disc pl-5">
          <li>İade talebinizi iletin, ürünü anlaşmalı kargoyla gönderin.</li>
          <li>Ürün tarafımıza ulaşıp incelendikten sonra iade onaylanır.</li>
          <li>Bedel iadesi 14 gün içinde yapılır.</li>
        </ul>
      </Section>
      <Section title="4. Ayıplı / Hasarlı Ürün">
        <p>
          Ayıplı veya nakliyede hasar görmüş ürünlerde kargo ve iade masrafları
          Satıcı&apos;ya aittir. Lütfen teslim aldığınızda paketi kontrol edin.
        </p>
      </Section>
      <Section title="5. İkinci El Ürünler">
        <p>
          İkinci el ürünlerde, ilan ve ürün sayfasında belirtilen durum bilgisi
          esas alınır; ürün açıklamasına uygun teslim edilen ikinci el ürünlerde
          &quot;ayıp&quot; hükümleri, açıklanan kullanım durumu çerçevesinde
          değerlendirilir.
        </p>
      </Section>
    </LegalPage>
  );
}
