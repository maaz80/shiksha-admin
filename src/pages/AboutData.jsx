import { useEffect, useState } from "react";
import { HiOutlineSave, HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function AboutData() {
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [activeTab, setActiveTab] = useState("hero");

     // Hero State
     const [heroStart, setHeroStart] = useState("");
     const [heroMid, setHeroMid] = useState("");
     const [heroEnd, setHeroEnd] = useState("");
     const [heroDesc, setHeroDesc] = useState("");

     // Array states
     const [shikshaDetails, setShikshaDetails] = useState([]);
     const [ourValues, setOurValues] = useState([]);

     // Form inputs for managing Shiksha Details
     const [detailTitle, setDetailTitle] = useState("");
     const [detailDesc, setDetailDesc] = useState("");
     const [editingDetailIndex, setEditingDetailIndex] = useState(null);

     // Form inputs for managing Our Values
     const [valueTitle, setValueTitle] = useState("");
     const [valueDesc, setValueDesc] = useState("");
     const [editingValueIndex, setEditingValueIndex] = useState(null);

     const fetchAboutData = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API_URL}/about-data`);
               if (res.ok) {
                    const data = await res.json();
                    setHeroStart(data.hero?.startTitle || "");
                    setHeroMid(data.hero?.midTitle || "");
                    setHeroEnd(data.hero?.endTitle || "");
                    setHeroDesc(data.hero?.description || "");
                    setShikshaDetails(data.shikshadetails || []);
                    setOurValues(data.ourvalues || []);
               }
          } catch (err) {
               console.error("Error fetching about data:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchAboutData();
     }, []);

     const handleSaveAll = async () => {
          try {
               setSaving(true);
               const payload = {
                    hero: {
                         startTitle: heroStart,
                         midTitle: heroMid,
                         endTitle: heroEnd,
                         description: heroDesc,
                    },
                    shikshadetails: shikshaDetails.map(item => ({ title: item.title, description: item.description })),
                    ourvalues: ourValues.map(item => ({ title: item.title, description: item.description }))
               };

               const res = await fetch(`${API_URL}/about-data`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
               });

               if (res.ok) {
                    alert("About Data saved successfully!");
                    fetchAboutData();
               } else {
                    alert("Failed to save About Data.");
               }
          } catch (err) {
               console.error("Error saving about data:", err);
               alert("An error occurred while saving.");
          } finally {
               setSaving(false);
          }
     };

     // Array helpers: Shiksha Details
     const handleAddOrEditDetail = (e) => {
          e.preventDefault();
          if (!detailTitle || !detailDesc) return;

          if (editingDetailIndex !== null) {
               const updated = [...shikshaDetails];
               updated[editingDetailIndex] = { title: detailTitle, description: detailDesc };
               setShikshaDetails(updated);
               setEditingDetailIndex(null);
          } else {
               setShikshaDetails([...shikshaDetails, { title: detailTitle, description: detailDesc }]);
          }
          setDetailTitle("");
          setDetailDesc("");
     };

     const handleEditDetail = (index) => {
          const item = shikshaDetails[index];
          setDetailTitle(item.title);
          setDetailDesc(item.description);
          setEditingDetailIndex(index);
     };

     const handleDeleteDetail = (index) => {
          setShikshaDetails(shikshaDetails.filter((_, i) => i !== index));
          if (editingDetailIndex === index) {
               setEditingDetailIndex(null);
               setDetailTitle("");
               setDetailDesc("");
          }
     };

     // Array helpers: Our Values
     const handleAddOrEditValue = (e) => {
          e.preventDefault();
          if (!valueTitle || !valueDesc) return;

          if (editingValueIndex !== null) {
               const updated = [...ourValues];
               updated[editingValueIndex] = { title: valueTitle, description: valueDesc };
               setOurValues(updated);
               setEditingValueIndex(null);
          } else {
               setOurValues([...ourValues, { title: valueTitle, description: valueDesc }]);
          }
          setValueTitle("");
          setValueDesc("");
     };

     const handleEditValue = (index) => {
          const item = ourValues[index];
          setValueTitle(item.title);
          setValueDesc(item.description);
          setEditingValueIndex(index);
     };

     const handleDeleteValue = (index) => {
          setOurValues(ourValues.filter((_, i) => i !== index));
          if (editingValueIndex === index) {
               setEditingValueIndex(null);
               setValueTitle("");
               setValueDesc("");
          }
     };

     const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all";
     const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider";
     const tabBtnClass = (tab) => `px-5 py-3 font-semibold text-sm rounded-lg transition-all ${activeTab === tab ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

     if (loading) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500 font-medium">Loading About Data...</p>
               </div>
          );
     }

     return (
          <div className="bg-gray-50 min-h-screen pb-12">
               <Breadcrumb />
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 px-10 pt-8 gap-4">
                    <div>
                         <h1 className="text-3xl font-bold text-gray-800">About Page Manager</h1>
                         <p className="text-sm text-gray-500 mt-1">Manage content on the About page</p>
                    </div>
                    <button
                         onClick={handleSaveAll}
                         disabled={saving}
                         className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                         <HiOutlineSave className="text-lg" />
                         {saving ? "Saving Changes..." : "Save All Data"}
                    </button>
               </div>

               {/* Tab Navigation */}
               <div className="flex flex-wrap gap-2 px-10 mb-8">
                    <button onClick={() => setActiveTab("hero")} className={tabBtnClass("hero")}>Hero Section</button>
                    <button onClick={() => setActiveTab("shikshadetails")} className={tabBtnClass("shikshadetails")}>Shiksha Details ({shikshaDetails.length})</button>
                    <button onClick={() => setActiveTab("ourvalues")} className={tabBtnClass("ourvalues")}>Our Values ({ourValues.length})</button>
               </div>

               <div className="px-10">
                    {activeTab === "hero" && (
                         <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-4 max-w-4xl">
                              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Hero Section</h2>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                   <div>
                                        <label className={labelClass}>Start Title</label>
                                        <input
                                             type="text"
                                             value={heroStart}
                                             onChange={(e) => setHeroStart(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. Learn UI/UX Design"
                                        />
                                   </div>
                                   <div>
                                        <label className={labelClass}>Mid Title (Highlighted/Orange)</label>
                                        <input
                                             type="text"
                                             value={heroMid}
                                             onChange={(e) => setHeroMid(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. From Experts"
                                        />
                                   </div>
                                   <div>
                                        <label className={labelClass}>End Title</label>
                                        <input
                                             type="text"
                                             value={heroEnd}
                                             onChange={(e) => setHeroEnd(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. Online Courses"
                                        />
                                   </div>
                              </div>
                              <div>
                                   <label className={labelClass}>Hero Description</label>
                                   <textarea
                                        value={heroDesc}
                                        onChange={(e) => setHeroDesc(e.target.value)}
                                        className={`${inputClass} min-h-32 resize-none`}
                                        placeholder="Enter about page hero description..."
                                   />
                              </div>
                         </div>
                    )}

                    {activeTab === "shikshadetails" && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              {/* Form to Add/Edit */}
                              <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm h-fit">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                                        {editingDetailIndex !== null ? "Edit Detail" : "Add Detail"}
                                   </h2>
                                   <form onSubmit={handleAddOrEditDetail} className="space-y-4">
                                        <div>
                                             <label className={labelClass}>Detail Title</label>
                                             <input
                                                  type="text"
                                                  value={detailTitle}
                                                  onChange={(e) => setDetailTitle(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Expert Instructors"
                                                  required
                                             />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Detail Description</label>
                                             <textarea
                                                  value={detailDesc}
                                                  onChange={(e) => setDetailDesc(e.target.value)}
                                                  className={`${inputClass} min-h-24 resize-none`}
                                                  placeholder="Describe this detail..."
                                                  required
                                             />
                                        </div>
                                        <button
                                             type="submit"
                                             className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                                        >
                                             <HiOutlinePlus />
                                             {editingDetailIndex !== null ? "Update Detail" : "Add Detail"}
                                        </button>
                                        {editingDetailIndex !== null && (
                                             <button
                                                  type="button"
                                                  onClick={() => {
                                                       setEditingDetailIndex(null);
                                                       setDetailTitle("");
                                                       setDetailDesc("");
                                                  }}
                                                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg transition-colors text-sm"
                                             >
                                                  Cancel Edit
                                             </button>
                                        )}
                                   </form>
                              </div>

                              {/* List view */}
                              <div className="lg:col-span-2 space-y-4">
                                   <h2 className="text-lg font-bold text-gray-800">Details List ({shikshaDetails.length})</h2>
                                   {shikshaDetails.length === 0 ? (
                                        <div className="bg-white rounded-xl border border-gray-150 p-10 text-center text-gray-400">
                                             No details added yet. Use the form to add some.
                                        </div>
                                   ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             {shikshaDetails.map((item, index) => (
                                                  <div key={index} className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
                                                       <div>
                                                            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Detail {index + 1}</span>
                                                            <h3 className="font-bold text-gray-850 mt-2">{item.title}</h3>
                                                            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{item.description}</p>
                                                       </div>
                                                       <div className="flex gap-2 mt-4 border-t border-gray-100 pt-3">
                                                            <button
                                                                 onClick={() => handleEditDetail(index)}
                                                                 className="flex items-center gap-1 text-xs text-orange-500 hover:bg-orange-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold"
                                                            >
                                                                 <HiOutlinePencil /> Edit
                                                            </button>
                                                            <button
                                                                 onClick={() => handleDeleteDetail(index)}
                                                                 className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ml-auto"
                                                            >
                                                                 <HiOutlineTrash /> Delete
                                                            </button>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   )}
                              </div>
                         </div>
                    )}

                    {activeTab === "ourvalues" && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              {/* Form to Add/Edit */}
                              <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm h-fit">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                                        {editingValueIndex !== null ? "Edit Value" : "Add Value"}
                                   </h2>
                                   <form onSubmit={handleAddOrEditValue} className="space-y-4">
                                        <div>
                                             <label className={labelClass}>Value Title</label>
                                             <input
                                                  type="text"
                                                  value={valueTitle}
                                                  onChange={(e) => setValueTitle(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Integrity"
                                                  required
                                             />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Value Description</label>
                                             <textarea
                                                  value={valueDesc}
                                                  onChange={(e) => setValueDesc(e.target.value)}
                                                  className={`${inputClass} min-h-24 resize-none`}
                                                  placeholder="Describe this value..."
                                                  required
                                             />
                                        </div>
                                        <button
                                             type="submit"
                                             className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                                        >
                                             <HiOutlinePlus />
                                             {editingValueIndex !== null ? "Update Value" : "Add Value"}
                                        </button>
                                        {editingValueIndex !== null && (
                                             <button
                                                  type="button"
                                                  onClick={() => {
                                                       setEditingValueIndex(null);
                                                       setValueTitle("");
                                                       setValueDesc("");
                                                  }}
                                                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg transition-colors text-sm"
                                             >
                                                  Cancel Edit
                                             </button>
                                        )}
                                   </form>
                              </div>

                              {/* List view */}
                              <div className="lg:col-span-2 space-y-4">
                                   <h2 className="text-lg font-bold text-gray-800">Our Values List ({ourValues.length})</h2>
                                   {ourValues.length === 0 ? (
                                        <div className="bg-white rounded-xl border border-gray-150 p-10 text-center text-gray-400">
                                             No values added yet. Use the form to add some.
                                        </div>
                                   ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             {ourValues.map((item, index) => (
                                                  <div key={index} className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
                                                       <div>
                                                            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Value {index + 1}</span>
                                                            <h3 className="font-bold text-gray-850 mt-2">{item.title}</h3>
                                                            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{item.description}</p>
                                                       </div>
                                                       <div className="flex gap-2 mt-4 border-t border-gray-100 pt-3">
                                                            <button
                                                                 onClick={() => handleEditValue(index)}
                                                                 className="flex items-center gap-1 text-xs text-orange-500 hover:bg-orange-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold"
                                                            >
                                                                 <HiOutlinePencil /> Edit
                                                            </button>
                                                            <button
                                                                 onClick={() => handleDeleteValue(index)}
                                                                 className="flex items-center gap-1 text-xs text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ml-auto"
                                                            >
                                                                 <HiOutlineTrash /> Delete
                                                            </button>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   )}
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
}
