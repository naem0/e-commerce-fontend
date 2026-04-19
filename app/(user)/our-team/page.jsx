import React from 'react';
import { Mail, Phone, Users, Briefcase, Zap, Heart } from 'lucide-react';

export const metadata = {
  title: "Our Team | Equal Fashion",
  description: "Meet the dedicated, hardworking, and committed team behind Equal Fashion.",
};

export default function TeamPage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
            Meet <span className="text-primary-custom">Our Team</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Equal Fashion-এর সাফল্যের পেছনে রয়েছে একটি দক্ষ, পরিশ্রমী এবং প্রতিশ্রুতিবদ্ধ টিম। আমরা সবাই একসাথে কাজ করি আপনার জন্য সেরা শপিং অভিজ্ঞতা নিশ্চিত করতে।
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl shadow-primary-custom/5 border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row p-8 md:p-12 items-center gap-12">
            <div className="md:w-1/2">
              <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                   <span className="text-lg">Image Placeholder</span>
                </div>
                {/* Image tag will go here when available */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900/60 to-transparent p-6 text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    মোঃ মোস্তাফিজুর রহমান
                </div>
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <div className="inline-block py-2 px-6 bg-primary-custom/10 text-primary-custom font-bold rounded-full text-sm uppercase tracking-widest">
                Founder & CEO
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">মোঃ মোস্তাফিজুর রহমান </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed italic">
                প্রতিষ্ঠাতা হিসেবে তিনি ব্যবসার সার্বিক পরিকল্পনা, উন্নয়ন এবং ভবিষ্যৎ দিকনির্দেশনা নির্ধারণ করেন।
              </p>
              
              <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-primary-custom/5 rounded-full flex items-center justify-center group-hover:bg-primary-custom group-hover:text-white transition-all">
                    <Phone size={18} />
                  </div>
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">০১৯৫০৮৫৭২৫৭</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-primary-custom/5 rounded-full flex items-center justify-center group-hover:bg-primary-custom group-hover:text-white transition-all">
                    <Mail size={18} />
                  </div>
                  <span className="text-lg font-medium text-gray-700 dark:text-gray-300">mrkmostafizurrahman1@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ops Team */}
            <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-8 group-hover:rotate-6 transition-transform">
                <Briefcase size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Operations Team</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                এই টিম অর্ডার প্রসেসিং, প্যাকেজিং এবং ডেলিভারি কার্যক্রম পরিচালনা করে, যাতে প্রতিটি অর্ডার দ্রুত এবং সঠিকভাবে আপনার কাছে পৌঁছায়।
              </p>
            </div>

            {/* Support Team */}
            <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-8 group-hover:rotate-6 transition-transform">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Customer Support</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                আমাদের সাপোর্ট টিম সবসময় প্রস্তুত আপনার যেকোনো প্রশ্ন, সমস্যা বা অভিযোগ দ্রুত সমাধান করার জন্য।
              </p>
            </div>

            {/* Marketing Team */}
            <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-8 group-hover:rotate-6 transition-transform">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Marketing Team</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                এই টিম নতুন অফার, ক্যাম্পেইন এবং প্রোমোশন পরিচালনা করে, যাতে আপনি সবসময় সেরা ডিল পেতে পারেন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Footer */}
      <section className="py-24 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto py-12 px-8 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem]">
          <Heart className="mx-auto text-primary-custom mb-6" size={48} fill="currentColor" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">আমাদের টিমের মূল লক্ষ্য একটাই</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 italic">
            "গ্রাহকের সন্তুষ্টি নিশ্চিত করা এবং একটি দীর্ঘমেয়াদী সম্পর্ক গড়ে তোলা। আপনাদের আস্থা আমাদের শক্তি।"
          </p>
        </div>
      </section>
    </div>
  );
}
