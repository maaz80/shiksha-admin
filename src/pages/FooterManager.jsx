import { useEffect, useState } from "react";
import Breadcrumb from "../components/BreadCrumb.jsx";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export default function FooterManager() {
     const [columns, setColumns] = useState([]);
     const [showModal, setShowModal] = useState(false);
     const [editItem, setEditItem] = useState(null);
     const [title, setTitle] = useState("");
     const [order, setOrder] = useState(0);
     const [links, setLinks] = useState([]);
     const [saving, setSaving] = useState(false);

     const fetchColumns = async () => {
          try {
               const res = await fetch(`${API_URL}/footer-columns`);
               const data = await res.json();
               setColumns(data);
          } catch (err) {
               console.error("Failed to fetch footer columns", err);
          }
     };

     useEffect(() => {
          fetchColumns();
     }, []);

     const resetForm = () => {
          setTitle("");
          setOrder(0);
          setLinks([]);
          setEditItem(null);
     };

     const openAddModal = () => {
          resetForm();
          setShowModal(true);
     };

     const openEditModal = (col) => {
          setEditItem(col);
          setTitle(col.title);
          setOrder(col.order || 0);
          setLinks(col.links || []);
          setShowModal(true);
     };

     const addLinkRow = () => {
          setLinks([...links, { label: "", path: "" }]);
     };

     const updateLinkField = (index, key, value) => {
          const updated = [...links];
          updated[index][key] = value;
          setLinks(updated);
     };

     const removeLinkRow = (index) => {
          setLinks(links.filter((_, i) => i !== index));
     };

     const saveColumn = async (e) => {
          e.preventDefault();
          if (!title) {
               alert("Title is required.");
               return;
          }

          setSaving(true);
          try {
               const payload = {
                    title,
                    order: Number(order),
                    links: links.filter(l => l.label && l.path)
               };

               let url = `${API_URL}/footer-columns`;
               let method = "POST";

               if (editItem) {
                    url = `${API_URL}/footer-columns/${editItem._id}`;
                    method = "PUT";
               }

               const res = await fetch(url, {
                    method,
                    headers: {
                         "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
               });

               if (res.ok) {
                    setShowModal(false);
                    resetForm();
                    fetchColumns();
               } else {
                    const err = await res.json();
                    alert(err.error || "Failed to save footer column");
               }
          } catch (err) {
               console.error("Save error", err);
               alert("An error occurred while saving.");
          } finally {
               setSaving(false);
          }
     };

     const deleteColumn = async (id) => {
          if (!window.confirm("Are you sure you want to delete this footer column?")) return;

          try {
               const res = await fetch(`${API_URL}/footer-columns/${id}`, {
                    method: "DELETE"
               });

               if (res.ok) {
                    fetchColumns();
               } else {
                    alert("Failed to delete column.");
               }
          } catch (err) {
               console.error(err);
               alert("An error occurred while deleting.");
          }
     };

     const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all duration-200";

     return (
          <div className="min-h-screen">
               <Breadcrumb />

               {/* Header */}
               <div className="flex items-center justify-between mb-10 px-10 pt-10">
                    <div>
                         <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Footer Links Manager</h1>
                         <p className="text-sm text-gray-400 mt-1">Manage dynamic footer sections & column links</p>
                    </div>

                    <button
                         onClick={openAddModal}
                         className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                         </svg>
                         Add Column
                    </button>
               </div>

               {/* Columns List */}
               {columns.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-300 px-10">
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                         </svg>
                         <p className="text-lg font-medium">No footer columns configured yet</p>
                         <p className="text-sm mt-1">Click "Add Column" to build your dynamic footer</p>
                    </div>
               ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-10">
                         {columns.map(col => (
                              <div key={col._id} className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                                   <div>
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                                             <h2 className="font-bold text-gray-900 text-base">{col.title}</h2>
                                             <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-md">
                                                  Order: {col.order}
                                             </span>
                                        </div>

                                        <div className="space-y-2.5">
                                             {(!col.links || col.links.length === 0) ? (
                                                  <p className="text-xs text-gray-400 italic">No links added</p>
                                             ) : (
                                                  col.links.map((link, idx) => (
                                                       <div key={idx} className="flex flex-col border-l-2 border-orange-200 pl-2 text-xs">
                                                            <span className="font-semibold text-gray-800">{link.label}</span>
                                                            <span className="text-gray-400 font-mono overflow-x-auto">{link.path}</span>
                                                       </div>
                                                  ))
                                             )}
                                        </div>
                                   </div>

                                   <div className="flex gap-2 pt-4 border-t border-gray-100 mt-5">
                                        <button
                                             onClick={() => openEditModal(col)}
                                             className="flex-1 flex items-center justify-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-semibold py-2 rounded-xl transition-colors duration-200 cursor-pointer"
                                        >
                                             Edit
                                        </button>
                                        <button
                                             onClick={() => deleteColumn(col._id)}
                                             className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold py-2 rounded-xl transition-colors duration-200 cursor-pointer"
                                        >
                                             Delete
                                        </button>
                                   </div>
                              </div>
                         ))}
                    </div>
               )}

               {/* Modal Dialog */}
               {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <form onSubmit={saveColumn} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col justify-between">
                              
                              <div>
                                   {/* Modal Header */}
                                   <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                                        <div>
                                             <h2 className="text-lg font-bold text-gray-900">
                                                  {editItem ? "Edit Footer Column" : "Add Footer Column"}
                                             </h2>
                                             <p className="text-xs text-gray-400 mt-0.5">
                                                  Configure a section heading and its redirect URLs
                                             </p>
                                        </div>
                                        <button
                                             type="button"
                                             onClick={() => setShowModal(false)}
                                             className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                                        >
                                             ✕
                                        </button>
                                   </div>

                                   <div className="px-7 py-6 space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                             <div className="sm:col-span-2">
                                                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Column Heading</label>
                                                  <input
                                                       type="text"
                                                       placeholder="e.g., Company, Popular Courses"
                                                       value={title}
                                                       onChange={(e) => setTitle(e.target.value)}
                                                       className={inputClass}
                                                       required
                                                  />
                                             </div>
                                             <div>
                                                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Ordering Weight</label>
                                                  <input
                                                       type="number"
                                                       value={order}
                                                       onChange={(e) => setOrder(e.target.value)}
                                                       className={inputClass}
                                                       required
                                                  />
                                             </div>
                                        </div>

                                        <div className="border-t border-gray-100 pt-4">
                                             <div className="flex items-center justify-between mb-3">
                                                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Navigation Links</label>
                                                  <button
                                                       type="button"
                                                       onClick={addLinkRow}
                                                       className="text-xs font-semibold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                  >
                                                       + Add Link
                                                  </button>
                                             </div>

                                             <div className="space-y-3">
                                                  {links.length === 0 ? (
                                                       <p className="text-xs text-gray-400 text-center py-6">No links configured. Click "+ Add Link" to add one.</p>
                                                  ) : (
                                                       links.map((link, idx) => (
                                                            <div key={idx} className="flex gap-2 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                                 <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                      <input
                                                                           type="text"
                                                                           placeholder="Link Label (e.g., About Us)"
                                                                           value={link.label}
                                                                           onChange={(e) => updateLinkField(idx, "label", e.target.value)}
                                                                           className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                                           required
                                                                      />
                                                                      <input
                                                                           type="text"
                                                                           placeholder="Redirect Path (e.g., /about-us)"
                                                                           value={link.path}
                                                                           onChange={(e) => updateLinkField(idx, "path", e.target.value)}
                                                                           className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                                           required
                                                                      />
                                                                 </div>
                                                                 <button
                                                                      type="button"
                                                                      onClick={() => removeLinkRow(idx)}
                                                                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer shrink-0"
                                                                 >
                                                                      ✕
                                                                 </button>
                                                            </div>
                                                       ))
                                                  )}
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Modal Footer */}
                              <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
                                   <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 disabled:bg-orange-300 disabled:cursor-not-allowed cursor-pointer"
                                   >
                                        {saving ? "Saving..." : "Save Column"}
                                   </button>
                              </div>

                         </form>
                    </div>
               )}
          </div>
     );
}
