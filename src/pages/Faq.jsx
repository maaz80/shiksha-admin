import { useEffect, useMemo, useRef, useState } from 'react';
import { HiChevronDown, HiOutlineTrash, HiOutlinePlus, HiOutlineQuestionMarkCircle, HiOutlineSave } from "react-icons/hi";
import Breadcrumb from '../components/BreadCrumb';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const PAGES = [
     { title: 'Home', slug: 'home' },
     { title: 'Contact Us', slug: 'contact-us' },
     { title: 'Privacy Policy', slug: 'privacy-policy' },
     { title: 'Disclaimer', slug: 'disclaimer' },
     { title: 'Blogs', slug: 'blogs' },
     { title: 'Blog Details', slug: 'blog-details' },
     { title: 'Course Details', slug: 'course-details' },
     { title: 'Courses', slug: 'courses' },
     { title: 'About Us', slug: 'about-us' },
];

const defaultFaq = {
     title: 'FAQ',
     faq: [],
};

const emptyFaq = {
     ques: '',
     ans: '',
};

function FaqItem({ item, index, onChange, onDelete }) {
     const [open, setOpen] = useState(true);

     return (
          <div className="border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-200">
               {/* Header */}
               <div
                    onClick={() => setOpen(!open)}
                    className="flex items-start justify-between gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50/50 transition-all"
               >
                    {/* Left */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                         <div className="min-w-8 w-8 h-8 rounded-full bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center text-xs font-bold shrink-0">
                              {index + 1}
                         </div>

                         <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 break-words whitespace-pre-wrap">
                                   {item.ques || 'Untitled FAQ'}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                   FAQ Item
                              </p>
                         </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2 shrink-0">
                         <button
                              onClick={(e) => {
                                   e.stopPropagation();
                                   onDelete(index);
                              }}
                              className="w-8 h-8 rounded-lg border border-transparent text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center cursor-pointer"
                         >
                              <HiOutlineTrash className="w-4 h-4" />
                         </button>

                         <div className={`transition-transform duration-300 text-gray-400 shrink-0 ${open ? 'rotate-180' : ''}`}>
                              <HiChevronDown className="w-5 h-5" />
                         </div>
                    </div>
               </div>

               {/* Body */}
               {open && (
                    <div className="px-5 pb-5 border-t border-gray-100 pt-5 space-y-4 bg-gray-50/20">
                         {/* Question */}
                         <div className="space-y-1.5">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                                   Question
                              </label>
                              <textarea
                                   rows={2}
                                   value={item.ques}
                                   onChange={(e) => onChange(index, 'ques', e.target.value)}
                                   placeholder="Enter FAQ question..."
                                   className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none resize-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 font-sans"
                              />
                         </div>

                         {/* Answer */}
                         <div className="space-y-1.5">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                                   Answer
                              </label>
                              <textarea
                                   rows={4}
                                   value={item.ans}
                                   onChange={(e) => onChange(index, 'ans', e.target.value)}
                                   placeholder="Enter FAQ answer..."
                                   className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none resize-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 font-sans"
                              />
                         </div>
                    </div>
               )}
          </div>
     );
}

export default function FaqManager() {
     const dropdownRef = useRef(null);
     const [openDropdown, setOpenDropdown] = useState(false);
     const [selectedPage, setSelectedPage] = useState(PAGES[0]);
     const [loading, setLoading] = useState(false);
     const [saving, setSaving] = useState(false);
     const [formData, setFormData] = useState(defaultFaq);
     const [toast, setToast] = useState({ show: false, message: "" });

     const displayToast = (message) => {
          setToast({ show: true, message });
          setTimeout(() => setToast({ show: false, message: "" }), 3000);
     };

     // Close Dropdown on outside click
     useEffect(() => {
          const handleClick = (e) => {
               if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                    setOpenDropdown(false);
               }
          };
          document.addEventListener('mousedown', handleClick);
          return () => {
               document.removeEventListener('mousedown', handleClick);
          };
     }, []);

     // Fetch FAQ
     useEffect(() => {
          if (selectedPage?.slug) {
               fetchFaqData(selectedPage.slug);
          }
     }, [selectedPage]);

     const fetchFaqData = async (slug) => {
          try {
               setLoading(true);
               const response = await fetch(`${API_URL}/pages/${slug}/faq`);
               const data = await response.json();
               setFormData({
                    title: data?.title || 'FAQ',
                    faq: data?.faq || [],
               });
          } catch (error) {
               console.error(error);
               setFormData(defaultFaq);
          } finally {
               setLoading(false);
          }
     };

     const handleFaqChange = (index, field, value) => {
          setFormData((prev) => {
               const updatedFaq = [...prev.faq];
               updatedFaq[index] = {
                    ...updatedFaq[index],
                    [field]: value,
               };
               return {
                    ...prev,
                    faq: updatedFaq,
               };
          });
     };

     const handleAddFaq = () => {
          setFormData((prev) => ({
               ...prev,
               faq: [...prev.faq, emptyFaq],
          }));
     };

     const handleDeleteFaq = (index) => {
          setFormData((prev) => ({
               ...prev,
               faq: prev.faq.filter((_, i) => i !== index),
          }));
     };

     const handleSave = async () => {
          try {
               setSaving(true);
               const response = await fetch(
                    `${API_URL}/pages/${selectedPage.slug}/faq`,
                    {
                         method: 'PUT',
                         headers: {
                              'Content-Type': 'application/json',
                         },
                         body: JSON.stringify(formData),
                    }
               );

               const data = await response.json();

               if (response.ok) {
                    displayToast("FAQ Saved Successfully");
               } else {
                    displayToast(data?.error || 'Something went wrong');
               }
          } catch (error) {
               console.error(error);
               displayToast("Server Error");
          } finally {
               setSaving(false);
          }
     };

     const totalFaqs = useMemo(() => formData?.faq?.length || 0, [formData]);

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
               <Breadcrumb />

               <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
                         <div>
                              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                   FAQ Manager
                              </h1>
                              <p className="text-sm text-gray-500 mt-1">
                                   Manage page wise FAQ content and questions.
                              </p>
                         </div>

                         <button
                              onClick={handleSave}
                              disabled={saving}
                              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed shrink-0"
                         >
                              <HiOutlineSave className="w-4 h-4" />
                              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                         </button>
                    </div>

                    {/* Page Selector Dropdown */}
                    <div ref={dropdownRef} className="relative mb-6">
                         <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                              Configure Page
                         </label>
                         <button
                              onClick={() => setOpenDropdown(!openDropdown)}
                              className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 py-3 flex items-center justify-between gap-4 text-left shadow-sm cursor-pointer hover:bg-gray-50/50 transition-all"
                         >
                              <div className="flex items-center gap-2">
                                   <span className="text-sm font-semibold text-gray-800">
                                        {selectedPage.title}
                                   </span>
                                   <span className="text-xs text-gray-400 font-mono">
                                        ({selectedPage.slug})
                                   </span>
                              </div>
                              <HiChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openDropdown ? 'rotate-180' : ''}`} />
                         </button>

                         {openDropdown && (
                              <div className="absolute top-[105%] left-0 w-full rounded-xl border border-gray-200 bg-white z-50 shadow-xl overflow-hidden max-h-72 overflow-y-auto">
                                   {PAGES.map((page) => {
                                        const active = page.slug === selectedPage.slug;
                                        return (
                                             <button
                                                  key={page.slug}
                                                  onClick={() => {
                                                       setSelectedPage(page);
                                                       setOpenDropdown(false);
                                                  }}
                                                  className={`w-full px-4 py-3.5 flex items-center justify-between gap-4 text-left border-b border-gray-100 last:border-none hover:bg-gray-50 transition-colors cursor-pointer ${
                                                       active ? 'bg-orange-50/50' : ''
                                                  }`}
                                             >
                                                  <div>
                                                       <p className={`text-sm font-semibold ${active ? 'text-orange-600' : 'text-gray-800'}`}>
                                                            {page.title}
                                                       </p>
                                                       <p className="text-xs text-gray-400 font-mono mt-0.5">
                                                            {page.slug}
                                                       </p>
                                                  </div>
                                                  {active && (
                                                       <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                  )}
                                             </button>
                                        );
                                   })}
                              </div>
                         )}
                    </div>

                    {/* Main Content Area */}
                    {loading ? (
                         <div className="h-64 rounded-2xl border border-gray-200 bg-white flex flex-col items-center justify-center text-gray-400 shadow-sm">
                              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                              <span className="text-sm font-medium">Loading FAQ Data...</span>
                         </div>
                    ) : (
                         <div className="space-y-6">
                              {/* FAQ Section Title settings card */}
                              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                                   <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">FAQ Header Configuration</h2>
                                   <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">FAQ Section Title</label>
                                        <input
                                             type="text"
                                             value={formData.title || ""}
                                             onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                             placeholder="e.g. FAQ"
                                             className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 font-sans"
                                        />
                                   </div>
                              </div>

                              {/* FAQ list card */}
                              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-6">
                                   <div className="flex items-center justify-between gap-4">
                                        <div>
                                             <div className="flex items-center gap-2.5">
                                                  <h2 className="text-base font-bold text-gray-900">
                                                       FAQ Questions
                                                  </h2>
                                                  <span className="px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-semibold">
                                                       {totalFaqs} Questions
                                                  </span>
                                             </div>
                                             <p className="text-xs text-gray-400 mt-1">
                                                  Add, modify or delete frequently asked questions for this page.
                                             </p>
                                        </div>

                                        <button
                                             onClick={handleAddFaq}
                                             className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 hover:text-orange-700 text-xs font-bold px-4 py-2 rounded-xl border border-orange-100 transition-all cursor-pointer"
                                        >
                                             <HiOutlinePlus className="w-4 h-4" />
                                             <span>Add FAQ</span>
                                        </button>
                                   </div>

                                   {formData?.faq?.length > 0 ? (
                                        <div className="space-y-4">
                                             {formData.faq.map((item, index) => (
                                                  <FaqItem
                                                       key={index}
                                                       item={item}
                                                       index={index}
                                                       onChange={handleFaqChange}
                                                       onDelete={handleDeleteFaq}
                                                  />
                                             ))}
                                        </div>
                                   ) : (
                                        <div className="py-16 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center px-5 bg-gray-50/40">
                                             <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 text-lg mb-4 shadow-sm">
                                                  <HiOutlineQuestionMarkCircle className="w-6 h-6" />
                                             </div>

                                             <h3 className="text-gray-900 font-bold text-sm">
                                                  No FAQ Added Yet
                                             </h3>
                                             <p className="text-xs text-gray-400 mt-1 max-w-xs leading-normal">
                                                  Start by adding questions using the "Add FAQ" button.
                                             </p>
                                        </div>
                                   )}
                              </div>
                         </div>
                    )}

                    {/* Toast Notification */}
                    <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 bg-gray-900 border border-gray-800 text-white px-5 py-3.5 rounded-xl shadow-2xl transform transition-all duration-300 z-50 ${toast.show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
                         <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                         <span className="font-semibold text-xs">{toast.message}</span>
                    </div>
               </div>
          </div>
     );
}