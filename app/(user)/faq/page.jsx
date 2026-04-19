import React from 'react';
import { HelpCircle, ChevronRight, MessageSquare } from 'lucide-react';

export const metadata = {
  title: "FAQ | Equal Fashion",
  description: "Frequently Asked Questions about ordering, delivery, and payments at Equal Fashion.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "আমি কিভাবে অর্ডার করবো?",
      a: "আপনার পছন্দের পণ্য নির্বাচন করে “Add to Cart” এ ক্লিক করুন এবং Checkout সম্পন্ন করুন।"
    },
    {
      q: "ডেলিভারি কত দিনে পাবো?",
      a: "ঢাকার মধ্যে ১–৩ দিন এবং ঢাকার বাইরে ২–৫ দিনের মধ্যে ডেলিভারি করা হয়।"
    },
    {
      q: "পেমেন্ট অপশন কি কি আছে?",
      a: "Cash on Delivery, bKash এবং Nagad এর মাধ্যমে পেমেন্ট করা যাবে।"
    },
    {
      q: "পণ্য রিটার্ন করা যাবে কি?",
      a: "হ্যাঁ, পণ্য পাওয়ার ৩ দিনের মধ্যে জানালে রিটার্ন বা এক্সচেঞ্জ করা যাবে।"
    },
    {
      q: "ডেলিভারি চার্জ কত?",
      a: "লোকেশনে অনুযায়ী চার্জ নির্ধারণ করা হয় এবং checkout-এ দেখানো হবে।"
    },
    {
      q: "আমি কি হোলসেল অর্ডার করতে পারবো?",
      a: "হ্যাঁ, আমরা হোলসেল অর্ডারও গ্রহণ করি। বিস্তারিত জানতে আমাদের সাথে যোগাযোগ করুন।"
    }
  ];

  return (
    <div className="bg-[#f8f9fa] dark:bg-gray-950 min-h-screen py-20 pb-32">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-custom/10 rounded-full mb-6 text-primary-custom">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">সাধারণ জিজ্ঞাসাসমূহ</h1>
          <p className="text-gray-500 dark:text-gray-400">আপনার মনে থাকা সাধারণ প্রশ্নগুলোর উত্তর এখানে পাবেন।</p>
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="group bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-primary-custom/20 hover:shadow-xl hover:shadow-primary-custom/5 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-primary-custom/10 flex items-center justify-center shrink-0 group-hover:bg-primary-custom group-hover:text-white transition-colors duration-300">
                  <span className="font-bold">?</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Call-to-Action */}
        <div className="mt-20 p-8 md:p-12 bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl mb-6">
            <MessageSquare className="text-gray-400" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">আরো কোনো প্রশ্ন আছে?</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
            আপনার যদি অন্য কোনো বিষয়ে জানার থাকে, তবে সরাসরি আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 py-4 px-10 bg-gray-900 dark:bg-gray-800 text-white font-bold rounded-2xl hover:bg-primary-custom transition-all active:scale-95 translate-y-0 hover:-translate-y-1 shadow-lg"
          >
            যোগাযোগ করুন <ChevronRight size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
