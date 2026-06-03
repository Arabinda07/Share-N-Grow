import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { ChevronDownIcon as ChevronDown, ChevronUpIcon as ChevronUp } from '@radix-ui/react-icons';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is ShareNGrow?",
      answer: "ShareNGrow is a curated network connecting artists with clients seeking their services. We help clients find talented drawing teachers, mural artists, live event sketchers, portrait artists, and workshop facilitators, all while protecting the privacy of both artists and clients."
    },
    {
      question: "Is ShareNGrow free to use?",
      answer: "Yes, it is completely free to submit inquiries as a client and to apply to be listed as an artist. We do not extract a commission from transactions between you and the artist."
    },
    {
      question: "How do you vet artists?",
      answer: "Artists apply to join the network and are approved by our team upon manual review of their portfolio, professional background, and readiness for client engagements. We look for a clear, demonstrable skill set and a professional approach."
    },
    {
      question: "How does the introduction process work?",
      answer: "When you submit a request for an artist, our team will review the details. If we find a suitable match from our network, we will share the artist's public profile with you and, with your consent, arrange an introduction via WhatsApp or phone. After the introduction, you interact directly with the artist."
    },
    {
      question: "Is my contact information safe?",
      answer: "Yes. ShareNGrow values privacy by default. Phone numbers, email addresses, and specific location data from your request are hidden from the public internet. We only share necessary contact details with a matched artist once an introduction is initiated."
    },
    {
      question: "How do I pay the artist?",
      answer: "All financial transactions and contract agreements happen directly between the client and the chosen artist. ShareNGrow only acts as an introduction platform."
    },
    {
      question: "Can I request multiple artists for different services?",
      answer: "Yes, absolutely. You can use our general 'Request Custom Work' page, or any of the specific service forms, as many times as you'd like. Our team will review each request individually and suggest artists tailored to that specific project."
    },
    {
      question: "What if the artist you suggest isn't a good fit?",
      answer: "If the first match isn't a good fit, you are under no obligation to proceed with them! You can let us know, and we'll be happy to see if there is another suitable artist in our directory."
    },
    {
      question: "How long does it take to get a response after submitting a request?",
      answer: "We aim to review your request and get back to you with potential matches or a status update within 24 to 48 hours."
    },
    {
      question: "I am an artist. How can I join the directory?",
      answer: "You can apply using the 'For Artists' -> 'Join Directory' page. Please have your portfolio links and details ready. We manually review all applications before approval."
    },
    {
      question: "Do artists have to be located in Kolkata?",
      answer: "Currently, our network is open to artists everywhere. Let us know where you are based and we'll review your application."
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl min-h-screen">
      <div className="mb-14 md:mb-20 px-4">
        <h1 className="text-4xl font-bold font-serif tracking-tight text-ink sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-4 text-lg text-ink-light max-w-2xl">
          Everything you need to know about how ShareNGrow works.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card 
            key={index} 
            className="border-whisper bg-white rounded-2xl shadow-none overflow-hidden cursor-pointer transition-all hover:border-ink/20"
            onClick={() => toggleAccordion(index)}
          >
            <div className="p-6 md:p-8 flex justify-between items-center bg-white">
              <h3 className="font-semibold text-lg text-ink pr-8">{faq.question}</h3>
              <div className="text-ink-light shrink-0">
                {openIndex === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>
            
            {openIndex === index && (
              <CardContent className="px-6 md:px-8 pb-6 md:pb-8 pt-0 bg-white">
                 <p className="text-ink-light leading-relaxed text-base">{faq.answer}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-16 bg-paper p-8 rounded-2xl border border-whisper flex flex-col items-start text-left">
        <h2 className="text-2xl font-bold text-ink mb-3 font-serif tracking-tight">Still have questions?</h2>
        <p className="text-ink-light mb-6">
          If you couldn't find the answer to your question, feel free to contact us or submit an inquiry, and our team will get back to you.
        </p>
      </div>
    </div>
  );
}
