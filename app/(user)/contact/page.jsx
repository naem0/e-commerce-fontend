import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook } from 'lucide-react';

export const metadata = {
  title: "Contact Us | Equal Fashion",
  description: "Get in touch with Equal Fashion. We are here to help you with your questions and feedback.",
};

export default function ContactPage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Header Section */}
      <section className="bg-primary-custom py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">আমাদের সাথে যোগাযোগ করুন</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            আপনার যেকোনো প্রশ্ন, মতামত বা সহযোগিতার জন্য আমরা সবসময় প্রস্তুত।
          </p>
        </div>
      </section>

      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">যোগাযোগের তথ্য</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-custom/10 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="text-primary-custom" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">অফিস ঠিকানা</h4>
                      <p className="text-gray-600 dark:text-gray-400">ঢাকা, বাংলাদেশ</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-custom/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Phone className="text-primary-custom" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">ফোন নাম্বার</h4>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">09658-405962</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-custom/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Mail className="text-primary-custom" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">ইমেইল</h4>
                      <p className="text-gray-600 dark:text-gray-400">info.equalfashionltd@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-custom/10 rounded-2xl flex items-center justify-center shrink-0">
                      <Clock className="text-primary-custom" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">কাজের সময়</h4>
                      <p className="text-gray-600 dark:text-gray-400">প্রতিদিন সকাল ১০টা থেকে রাত ১০টা পর্যন্ত</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Channels */}
              <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">অনলাইন সাপোর্ট</h3>
                <div className="grid grid-cols-1 gap-4">
                  <a href="https://wa.me/01410558889" target="_blank" className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <MessageCircle size={20} />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">WhatsApp: 01410558889</span>
                  </a>
                  <a href="https://m.me/equalfashion.bd" target="_blank" className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      <Facebook size={20} />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Facebook Messenger</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form / Inquiry Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 h-full">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">আমাদের মেসেজ পাঠান</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl">
                  আপনি যদি অর্ডার সংক্রান্ত কোনো সমস্যা, ডেলিভারি আপডেট, পণ্য সম্পর্কে জানতে চান অথবা ব্যবসায়িক সহযোগিতা করতে চান—তাহলে নির্দ্বিধায় আমাদের সাথে যোগাযোগ করুন।
                </p>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">আপনার নাম</label>
                      <input 
                        type="text" 
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary-color focus:border-transparent outline-none transition-all"
                        placeholder="আপনার নাম লিখুন"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">ফোন নম্বর</label>
                      <input 
                        type="text" 
                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary-color focus:border-transparent outline-none transition-all"
                        placeholder="আপনার ফোন নম্বর"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">বিষয়</label>
                    <input 
                      type="text" 
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary-color focus:border-transparent outline-none transition-all"
                      placeholder="মেসেজের বিষয়"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">আপনার মেসেজ</label>
                    <textarea 
                      rows="5"
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-primary-color focus:border-transparent outline-none transition-all resize-none"
                      placeholder="বিস্তারিত এখানে লিখুন..."
                    ></textarea>
                  </div>
                  <button className="w-full py-5 bg-primary-color text-white font-bold rounded-2xl hover:bg-primary-color/90 transform hover:scale-[1.01] transition-all shadow-lg active:scale-95">
                    মেসেজ পাঠান
                  </button>
                </form>
                
                <div className="mt-12 p-6 bg-primary-color/5 rounded-2xl border border-primary-color/10">
                  <p className="text-gray-700 dark:text-gray-300 text-center italic">
                    "আমাদের কাস্টমার সাপোর্ট টিম সর্বোচ্চ দ্রুততার সাথে আপনার সমস্যার সমাধান করার চেষ্টা করবে। আপনাদের মতামত আমাদের সমৃদ্ধি।"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
