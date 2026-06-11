import { useEffect, useState } from "react";
import Breadcrumb from "../components/BreadCrumb";
import { HiOutlineUpload, HiOutlineTrash, HiOutlinePlus, HiOutlinePhotograph, HiOutlineSave, HiOutlinePencil } from "react-icons/hi";

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function CompanyWorked() {
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [uploading, setUploading] = useState(false);
     const [showModal, setShowModal] = useState(false);

     // Headings state
     const [startTitle, setStartTitle] = useState("");
     const [endTitle, setEndTitle] = useState("");
     const [description, setDescription] = useState("");

     // Logos array state
     const [imagesList, setImagesList] = useState([]);

     // Modal states
     const [logoTitle, setLogoTitle] = useState("");
     const [logoFile, setLogoFile] = useState(null);
     const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
     const [editingIndex, setEditingIndex] = useState(null);

     const fetchImages = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API}/images`);
               if (res.ok) {
                    const data = await res.json();
                    setStartTitle(data.startTitle || "");
                    setEndTitle(data.endTitle || "");
                    setDescription(data.description || "");
                    setImagesList(data.images || []);
               }
          } catch (err) {
               console.error("Error fetching company data:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchImages();
     }, []);

     // Handle file upload to backend general upload route
     const handleLogoSubmit = async () => {
          if (!logoTitle) return;

          let uploadedUrl = logoPreviewUrl;

          // If a new file is chosen, upload it first
          if (logoFile) {
               setUploading(true);
               try {
                    const formData = new FormData();
                    formData.append("image", logoFile);

                    const res = await fetch(`${API}/upload`, {
                         method: "POST",
                         body: formData
                    });

                    if (!res.ok) {
                         throw new Error("Failed to upload image file");
                    }

                    const data = await res.json();
                    uploadedUrl = data.url;
               } catch (err) {
                    console.error("Image upload failed:", err);
                    alert("Failed to upload logo image. Please try again.");
                    setUploading(false);
                    return;
               }
               setUploading(false);
          }

          if (!uploadedUrl) {
               alert("Please select a logo image file.");
               return;
          }

          if (editingIndex !== null) {
               const updated = [...imagesList];
               updated[editingIndex] = {
                    title: logoTitle,
                    image: uploadedUrl
               };
               setImagesList(updated);
          } else {
               setImagesList([...imagesList, { title: logoTitle, image: uploadedUrl }]);
          }

          setShowModal(false);
          setLogoTitle("");
          setLogoFile(null);
          setLogoPreviewUrl("");
          setEditingIndex(null);
     };

     const deleteLogo = (index) => {
          if (!window.confirm("Are you sure you want to delete this logo from the list?")) return;
          setImagesList(imagesList.filter((_, i) => i !== index));
     };

     const handleSaveAll = async () => {
          setSaving(true);
          try {
               const res = await fetch(`${API}/images`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                         startTitle,
                         endTitle,
                         description,
                         images: imagesList
                    })
               });

               if (res.ok) {
                    alert("Strategic Partners configuration saved successfully!");
                    fetchImages();
               } else {
                    alert("Failed to save changes.");
               }
          } catch (err) {
               console.error("Error saving configurations:", err);
               alert("An error occurred while saving.");
          } finally {
               setSaving(false);
          }
     };

     const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-200";
     const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

     if (loading) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500 font-medium">Loading Strategic Partners Data...</p>
               </div>
          );
     }

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
               <Breadcrumb />

               <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                         <div>
                              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                   Strategic Partners / Companies
                              </h1>
                              <p className="text-gray-500 text-sm mt-1">
                                   Manage partner and client company logos and section headings displayed on the website.
                              </p>
                         </div>

                         <div className="flex gap-3">
                              <button
                                   onClick={handleSaveAll}
                                   disabled={saving}
                                   className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed"
                              >
                                   <HiOutlineSave className="w-5 h-5 text-white" />
                                   <span>{saving ? "Saving Changes..." : "Save All Data"}</span>
                              </button>
                         </div>
                    </div>

                    {/* Section Headings settings */}
                    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 mb-8 space-y-4 shadow-sm">
                         <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3">Section Title & Description Settings</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                   <label className={labelClass}>Start Title (Highlighted/Orange)</label>
                                   <input
                                        type="text"
                                        value={startTitle}
                                        onChange={(e) => setStartTitle(e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Companies"
                                   />
                              </div>
                              <div>
                                   <label className={labelClass}>End Title (Normal/Dark Text)</label>
                                   <input
                                        type="text"
                                        value={endTitle}
                                        onChange={(e) => setEndTitle(e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. That Our Students Work At"
                                   />
                              </div>
                         </div>
                         <div>
                              <label className={labelClass}>Section Description</label>
                              <textarea
                                   value={description}
                                   onChange={(e) => setDescription(e.target.value)}
                                   className={`${inputClass} min-h-20 resize-none`}
                                   placeholder="Enter description text..."
                              />
                         </div>
                    </div>

                    {/* Logos section header */}
                    <div className="flex items-center justify-between mb-6">
                         <h2 className="text-lg font-bold text-gray-950">Partner Logos List ({imagesList.length})</h2>
                         <button
                              onClick={() => {
                                   setEditingIndex(null);
                                   setLogoTitle("");
                                   setLogoFile(null);
                                   setLogoPreviewUrl("");
                                   setShowModal(true);
                              }}
                              className="inline-flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
                         >
                              <HiOutlinePlus className="w-4 h-4 text-gray-500" />
                              <span>Add Logo</span>
                         </button>
                    </div>

                    {/* Logo Grid */}
                    {imagesList.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200/80 rounded-2xl p-6 text-center">
                              <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                                   <HiOutlinePhotograph className="w-6 h-6" />
                              </div>
                              <p className="text-gray-900 text-base font-semibold">No logos uploaded</p>
                              <p className="text-gray-400 text-xs mt-1">Upload partner logos to showcase them on the landing page</p>
                         </div>
                    ) : (
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                              {imagesList.map((item, index) => (
                                   <div
                                        key={index}
                                        className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                                   >
                                        <div className="aspect-[3/2] w-full rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-3 overflow-hidden">
                                             <img
                                                  src={item.image}
                                                  className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                                  alt={item.title}
                                             />
                                        </div>

                                        <div className="mt-4 flex items-center justify-between gap-2">
                                             <h3 className="font-bold text-gray-900 text-xs truncate" title={item.title}>
                                                  {item.title}
                                             </h3>
                                             <div className="flex gap-1">
                                                  <button
                                                       onClick={() => {
                                                            setEditingIndex(index);
                                                            setLogoTitle(item.title);
                                                            setLogoFile(null);
                                                            setLogoPreviewUrl(item.image);
                                                            setShowModal(true);
                                                       }}
                                                       className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition cursor-pointer"
                                                       title="Edit logo"
                                                  >
                                                       <HiOutlinePencil className="w-3.5 h-3.5" />
                                                  </button>
                                                  <button
                                                       onClick={() => deleteLogo(index)}
                                                       className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                                       title="Delete logo"
                                                  >
                                                       <HiOutlineTrash className="w-3.5 h-3.5" />
                                                  </button>
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>

               {/* Upload/Edit Logo Modal */}
               {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6">
                              <div>
                                   <h2 className="text-lg font-bold text-gray-900">
                                        {editingIndex !== null ? "Edit Logo" : "Upload Partner Logo"}
                                   </h2>
                                   <p className="text-xs text-gray-400 mt-0.5">
                                        Add partner company name and upload their branding logo.
                                   </p>
                              </div>

                              <div className="space-y-4">
                                   {/* Name Input */}
                                   <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                                             Company Name
                                        </label>
                                        <input
                                             value={logoTitle}
                                             onChange={(e) => setLogoTitle(e.target.value)}
                                             placeholder="e.g. Google"
                                             className={inputClass}
                                             required
                                        />
                                   </div>

                                   {/* Dropzone Upload */}
                                   <div className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/10 transition relative">
                                        <input
                                             type="file"
                                             accept="image/*"
                                             onChange={(e) => {
                                                  const selectedFile = e.target.files[0];
                                                  if (selectedFile) {
                                                       setLogoFile(selectedFile);
                                                       setLogoPreviewUrl(URL.createObjectURL(selectedFile));
                                                  }
                                             }}
                                             className="absolute inset-0 opacity-0 cursor-pointer"
                                        />

                                        {logoPreviewUrl ? (
                                             <div className="flex flex-col items-center gap-2">
                                                  <img
                                                       src={logoPreviewUrl}
                                                       className="h-20 max-w-full object-contain rounded-lg border border-gray-100 bg-white p-1"
                                                  />
                                                  <p className="text-xs font-semibold text-gray-700 truncate max-w-[200px]">
                                                       {logoFile ? logoFile.name : "Existing Image"}
                                                  </p>
                                                  <p className="text-[10px] text-gray-400">
                                                       Click or drag to replace
                                                  </p>
                                             </div>
                                        ) : (
                                             <div className="flex flex-col items-center gap-2.5">
                                                  <div className="w-10 h-10 bg-gray-50 border border-gray-100 flex items-center justify-center rounded-xl text-gray-500 shadow-sm">
                                                       <HiOutlineUpload className="w-5 h-5" />
                                                  </div>
                                                  <div>
                                                       <p className="text-xs font-bold text-gray-700">
                                                            Upload Logo Image
                                                       </p>
                                                       <p className="text-[10px] text-gray-400 mt-1">
                                                            Supports PNG, JPG, JPEG (transparent PNG preferred)
                                                       </p>
                                                  </div>
                                             </div>
                                        )}
                                   </div>
                              </div>

                              {/* Footer Actions */}
                              <div className="flex items-center justify-end gap-3 pt-2">
                                   <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                                   >
                                        Cancel
                                   </button>

                                   <button
                                        onClick={handleLogoSubmit}
                                        disabled={uploading || !logoTitle || (!logoPreviewUrl && !logoFile)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-md ${
                                             uploading || !logoTitle || (!logoPreviewUrl && !logoFile)
                                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                                  : "bg-orange-500 hover:bg-orange-600 shadow-orange-200"
                                        }`}
                                   >
                                        {uploading ? (
                                             <>
                                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                  <span>Uploading...</span>
                                             </>
                                        ) : (
                                             <span>Save Logo</span>
                                        )}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}