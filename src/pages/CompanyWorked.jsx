import { useEffect, useState } from "react";
import Breadcrumb from "../components/BreadCrumb";
import { HiOutlineUpload, HiOutlineTrash, HiOutlinePlus, HiOutlinePhotograph } from "react-icons/hi";

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function CompanyWorked() {
     const [uploading, setUploading] = useState(false);
     const [images, setImages] = useState([]);
     const [showModal, setShowModal] = useState(false);
     const [title, setTitle] = useState("");
     const [file, setFile] = useState(null);
     const [editItem, setEditItem] = useState(null);

     const fetchImages = async () => {
          const res = await fetch(`${API}/images`);
          const data = await res.json();
          setImages(data);
     };

     useEffect(() => {
          fetchImages();
     }, []);

     const uploadImage = async () => {
          if (!title || !file) return;

          setUploading(true);

          const formData = new FormData();
          formData.append("title", title);
          formData.append("image", file);

          await fetch(`${API}/images`, {
               method: "POST",
               body: formData
          });

          setUploading(false);
          setShowModal(false);
          setTitle("");
          setFile(null);
          fetchImages();
     };

     const deleteImage = async (id) => {
          if (!window.confirm("Are you sure you want to delete this logo?")) return;
          await fetch(`${API}/images/${id}`, {
               method: "DELETE"
          });
          fetchImages();
     };

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
               <Breadcrumb />

               <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                         <div>
                              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                   Strategic Partners
                              </h1>
                              <p className="text-gray-500 text-sm mt-1">
                                   Manage partner and client company logos displayed on the site website.
                              </p>
                         </div>

                         <button
                              onClick={() => {
                                   setEditItem(null);
                                   setShowModal(true);
                              }}
                              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0"
                         >
                              <HiOutlinePlus className="w-4 h-4 text-white" />
                              <span>Upload Logo</span>
                         </button>
                    </div>

                    {/* Logo Grid */}
                    {images.length === 0 ? (
                         <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200/80 rounded-2xl p-6 text-center">
                              <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                                   <HiOutlinePhotograph className="w-6 h-6" />
                              </div>
                              <p className="text-gray-900 text-base font-semibold">No logos uploaded</p>
                              <p className="text-gray-400 text-xs mt-1">Upload partner logos to showcase them on the landing page</p>
                         </div>
                    ) : (
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                              {images.map((item) => (
                                   <div
                                        key={item._id}
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
                                             <button
                                                  onClick={() => deleteImage(item._id)}
                                                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer shrink-0"
                                                  title="Delete logo"
                                             >
                                                  <HiOutlineTrash className="w-4 h-4" />
                                             </button>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>

               {/* Upload Modal */}
               {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-6">
                              <div>
                                   <h2 className="text-lg font-bold text-gray-900">
                                        {editItem ? "Edit Logo" : "Upload Partner Logo"}
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
                                             value={title}
                                             onChange={(e) => setTitle(e.target.value)}
                                             placeholder="e.g. Google"
                                             className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-200"
                                             required
                                        />
                                   </div>

                                   {/* Dropzone Upload */}
                                   {!editItem && (
                                        <div className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/10 transition relative">
                                             <input
                                                  type="file"
                                                  accept="image/*"
                                                  onChange={(e) => setFile(e.target.files[0])}
                                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                                  required
                                             />

                                             {file ? (
                                                  <div className="flex flex-col items-center gap-2">
                                                       <img
                                                            src={URL.createObjectURL(file)}
                                                            className="h-20 max-w-full object-contain rounded-lg border border-gray-100 bg-white p-1"
                                                       />
                                                       <p className="text-xs font-semibold text-gray-700 truncate max-w-[200px]">
                                                            {file.name}
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
                                   )}
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
                                        onClick={uploadImage}
                                        disabled={uploading || !title || (!editItem && !file)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-md ${
                                             uploading || !title || (!editItem && !file)
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
                                             <span>Upload Logo</span>
                                        )}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}