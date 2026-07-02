import "server-only";
import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LANG_COOKIE,
  getDictionary,
  isLocale,
  type Locale,
} from "@/lib/i18n";

/** Aktif dili `lang` cookie'sinden oku (yoksa varsayılan TR). */
export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Aktif dilin sözlüğü. */
export async function getT() {
  return getDictionary(await getLocale());
}
