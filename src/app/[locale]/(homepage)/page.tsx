import { redirect } from '@/i18n/navigation';
import type { SupportedLocale } from '@/shared/i18n/locales';

type Props = {
  params: Promise<{ locale: SupportedLocale }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  redirect({ href: '/portfolios', locale });
}
