import { Helmet } from 'react-helmet-async';

export function Privacy() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-24 sm:py-32 lg:px-8 min-h-[90vh]">
      <Helmet>
        <title>Privacy Policy | ShareNGrow</title>
        <meta name="description" content="Privacy Policy for ShareNGrow." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/privacy" />
      </Helmet>
      
      <div className="mb-14">
        <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tighter text-ink mb-6">Privacy Policy</h1>
        <p className="text-ink-light leading-relaxed mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-lg text-ink-light prose-headings:text-ink prose-a:text-terracotta max-w-none">
        <p>This Privacy Policy describes how ShareNGrow collects, uses, and protects your information when you use our website or services.</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p>We may collect personal information such as your name, email address, phone number, and any other details you provide when submitting inquiries, forms, or joining our community.</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p>We use your information to connect clients with artists, provide customer support, improve our services, and communicate with you about your projects and our community.</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Data Sharing</h2>
        <p>We share necessary project and contact details between clients and artists to facilitate connection. We do not sell your personal data to third-party marketing companies.</p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us.</p>
      </div>
    </div>
  );
}
