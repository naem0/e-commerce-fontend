import React from 'react';

export default function ReturnPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-10 text-center text-primary-custom">রিটার্ন ও এক্সচেঞ্জ নীতিমালা</h1>
      
      <div className="space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-primary-custom rounded-full"></span>
            সাধারণ নীতিমালা:
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 dark:text-gray-300">
            <li>পণ্য গ্রহণের ৩ (তিন) দিনের মধ্যে কোনো সমস্যা বা অভিযোগ জানাতে হবে (ড্যামেজ, ভুল পণ্য, সাইজ ইস্যু ইত্যাদি)</li>
            <li>পণ্য অবশ্যই ৭ (সাত) দিনের মধ্যে আমাদের নির্ধারিত ঠিকানায় রিটার্ন করতে হবে</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-primary-custom rounded-full"></span>
            পণ্য অবশ্যই:
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 dark:text-gray-300">
            <li>অব্যবহৃত থাকতে হবে</li>
            <li>মূল প্যাকেজিং, ট্যাগ, ইনভয়েসসহ ফেরত দিতে হবে</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-red-600">
            <span className="w-2 h-8 bg-red-600 rounded-full"></span>
            নিম্নোক্ত ক্ষেত্রে রিটার্ন গ্রহণযোগ্য নয়:
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 dark:text-gray-300">
            <li>ব্যবহৃত বা ক্ষতিগ্রস্ত পণ্য</li>
            <li>কাস্টমাইজড বা অর্ডারকৃত বিশেষ পণ্য</li>
            <li>পার্সোনাল আইটেম (যেমন: কসমেটিক্স, পারফিউম – খোলা হলে)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-primary-custom rounded-full"></span>
            চার্জ ও রিফান্ড:
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 dark:text-gray-300">
            <li>ডেলিভারি চার্জ এবং রিটার্ন চার্জ রিফান্ডযোগ্য নয়, তবে ভুল পণ্য বা কোম্পানির ত্রুটির ক্ষেত্রে প্রযোজ্য নয়</li>
            <li>রিফান্ড প্রসেস সম্পন্ন হতে ৫-১০ কার্যদিবস সময় লাগতে পারে</li>
          </ul>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary-custom">💰 ৫. মূল্য, পেমেন্ট এবং অফার:</h2>
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
            <p>• পণ্যের মূল্য যেকোনো সময় পূর্ব নোটিশ ছাড়াই পরিবর্তনযোগ্য</p>
            <p>• সকল মূল্য বাংলাদেশি টাকা (BDT) অনুযায়ী নির্ধারিত</p>
            <p className="font-bold mt-4">পেমেন্ট মেথড:</p>
            <p>• বিকাশ / নগদ / ব্যাংক ট্রান্সফার / ক্যাশ অন ডেলিভারি</p>
            <p>• কোনো অর্ডার কনফার্ম না হওয়া পর্যন্ত কোম্পানি বাতিল করার অধিকার রাখে</p>
            <p className="font-bold mt-4">অফার / ডিসকাউন্ট:</p>
            <p>• নির্দিষ্ট সময়ের জন্য প্রযোজ্য</p>
            <p>• স্টক শেষ হলে অফার বাতিল হতে পারে</p>
            <p>• একাধিক অফার একসাথে প্রযোজ্য নাও হতে পারে</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary-custom">🚚 ৬. ডেলিভারি ও শিপিং নীতিমালা:</h2>
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
            <p>• অর্ডার প্রসেসিং টাইম: ১-৩ কার্যদিবস</p>
            <p>• <strong>ডেলিভারি সময়:</strong></p>
            <p className="pl-6">ঢাকা: ১-৩ দিন</p>
            <p className="pl-6">ঢাকার বাইরে: ২-৫ দিন</p>
            <p>• প্রাকৃতিক দুর্যোগ, রাজনৈতিক পরিস্থিতি বা কুরিয়ার সমস্যার কারণে দেরি হতে পারে</p>
            <p>• গ্রাহকের দেওয়া ভুল ঠিকানার জন্য কোম্পানি দায়ী নয়</p>
            <p>• ডেলিভারির সময় পণ্য চেক করে নেওয়ার জন্য গ্রাহককে অনুরোধ করা হচ্ছে</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary-custom">🔐 ৭. ব্যবহার নীতিমালা (User Policy):</h2>
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
            <p>• ওয়েবসাইটে প্রদত্ত সকল কনটেন্ট (ছবি, টেক্সট, ডিজাইন) কপিরাইট সুরক্ষিত</p>
            <p>• অনুমতি ছাড়া কপি, রিপাবলিশ বা বাণিজ্যিক ব্যবহার সম্পূর্ণ নিষিদ্ধ</p>
            <p className="font-bold mt-4">ব্যবহারকারী কোনো ধরনের:</p>
            <p>• ভুয়া তথ্য প্রদান | প্রতারণামূলক অর্ডার | অবৈধ কার্যকলাপ</p>
            <p>• করলে অ্যাকাউন্ট স্থগিত বা ব্লক করা হতে পারে</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary-custom">👤 ৮. অ্যাকাউন্ট ও নিরাপত্তা:</h2>
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
            <p>• ব্যবহারকারী তার অ্যাকাউন্টের ইউজারনেম ও পাসওয়ার্ডের নিরাপত্তার জন্য নিজেই দায়ী</p>
            <p>• কোনো সন্দেহজনক কার্যকলাপ দেখা গেলে কর্তৃপক্ষ অ্যাকাউন্ট সাময়িকভাবে বন্ধ করতে পারে</p>
            <p>• একাধিক ফেক অ্যাকাউন্ট তৈরি করা নিষিদ্ধ</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary-custom">⚖️ ৯. দায়বদ্ধতা সীমাবদ্ধতা:</h2>
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
            <p>• কোম্পানি কোনো পরোক্ষ, আকস্মিক বা বিশেষ ক্ষতির জন্য দায়ী নয়</p>
            <p>• পণ্যের ব্যবহারের ফলে কোনো সমস্যা হলে তা প্রস্তুতকারকের দায়</p>
            <p>• ওয়েবসাইট সাময়িকভাবে বন্ধ বা ত্রুটিপূর্ণ হতে পারে, এর জন্য কোম্পানি দায়ী নয়</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-3xl font-bold mb-8 text-center text-primary-custom">📞 ১০. যোগাযোগ:</h2>
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 text-center">
            <p>যেকোনো সমস্যা বা অভিযোগের জন্য:</p>
            <p className="text-2xl font-bold text-primary-custom">Phone: 09658-405962</p>
            <p className="text-2xl font-bold text-green-600">WhatsApp: +8801410558889</p>
            <p className="mt-4">এর মাধ্যমে যোগাযোগ করতে হবে। নির্দিষ্ট সময়ের মধ্যে যোগাযোগ না করলে অভিযোগ গ্রহণযোগ্য নাও হতে পারে।</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
          <h2 className="text-xl font-bold mb-4">🔄 ১১. শর্তাবলী পরিবর্তন:</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Equal Fashion যেকোনো সময় এই শর্তাবলী পরিবর্তন, সংশোধন বা আপডেট করার পূর্ণ অধিকার রাখে। আপডেটেড শর্তাবলী ওয়েবসাইটে প্রকাশ হওয়ার সাথে সাথে কার্যকর হবে।
          </p>
        </div>
      </div>
    </div>
  );
}