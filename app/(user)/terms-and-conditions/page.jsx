import React from 'react';
import { ShoppingBag, CreditCard, Truck, RotateCcw, Tag, UserX } from 'lucide-react';

export const metadata = {
  title: "Terms & Conditions | Equal Fashion",
  description: "Read our terms and conditions for using the Equal Fashion website and services.",
};

export default function TermsConditionsPage() {
  const terms = [
    {
      icon: <ShoppingBag className="text-secondary-custom" />,
      title: "১. অর্ডার সংক্রান্ত",
      items: [
        "অর্ডার কনফার্ম হওয়ার পর তা প্রসেস করা হবে",
        "ভুল বা অসম্পূর্ণ তথ্য দিলে অর্ডার বাতিল হতে পারে",
        "সন্দেহজনক অর্ডার আমরা বাতিল করার অধিকার রাখি"
      ]
    },
    {
      icon: <CreditCard className="text-secondary-custom" />,
      title: "২. পেমেন্ট",
      items: [
        "Cash on Delivery (COD) সুবিধা রয়েছে",
        "bKash, Nagad সহ অন্যান্য অনলাইন পেমেন্ট গ্রহণযোগ্য",
        "অগ্রিম পেমেন্টের ক্ষেত্রে রিফান্ড নীতিমালা প্রযোজ্য"
      ]
    },
    {
      icon: <Truck className="text-secondary-custom" />,
      title: "৩. ডেলিভারি",
      items: [
        "ঢাকা শহরের মধ্যে: ১–৩ কার্যদিবস",
        "ঢাকা শহরের বাইরে: ২–৫ কার্যদিবস",
        "প্রাকৃতিক দুর্যোগ বা বিশেষ পরিস্থিতিতে দেরি হতে পারে"
      ]
    },
    {
      icon: <RotateCcw className="text-secondary-custom" />,
      title: "৪. রিটার্ন ও এক্সচেঞ্জ",
      items: [
        "পণ্য গ্রহণের ৩ দিনের মধ্যে অভিযোগ জানাতে হবে এবং ৭ দিনের মধ্যে রিটার্ন করতে হবে",
        "পণ্য অবশ্যই অব্যবহৃত এবং মূল অবস্থায় থাকতে হবে",
        "ডেলিভারি চার্জ রিফান্ডযোগ্য নয় (কিছু ক্ষেত্রে প্রযোজ্য)"
      ]
    },
    {
      icon: <Tag className="text-secondary-custom" />,
      title: "৫. মূল্য এবং অফার",
      items: [
        "পণ্যের মূল্য পূর্ব নোটিশ ছাড়াই পরিবর্তন হতে পারে",
        "অফার সীমিত সময়ের জন্য প্রযোজ্য"
      ]
    },
    {
      icon: <UserX className="text-secondary-custom" />,
      title: "৬. ব্যবহার নীতিমালা",
      items: [
        "ওয়েবসাইটের কোনো কনটেন্ট অনুমতি ছাড়া কপি করা যাবে না",
        "অবৈদ কার্যকলাপের জন্য ওয়েবসাইট ব্যবহার নিষিদ্ধ"
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Title Header */}
      <div className="pt-20 pb-12 text-center container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
          Terms & <span className="text-secondary-custom">Conditions</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg italic">
          এই ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি নিম্নলিখিত শর্তাবলীতে সম্মত হচ্ছেন:
        </p>
        <div className="w-24 h-1.5 bg-secondary-custom mx-auto mt-8 rounded-full" />
      </div>

      {/* Terms Grid */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {terms.map((term, index) => (
            <div key={index} className="p-8 rounded-[2rem] bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-secondary-custom/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                {term.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 underline decoration-secondary-custom/20 underline-offset-8">
                {term.title}
              </h2>
              <ul className="space-y-4">
                {term.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                    <span className="text-secondary-custom font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-gray-900 dark:bg-gray-800 rounded-[3rem] text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">গুরুত্বপূর্ণ নোট</h3>
            <p className="opacity-80 max-w-2xl mx-auto text-lg">
              আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার রাখি। ধন্যবাদ।
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-custom/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        </div>
      </section>
    </div>
  );
}
