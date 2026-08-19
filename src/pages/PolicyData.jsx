import { useEffect, useState } from "react";
import { HiOutlineSave } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import Editor from "../components/Editor";
import { getAdminToken } from "../utils/auth.js";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function PolicyData() {
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [activeTab, setActiveTab] = useState("privacy");

     // Privacy Policy State
     const [privacyTitle, setPrivacyTitle] = useState("");
     const [privacyContent, setPrivacyContent] = useState("");

     // Disclaimer State
     const [disclaimerTitle, setDisclaimerTitle] = useState("");
     const [disclaimerContent, setDisclaimerContent] = useState("");

     // Terms & Conditions (Enrolment) State
     const [termsEnrolmentTitle, setTermsEnrolmentTitle] = useState("");
     const [termsEnrolmentContent, setTermsEnrolmentContent] = useState("");

     const fetchPolicyData = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API_URL}/policy-data`);
               if (res.ok) {
                    const data = await res.json();
                    setPrivacyTitle(data.privacyPolicy?.title || "Privacy Policy");
                    setPrivacyContent(data.privacyPolicy?.content || "");
                    setDisclaimerTitle(data.disclaimer?.title || "Disclaimer");
                    setDisclaimerContent(data.disclaimer?.content || "");
                    setTermsEnrolmentTitle(data.termsAndConditionsEnrolment?.title || "Terms & Conditions - Enrolment");
                    setTermsEnrolmentContent(data.termsAndConditionsEnrolment?.content || "");
               }
          } catch (err) {
               console.error("Error fetching policy data:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchPolicyData();
     }, []);

     const handleSaveAll = async () => {
          try {
               setSaving(true);
               const payload = {
                    privacyPolicy: {
                         title: privacyTitle,
                         content: privacyContent
                    },
                    disclaimer: {
                         title: disclaimerTitle,
                         content: disclaimerContent
                    },
                    termsAndConditionsEnrolment: {
                         title: termsEnrolmentTitle,
                         content: termsEnrolmentContent
                    }
               };

               const res = await fetch(`${API_URL}/policy-data`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json",
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: JSON.stringify(payload)
               });

               if (res.ok) {
                    alert("Policies & Terms saved successfully!");
                    fetchPolicyData();
               } else {
                    alert("Failed to save data.");
               }
          } catch (err) {
               console.error("Error saving policy data:", err);
               alert("An error occurred while saving.");
          } finally {
               setSaving(false);
          }
     };

     const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all";
     const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider";
     const tabBtnClass = (tab) => `px-5 py-3 font-semibold text-sm rounded-lg transition-all ${activeTab === tab ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

     if (loading) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500 font-medium">Loading Policy Data...</p>
               </div>
          );
     }

     return (
          <div className="bg-gray-50/50 min-h-screen pb-12 font-sans">
               <Breadcrumb />
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-6 lg:px-10 max-w-7xl mx-auto">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Legal & Policy Settings</h1>
                         <p className="text-sm text-gray-500 mt-1">Manage content of site policies and terms</p>
                    </div>
                    <button
                         onClick={handleSaveAll}
                         disabled={saving}
                         className="bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shrink-0"
                    >
                         <HiOutlineSave className="text-lg" />
                         {saving ? "Saving Changes..." : "Save Changes"}
                    </button>
               </div>

               {/* Tab Navigation */}
               <div className="flex flex-wrap gap-2 px-6 lg:px-10 max-w-7xl mx-auto mb-8">
                    <button onClick={() => setActiveTab("privacy")} className={tabBtnClass("privacy")}>Privacy Policy</button>
                    <button onClick={() => setActiveTab("disclaimer")} className={tabBtnClass("disclaimer")}>Disclaimer</button>
                    <button onClick={() => setActiveTab("termsEnrolment")} className={tabBtnClass("termsEnrolment")}>Terms & Conditions (Enrolment)</button>
               </div>

               <div className="px-6 lg:px-10 max-w-7xl mx-auto">
                    {activeTab === "privacy" && (
                         <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-6">
                              <div>
                                   <label className={labelClass}>Privacy Policy Page Title</label>
                                   <input
                                        type="text"
                                        value={privacyTitle}
                                        onChange={(e) => setPrivacyTitle(e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Privacy Policy"
                                   />
                              </div>
                              <div>
                                   <label className={labelClass}>Privacy Policy Content</label>
                                   <div className="border border-gray-250 rounded-xl overflow-hidden mt-1">
                                        <Editor value={privacyContent} onChange={setPrivacyContent} />
                                   </div>
                              </div>
                         </div>
                    )}

                    {activeTab === "disclaimer" && (
                         <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-6">
                              <div>
                                   <label className={labelClass}>Disclaimer Page Title</label>
                                   <input
                                        type="text"
                                        value={disclaimerTitle}
                                        onChange={(e) => setDisclaimerTitle(e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Disclaimer"
                                   />
                              </div>
                              <div>
                                   <label className={labelClass}>Disclaimer Content</label>
                                   <div className="border border-gray-250 rounded-xl overflow-hidden mt-1">
                                        <Editor value={disclaimerContent} onChange={setDisclaimerContent} />
                                   </div>
                              </div>
                         </div>
                    )}

                    {activeTab === "termsEnrolment" && (
                         <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-6">
                              <div>
                                   <label className={labelClass}>Terms & Conditions (Enrolment) Page Title</label>
                                   <input
                                        type="text"
                                        value={termsEnrolmentTitle}
                                        onChange={(e) => setTermsEnrolmentTitle(e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Terms & Conditions - Enrolment"
                                   />
                              </div>
                              <div>
                                   <label className={labelClass}>Terms & Conditions (Enrolment) Content</label>
                                   <div className="border border-gray-250 rounded-xl overflow-hidden mt-1">
                                        <Editor value={termsEnrolmentContent} onChange={setTermsEnrolmentContent} />
                                   </div>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
}
