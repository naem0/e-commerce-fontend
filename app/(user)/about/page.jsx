import React from 'react';

export const metadata = {
  title: "About Us | Equal Fashion",
  description: "Equal Fashion is a modern, trusted and fast-growing online shopping platform in Bangladesh.",
};

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              About <span className="text-primary-custom">Equal Fashion</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Equal Fashion একটি আধুনিক, বিশ্বস্ত এবং দ্রুত বর্ধনশীল অনলাইন শপিং প্ল্যাটফর্ম, যেখানে আপনি ফ্যাশন, ফুটওয়্যার, মোবাইল ও ল্যাপটপ অ্যাক্সেসরিজ, গ্যাজেট, কসমেটিকস এবং দৈনন্দিন প্রয়োজনীয় পণ্য এক জায়গায় সহজেই পেয়ে যাবেন।
            </p>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary-custom rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary-custom rounded-full blur-3xl opacity-50" />
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-16 bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-custom/10 rounded-2xl -z-10" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">আমাদের যাত্রা ও লক্ষ্য</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  <p>
                    আমাদের যাত্রা শুরু হয়েছে একটি লক্ষ্য নিয়ে—বাংলাদেশের প্রতিটি মানুষের কাছে সাশ্রয়ী মূল্যে মানসম্মত এবং ট্রেন্ডি পণ্য পৌঁছে দেওয়া। আমরা বিশ্বাস করি, ফ্যাশন এবং প্রয়োজনীয় জিনিসপত্র শুধু কিছু মানুষের জন্য নয়, বরং সবার জন্য হওয়া উচিত।
                  </p>
                  <div className="bg-primary-custom/5 border-l-4 border-primary-custom p-4 my-6 italic">
                    <p className="font-semibold text-primary-custom text-xl">“Style for Everyone”</p>
                  </div>
                  <p>
                    Equal Fashion শুধু একটি অনলাইন শপ না—এটি একটি সম্পূর্ণ শপিং অভিজ্ঞতা। আমরা রিটেইল এবং হোলসেল—দুই ধরনের কাস্টমারের জন্যই কাজ করি, যাতে ব্যক্তিগত ব্যবহারকারী থেকে শুরু করে ব্যবসায়ীরাও আমাদের থেকে উপকৃত হতে পারেন।
                  </p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
                  <h3 className="font-bold text-primary-custom text-3xl mb-1">100%</h3>
                  <p className="text-gray-500 text-sm">Quality Assured</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
                  <h3 className="font-bold text-primary-custom text-3xl mb-1">Fast</h3>
                  <p className="text-gray-500 text-sm">Delivery Service</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
                  <h3 className="font-bold text-primary-custom text-3xl mb-1">24/7</h3>
                  <p className="text-gray-500 text-sm">Support Readiness</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
                  <h3 className="font-bold text-primary-custom text-3xl mb-1">Secure</h3>
                  <p className="text-gray-500 text-sm">Payment Process</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">আমাদের বিশেষত্ব</h2>
            <div className="w-20 h-1 bg-primary-custom mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: "✨", title: "উন্নত মানের পণ্য নির্বাচন", desc: "আমরা প্রতিটি পণ্যের মান নিশ্চিত করতে সর্বোচ্চ গুরুত্ব দিয়ে থাকি।" },
              { icon: "💰", title: "প্রতিযোগিতামূলক মূল্য", desc: "সাশ্রয়ী মূল্যে সেরা ট্রেন্ডি পণ্য পৌঁছে দেওয়াই আমাদের লক্ষ্য।" },
              { icon: "🚀", title: "নির্ভরযোগ্য ডেলিভারি", desc: "দ্রুত এবং নির্ভরযোগ্য ডেলিভারি সার্ভিস আমাদের অন্যতম প্রধান শক্তি।" },
              { icon: "🔒", title: "নিরাপদ অর্ডার প্রক্রিয়া", desc: "সহজ ও নিরাপদ অর্ডার প্রক্রিয়া গ্রাহকের স্বাচ্ছন্দ্য নিশ্চিত করে।" },
              { icon: "🤝", title: "কাস্টমার সাপোর্ট", desc: "আমরা গ্রাহকের সন্তুষ্টিকেই আমাদের প্রথম অগ্রাধিকার হিসেবে বিবেচনা করি।" },
              { icon: "❤️", title: "দীর্ঘমেয়াদী সম্পর্ক", desc: "গ্রাহকের আস্থা এবং সন্তুষ্টি আমাদের সাফল্যের মূল ভিত্তি।" }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call */}
      <section className="py-16 bg-primary-custom text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl mb-6 opacity-90">আপনাদের ভালোবাসা এবং সমর্থনই আমাদের এগিয়ে যাওয়ার অনুপ্রেরণা।</p>
          <h2 className="text-2xl md:text-3xl font-bold mb-8">ধন্যবাদ Equal Fashion-এর সাথে থাকার জন্য।</h2>
          <div className="flex justify-center flex-wrap gap-4">
            <div className="py-3 px-8 bg-white text-primary-custom font-bold rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
              Shop Now
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
