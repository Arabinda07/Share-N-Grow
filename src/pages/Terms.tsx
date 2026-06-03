import { Helmet } from 'react-helmet-async';

export function Terms() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-24 sm:py-32 lg:px-8 min-h-[90vh]">
      <Helmet>
        <title>Terms of Service | ShareNGrow</title>
        <meta name="description" content="Terms of Service for ShareNGrow." />
        <link rel="canonical" href="https://share-n-grow.vercel.app/terms" />
      </Helmet>
      
      <div className="mb-14">
        <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tighter text-ink mb-6">Terms of Service</h1>
        <p className="text-ink-light leading-relaxed mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-lg text-ink-light prose-headings:text-ink max-w-none">
        <p>Welcome to ShareNGrow. By accessing or using our website, you agree to be bound by these Terms of Service.</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Our Service</h2>
        <p>ShareNGrow is a curated network that connects artists with clients seeking their services. We act as facilitators and are not a party to the agreements or contracts between clients and artists.</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">User Responsibilities</h2>
        <p>As a user (artist or client), you agree to provide accurate information and communicate respectfully. Clients and artists are solely responsible for negotiating project terms, timelines, and payments.</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
        <p>ShareNGrow does not guarantee the quality, safety, or legality of the services provided by artists. We are not responsible for any disputes, damages, or losses arising from interactions between clients and artists.</p>
        
        <h2 className="text-xl font-semibold mt-8 mb-4">Changes to Terms</h2>
        <p>We may update these terms from time to time. Your continued use of the platform after changes indicates your acceptance of the updated terms.</p>
      </div>
    </div>
  );
}
