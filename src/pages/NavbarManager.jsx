import { useEffect, useState } from "react";
import { HiOutlineSave, HiOutlinePlus, HiOutlineTrash, HiOutlineMenu, HiOutlineUpload, HiOutlinePhotograph } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import { getAdminToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export default function NavbarManager() {
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [toast, setToast] = useState({ show: false, message: "" });

     // State fields matching backend schema
     const [logo, setLogo] = useState("");
     const [logoFile, setLogoFile] = useState(null);
     const [buttonName, setButtonName] = useState("All Courses");
     const [searchPlaceholder, setSearchPlaceholder] = useState("Search your course");
     const [dropdownName, setDropdownName] = useState("More");
     const [dropdownItems, setDropdownItems] = useState([]);
     const [logoutButtonName, setLogoutButtonName] = useState("Logout");

     const displayToast = (message) => {
          setToast({ show: true, message });
          setTimeout(() => setToast({ show: false, message: "" }), 3000);
     };

     const fetchNavbarData = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API_URL}/navbar-data`);
               if (res.ok) {
                    const data = await res.json();
                    setLogo(data.logo || "");
                    setButtonName(data.buttonName || "All Courses");
                    setSearchPlaceholder(data.searchPlaceholder || "Search your course");
                    setDropdownName(data.dropdownName || "More");
                    setDropdownItems(data.dropdownItems || []);
                    setLogoutButtonName(data.logoutButtonName || "Logout");
               }
          } catch (err) {
               console.error("Error fetching navbar data:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchNavbarData();
     }, []);

     const handleAddDropdownItem = () => {
          setDropdownItems([...dropdownItems, { name: "", link: "" }]);
     };

     const handleUpdateDropdownItem = (index, field, value) => {
          const updated = [...dropdownItems];
          updated[index] = { ...updated[index], [field]: value };
          setDropdownItems(updated);
     };

     const handleDeleteDropdownItem = (index) => {
          setDropdownItems(dropdownItems.filter((_, i) => i !== index));
     };

     const handleSave = async (e) => {
          if (e) e.preventDefault();
          try {
               setSaving(true);
               
               const formData = new FormData();
               if (logoFile) {
                    formData.append("logo", logoFile);
               } else {
                    formData.append("logo", logo);
               }
               formData.append("buttonName", buttonName);
               formData.append("searchPlaceholder", searchPlaceholder);
               formData.append("dropdownName", dropdownName);
               formData.append("dropdownItems", JSON.stringify(dropdownItems.filter(item => item.name && item.link)));
               formData.append("logoutButtonName", logoutButtonName);

               const res = await fetch(`${API_URL}/navbar-data`, {
                    method: "PUT",
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: formData
               });

               if (res.ok) {
                    displayToast("Navbar Settings Saved Successfully!");
                    setLogoFile(null);
                    fetchNavbarData();
               } else {
                    const data = await res.json().catch(() => ({}));
                    displayToast(data.error || "Failed to save Navbar settings.");
               }
          } catch (err) {
               console.error("Error saving navbar data:", err);
               displayToast("Server error occurred.");
          } finally {
               setSaving(false);
          }
     };

     const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-200";
     const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

     return (
          <div className="bg-gray-50/50 min-h-screen pb-12 font-sans">
               <Breadcrumb />

               <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
                         <div>
                              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Navbar Settings</h1>
                              <p className="text-sm text-gray-500 mt-1">
                                   Configure site navigation header branding, buttons, placeholders and dropdown menu lists.
                              </p>
                         </div>

                         <button
                              onClick={handleSave}
                              disabled={saving || loading}
                              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:cursor-not-allowed shrink-0"
                         >
                              <HiOutlineSave className="w-4 h-4" />
                              <span>{saving ? "Saving..." : "Save Settings"}</span>
                         </button>
                    </div>

                    {loading ? (
                         <div className="h-64 rounded-2xl border border-gray-200 bg-white flex flex-col items-center justify-center text-gray-400 shadow-sm">
                              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                              <span className="text-sm font-medium">Loading Navbar Data...</span>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              {/* Left Grid: General Configuration */}
                              <div className="lg:col-span-2 space-y-6">
                                   <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                                        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Header Configuration</h2>
                                        
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Logo Image</label>
                                             <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                                  {/* Current or selected logo preview */}
                                                  <div className="h-16 w-36 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center p-2 overflow-hidden shrink-0">
                                                       {logoFile ? (
                                                            <img
                                                                 src={URL.createObjectURL(logoFile)}
                                                                 className="max-h-full max-w-full object-contain"
                                                                 alt="Logo preview"
                                                            />
                                                       ) : logo ? (
                                                            <img
                                                                 src={logo}
                                                                 className="max-h-full max-w-full object-contain"
                                                                 alt="Current Logo"
                                                            />
                                                       ) : (
                                                            <div className="flex flex-col items-center gap-1 text-gray-400">
                                                                 <HiOutlinePhotograph className="w-5 h-5" />
                                                                 <span className="text-[10px] font-medium font-sans">Default Logo</span>
                                                            </div>
                                                       )}
                                                  </div>
                                                  
                                                  <div className="flex-1 w-full relative">
                                                       <div className="border border-dashed border-gray-300 hover:border-orange-500 rounded-xl px-4 py-3 bg-gray-50/50 hover:bg-orange-50/10 transition flex items-center justify-center gap-2 cursor-pointer text-center relative group min-h-16">
                                                            <input
                                                                 type="file"
                                                                 accept="image/*"
                                                                 onChange={(e) => setLogoFile(e.target.files[0])}
                                                                 className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                            />
                                                            <div className="flex items-center gap-2 text-gray-500 group-hover:text-orange-500 transition">
                                                                 <HiOutlineUpload className="w-4 h-4" />
                                                                 <span className="text-xs font-semibold font-sans">
                                                                      {logoFile ? logoFile.name : "Choose logo image..."}
                                                                 </span>
                                                            </div>
                                                       </div>
                                                       <p className="text-[10px] text-gray-400 mt-1 leading-normal font-sans">
                                                            Upload your brand's header logo. Supports PNG, JPG, JPEG, and WEBP. Leave empty to keep using the current logo.
                                                       </p>
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Search Box Placeholder</label>
                                                  <input
                                                       type="text"
                                                       value={searchPlaceholder}
                                                       onChange={(e) => setSearchPlaceholder(e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. Search your course"
                                                       required
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Action Button Text</label>
                                                  <input
                                                       type="text"
                                                       value={buttonName}
                                                       onChange={(e) => setButtonName(e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. All Courses"
                                                       required
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Logout Button Text</label>
                                                  <input
                                                       type="text"
                                                       value={logoutButtonName}
                                                       onChange={(e) => setLogoutButtonName(e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. Logout"
                                                       required
                                                  />
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Right Grid: Dropdown Links */}
                              <div className="lg:col-span-1">
                                   <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                             <h2 className="text-base font-bold text-gray-900">Dropdown Menu</h2>
                                             <button
                                                  onClick={handleAddDropdownItem}
                                                  className="text-xs font-bold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-100 transition-colors cursor-pointer"
                                             >
                                                  + Add Link
                                             </button>
                                        </div>

                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Dropdown Menu Title</label>
                                             <input
                                                  type="text"
                                                  value={dropdownName}
                                                  onChange={(e) => setDropdownName(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. More"
                                                  required
                                             />
                                        </div>

                                        <div className="space-y-3 pt-3 border-t border-gray-100">
                                             <label className={labelClass}>Dropdown Links</label>
                                             {dropdownItems.length === 0 ? (
                                                  <div className="py-8 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center px-4 bg-gray-50/40">
                                                       <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 text-sm mb-3">
                                                            <HiOutlineMenu className="w-5 h-5" />
                                                       </div>
                                                       <h3 className="text-gray-900 font-bold text-xs">No links added</h3>
                                                       <p className="text-[10px] text-gray-400 mt-1 max-w-[150px] leading-normal">
                                                            Add navigation items to the header dropdown menu.
                                                       </p>
                                                  </div>
                                             ) : (
                                                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                                       {dropdownItems.map((item, index) => (
                                                            <div key={index} className="bg-gray-50/50 p-3.5 rounded-xl border border-gray-200 relative space-y-2.5 pt-8">
                                                                 <div className="space-y-1">
                                                                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Link Name</label>
                                                                      <input
                                                                           value={item.name}
                                                                           onChange={(e) => handleUpdateDropdownItem(index, 'name', e.target.value)}
                                                                           placeholder="e.g. Resources"
                                                                           className={inputClass}
                                                                           required
                                                                      />
                                                                 </div>
                                                                 <div className="space-y-1">
                                                                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Redirect Path</label>
                                                                      <input
                                                                           value={item.link}
                                                                           onChange={(e) => handleUpdateDropdownItem(index, 'link', e.target.value)}
                                                                           placeholder="e.g. /resources or #"
                                                                           className={inputClass}
                                                                           required
                                                                      />
                                                                 </div>
                                                                 <button
                                                                      onClick={() => handleDeleteDropdownItem(index)}
                                                                      className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all cursor-pointer"
                                                                      title="Remove item"
                                                                 >
                                                                      <HiOutlineTrash className="w-4 h-4" />
                                                                 </button>
                                                            </div>
                                                       ))}
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                              </div>
                         </div>
                    )}

                    {/* Toast Notification */}
                    <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 bg-gray-900 border border-gray-800 text-white px-5 py-3.5 rounded-xl shadow-2xl transform transition-all duration-300 z-50 ${toast.show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
                         <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                         <span className="font-semibold text-xs">{toast.message}</span>
                    </div>
               </div>
          </div>
     );
}
