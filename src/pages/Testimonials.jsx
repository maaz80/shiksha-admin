import { useEffect, useState } from "react";
import { getAdminToken } from "../utils/auth.js";
import Breadcrumb from "../components/BreadCrumb.jsx";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineChatAlt2 } from "react-icons/hi";

const API_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api").trim().replace(/\/$/, "");

export default function Testimonials() {
     const [testimonials, setTestimonials] = useState([]);
     const [loading, setLoading] = useState(true);
     const [showModal, setShowModal] = useState(false);
     const [editingItem, setEditingItem] = useState(null);
     const [submitting, setSubmitting] = useState(false);

     // Form States
     const [name, setName] = useState("");
     const [quote, setQuote] = useState("");
     const [role, setRole] = useState("Student");

     const [toast, setToast] = useState({ show: false, message: "", type: "success" });
     const showToast = (message, type = "success") => {
          setToast({ show: true, message, type });
          setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
     };

     const getInitials = (str) => {
          if (!str) return "";
          const parts = str.trim().split(/\s+/);
          if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
          return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
     };

     const fetchTestimonials = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API_URL}/testimonials`);
               if (res.ok) {
                    const data = await res.json();
                    setTestimonials(Array.isArray(data) ? data : []);
               }
          } catch (err) {
               console.error("Failed to fetch testimonials:", err);
               showToast("Failed to load testimonials.", "error");
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchTestimonials();
     }, []);

     const openCreateModal = () => {
          setEditingItem(null);
          setName("");
          setQuote("");
          setRole("Student");
          setShowModal(true);
     };

     const openEditModal = (item) => {
          setEditingItem(item);
          setName(item.name || "");
          setQuote(item.quote || "");
          setRole(item.role || "Student");
          setShowModal(true);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          if (!name.trim() || !quote.trim()) {
               showToast("Please fill in both Name and Quote fields.", "error");
               return;
          }

          setSubmitting(true);
          try {
               const method = editingItem ? "PUT" : "POST";
               const url = editingItem ? `${API_URL}/testimonials/${editingItem._id}` : `${API_URL}/testimonials`;

               const res = await fetch(url, {
                    method,
                    headers: {
                         "Content-Type": "application/json",
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: JSON.stringify({
                         name,
                         quote,
                         role
                    })
               });

               if (res.ok) {
                    showToast(
                         editingItem ? "Testimonial updated successfully!" : "Testimonial added successfully!",
                         "success"
                    );
                    setShowModal(false);
                    fetchTestimonials();
               } else {
                    const errData = await res.json();
                    showToast(errData.error || "Operation failed.", "error");
               }
          } catch (err) {
               console.error("Error saving testimonial:", err);
               showToast("Server error occurred.", "error");
          } finally {
               setSubmitting(false);
          }
     };

     const handleDelete = async (id) => {
          if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

          try {
               const res = await fetch(`${API_URL}/testimonials/${id}`, {
                    method: "DELETE",
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    }
               });

               if (res.ok) {
                    showToast("Testimonial deleted successfully!", "success");
                    fetchTestimonials();
               } else {
                    showToast("Failed to delete testimonial.", "error");
               }
          } catch (err) {
               console.error("Error deleting testimonial:", err);
               showToast("Server error occurred.", "error");
          }
     };

     return (
          <div className="p-6 max-w-7xl mx-auto space-y-6">
               <Breadcrumb pageTitle="Global Testimonials" />

               {/* Toast Notification */}
               {toast.show && (
                    <div
                         className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-white font-medium flex items-center gap-2 ${
                              toast.type === "error" ? "bg-red-500" : "bg-emerald-600"
                         }`}
                    >
                         <span>{toast.message}</span>
                    </div>
               )}

               {/* Header Bar */}
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                              <HiOutlineChatAlt2 className="w-7 h-7 text-primary" />
                              Global Testimonials Manager
                         </h1>
                         <p className="text-sm text-gray-500 mt-1">
                              Manage student testimonials displayed globally across all site pages.
                         </p>
                    </div>
                    <button
                         onClick={openCreateModal}
                         className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-primary/20 cursor-pointer"
                    >
                         <HiOutlinePlus className="w-5 h-5" />
                         <span>Add Testimonial</span>
                    </button>
               </div>

               {/* Testimonials List / Grid */}
               {loading ? (
                    <div className="text-center py-12 text-gray-400 font-medium">Loading testimonials...</div>
               ) : testimonials.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
                         <HiOutlineChatAlt2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                         <p className="text-gray-600 font-medium">No testimonials found.</p>
                         <p className="text-xs text-gray-400 mt-1">Click "Add Testimonial" to create your first item.</p>
                    </div>
               ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {testimonials.map((item) => (
                              <div
                                   key={item._id}
                                   className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                              >
                                   <div>
                                        <div className="flex items-center gap-3.5 mb-4">
                                             {/* Name Initials Avatar */}
                                             <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center text-base shrink-0 select-none">
                                                  {getInitials(item.name)}
                                             </div>
                                             <div>
                                                  <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                                                  <p className="text-xs text-primary font-bold">{item.role || "Student"}</p>
                                             </div>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed italic bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                                             "{item.quote}"
                                        </p>
                                   </div>

                                   <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-gray-100">
                                        <button
                                             onClick={() => openEditModal(item)}
                                             className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                                             title="Edit Testimonial"
                                        >
                                             <HiOutlinePencil className="w-4 h-4" />
                                        </button>
                                        <button
                                             onClick={() => handleDelete(item._id)}
                                             className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                             title="Delete Testimonial"
                                        >
                                             <HiOutlineTrash className="w-4 h-4" />
                                        </button>
                                   </div>
                              </div>
                         ))}
                    </div>
               )}

               {/* Modal Form */}
               {showModal && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                         <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100">
                              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                   <h3 className="font-bold text-gray-900 text-lg">
                                        {editingItem ? "Edit Testimonial" : "Add New Testimonial"}
                                   </h3>
                                   <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-400 hover:text-gray-600 font-semibold text-lg cursor-pointer"
                                   >
                                        ✕
                                   </button>
                              </div>

                              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                   <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                             Student / Author Name *
                                        </label>
                                        <input
                                             type="text"
                                             value={name}
                                             onChange={(e) => setName(e.target.value)}
                                             placeholder="e.g. Kathy Sullivan"
                                             required
                                             className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-800"
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                             Role / Designation (Optional)
                                        </label>
                                        <input
                                             type="text"
                                             value={role}
                                             onChange={(e) => setRole(e.target.value)}
                                             placeholder="e.g. Data Scientist / Student"
                                             className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-800"
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                                             Testimonial Quote *
                                        </label>
                                        <textarea
                                             value={quote}
                                             onChange={(e) => setQuote(e.target.value)}
                                             placeholder="Enter student quote or review text..."
                                             rows={4}
                                             required
                                             className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-gray-800"
                                        />
                                   </div>

                                   <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                        <button
                                             type="button"
                                             onClick={() => setShowModal(false)}
                                             className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 cursor-pointer"
                                        >
                                             Cancel
                                        </button>
                                        <button
                                             type="submit"
                                             disabled={submitting}
                                             className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-60"
                                        >
                                             {submitting ? "Saving..." : editingItem ? "Update" : "Create"}
                                        </button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}
          </div>
     );
}
