import { Body, Container, Head, Heading, Html, Link, Section, Text } from '@react-email/components';
import type { ReactNode } from 'react';

export type EmailSummaryLine = { label: string; value: string };

type EmailLayoutProps = { heading: string; children: ReactNode };

const bodyStyle = { backgroundColor: '#f4f4f5', fontFamily: 'Helvetica, Arial, sans-serif', margin: 0 };
const containerStyle = {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  margin: '24px auto',
  padding: 32,
  maxWidth: 560,
};
const labelStyle = { color: '#71717a', fontSize: 12, margin: '0 0 2px' };
// `pre-wrap` preserva as quebras de linha da descrição digitada pelo lead.
const valueStyle = { color: '#18181b', fontSize: 15, margin: '0 0 14px', whiteSpace: 'pre-wrap' as const };
const paragraphStyle = { color: '#18181b', fontSize: 15, lineHeight: 1.6 };

/** Moldura comum dos e-mails. React escapa todo texto interpolado, então dados do lead são seguros aqui. */
function EmailLayout({ heading, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading as="h1" style={{ fontSize: 22, margin: '0 0 16px' }}>
            {heading}
          </Heading>
          {children}
        </Container>
      </Body>
    </Html>
  );
}

function SummaryList({ lines }: { lines: EmailSummaryLine[] }) {
  return (
    <Section>
      {lines.map(({ label, value }) => (
        <div key={label}>
          <Text style={labelStyle}>{label}</Text>
          <Text style={valueStyle}>{value}</Text>
        </div>
      ))}
    </Section>
  );
}

export type EmailSignatureLink = { label: string; url: string };

export type AutoresponderEmailProps = {
  greeting: string;
  body: string;
  closing: string;
  signature: string;
  links: EmailSignatureLink[];
};

/** "linkedin | github": rótulos em minúsculas e sublinhados, cada um apontando para o perfil. */
function SignatureLinks({ links }: { links: EmailSignatureLink[] }) {
  return (
    <Text style={{ ...paragraphStyle, margin: 0 }}>
      {links.map(({ label, url }, index) => (
        <span key={label}>
          {index > 0 && ' | '}
          <Link href={url} style={{ color: '#18181b', textDecoration: 'underline' }}>
            {label.toLowerCase()}
          </Link>
        </span>
      ))}
    </Text>
  );
}

/** Confirmação genérica enviada ao lead — de propósito não repete o que ele preencheu. */
export function AutoresponderEmail({ greeting, body, closing, signature, links }: AutoresponderEmailProps) {
  return (
    <EmailLayout heading={greeting}>
      <Text style={paragraphStyle}>{body}</Text>
      <Text style={{ ...paragraphStyle, margin: '0 0 12px' }}>{closing}</Text>
      <Text style={{ ...paragraphStyle, margin: 0, fontWeight: 700 }}>{signature}</Text>
      <SignatureLinks links={links} />
    </EmailLayout>
  );
}

export type NotificationEmailProps = { heading: string; summary: EmailSummaryLine[] };

/** Aviso interno para quem atende, com tudo o que o lead preencheu. */
export function NotificationEmail({ heading, summary }: NotificationEmailProps) {
  return (
    <EmailLayout heading={heading}>
      <SummaryList lines={summary} />
    </EmailLayout>
  );
}

export type DeliveryAlertEmailProps = { heading: string; body: string };

/** Avisa quem atende que a confirmação ao lead não saiu. */
export function DeliveryAlertEmail({ heading, body }: DeliveryAlertEmailProps) {
  return (
    <EmailLayout heading={heading}>
      <Text style={paragraphStyle}>{body}</Text>
    </EmailLayout>
  );
}
