import "server-only";
import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LANG_COOKIE,
  getDictionary,
  isLocale,
  type Locale,
} from "@/lib/i18n";
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  isCurrency,
  type Currency,
} from "@/lib/currency";

/** Aktif dili `lang` cookie'sinden oku (yoksa varsayılan TR). */
export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Aktif dilin sözlüğü. */
export async function getT() {
  return getDictionary(await getLocale());
}

/** Aktif para birimi (`cur` cookie; yoksa TRY). */
export async function getCurrency(): Promise<Currency> {
  const value = (await cookies()).get(CURRENCY_COOKIE)?.value;
  return isCurrency(value) ? value : DEFAULT_CURRENCY;
}
