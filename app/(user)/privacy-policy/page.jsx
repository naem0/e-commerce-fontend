import React from 'react';
import { ShieldCheck, UserCheck, Lock, Eye, Link, RefreshCcw } from 'lucide-react';

export const metadata = {
  title: "Privacy Policy | Equal Fashion",
  description: "Read our privacy policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <UserCheck className="text-primary-custom" />,
      title: "১. তথ্য সংগ্রহ",
      content: "আপনি যখন আমাদের ওয়েবসাইটে অর্ডার করেন বা রেজিস্ট্রেশন করেন, তখন আমরা আপনার নাম, ফোন নম্বর, ঠিকানা, ইমেইল এবং প্রয়োজনীয় অন্যান্য তথ্য সংগ্রহ করতে পারি।"
    },
    {
      icon: <ShieldCheck className="text-primary-custom" />,
      title: "২. তথ্য ব্যবহারের উদ্দেশ্য",
      content: "আমরা আপনার তথ্য ব্যবহার করি—",
      list: [
        "অর্ডার প্রসেস এবং ডেলিভারি সম্পন্ন করতে",
        "কাস্টমার সাপোর্ট প্রদান করতে",
        "নতুন অফার, আপডেট এবং প্রোমোশন জানাতে",
        "আমাদের সার্ভিস উন্নত করতে"
      ]
    },
    {
      icon: <Lock className="text-primary-custom" />,
      title: "৩. তথ্য সুরক্ষা",
      content: "আমরা আধুনিক নিরাপত্তা ব্যবস্থা ব্যবহার করে আপনার তথ্য সুরক্ষিত রাখার চেষ্টা করি। আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করা হয় না, শুধুমাত্র ডেলিভারি এবং পেমেন্ট পার্টনারদের প্রয়োজন অনুযায়ী সীমিতভাবে ব্যবহার করা হয়।"
    },
    {
      icon: <Eye className="text-primary-custom" />,
      title: "৪. Cookies ব্যবহার",
      content: "আমাদের ওয়েবসাইট ব্যবহারকারীর অভিজ্ঞতা উন্নত করার জন্য cookies ব্যবহার করতে পারে, যা আপনার ব্রাউজিং অভ্যাস সংরক্ষণ করে।"
    },
    {
      icon: <Link className="text-primary-custom" />,
      title: "৫. তৃতীয় পক্ষের লিংক",
      content: "আমাদের ওয়েবসাইটে তৃতীয় পক্ষের লিংক থাকতে পারে, যেগুলোর Privacy Policy আমাদের নিয়ন্ত্রণে নেই।"
    },
    {
      icon: <RefreshCcw className="text-primary-custom" />,
      title: "৬. নীতিমালা পরিবর্তন",
      content: "আমরা যেকোনো সময় এই Privacy Policy আপডেট করার অধিকার রাখি। পরিবর্তন হলে তা ওয়েবসাইটে প্রকাশ করা হবে।"
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="bg-primary-custom p-12 text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="opacity-90 max-w-2xl mx-auto leading-relaxed">
              Equal Fashion আপনার ব্যক্তিগত তথ্যের গোপনীয়তা এবং নিরাপত্তাকে সর্বোচ্চ গুরুত্ব দিয়ে থাকে। এই Privacy Policy-তে বর্ণনা করা হয়েছে আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষা করি।
            </p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-16 space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-custom/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary-custom group-hover:text-white transition-all duration-300">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <div className="pl-16">
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
                    {section.content}
                  </p>
                  {section.list && (
                    <ul className="space-y-3">
                      {section.list.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                          <div className="w-2 h-2 bg-primary-custom rounded-full" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-16 pt-12 border-t border-gray-100 dark:border-gray-800 text-center">
              <p className="text-gray-500 dark:text-gray-500 italic mb-8">
                আমাদের ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি এই নীতিমালায় সম্মতি প্রদান করছেন।
              </p>
              <button className="px-10 py-4 bg-primary-custom text-white font-bold rounded-2xl hover:shadow-lg transition-all">
                I Understand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
