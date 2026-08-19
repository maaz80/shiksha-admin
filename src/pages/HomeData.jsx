import { useEffect, useState } from "react";
import { HiOutlineSave, HiOutlinePlus, HiOutlineTrash, HiOutlinePencil, HiOutlineUpload } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function HomeData() {
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [activeTab, setActiveTab] = useState("hero");

     // Hero State
     const [heroStart, setHeroStart] = useState("");
     const [heroMid, setHeroMid] = useState("");
     const [heroEnd, setHeroEnd] = useState("");

     // What We Do State (Array-based)
     const [whatWeDoPoints, setWhatWeDoPoints] = useState([]);
     const [whatWeDoText, setWhatWeDoText] = useState("");
     const [whatWeDoFile, setWhatWeDoFile] = useState(null);
     const [whatWeDoPreviewUrl, setWhatWeDoPreviewUrl] = useState("");
     const [editingWhatIndex, setEditingWhatIndex] = useState(null);
     const [whatUploading, setWhatUploading] = useState(false);

     // Our Programs State
     const [ourProgramsStart, setOurProgramsStart] = useState("");
     const [ourProgramsEnd, setOurProgramsEnd] = useState("");

     // How It Works State
     const [howItWorksTitle, setHowItWorksTitle] = useState("");
     const [howItWorks, setHowItWorks] = useState([]);
     const [howTitle, setHowTitle] = useState("");
     const [howDesc, setHowDesc] = useState("");
     const [editingHowIndex, setEditingHowIndex] = useState(null);

     // Community State
     const [communityStartTitle, setCommunityStartTitle] = useState("");
     const [communityMidTitle, setCommunityMidTitle] = useState("");
     const [communityEndTitle, setCommunityEndTitle] = useState("");
     const [communityDesc, setCommunityDesc] = useState("");
     const [community, setCommunity] = useState([]);
     const [commTitle, setCommTitle] = useState("");
     const [commDesc, setCommDesc] = useState("");
     const [editingCommIndex, setEditingCommIndex] = useState(null);

     // Community Bar State
     const [communityBar, setCommunityBar] = useState([]);
     const [barTitle, setBarTitle] = useState("");
     const [barDesc, setBarDesc] = useState("");
     const [barFile, setBarFile] = useState(null);
     const [barPreviewUrl, setBarPreviewUrl] = useState("");
     const [editingBarIndex, setEditingBarIndex] = useState(null);
     const [barUploading, setBarUploading] = useState(false);

     // Testimonials, Related Blogs Title States
     const [testimonialStartTitle, setTestimonialStartTitle] = useState("");
     const [testimonialMidTitle, setTestimonialMidTitle] = useState("");
     const [testimonialEndTitle, setTestimonialEndTitle] = useState("");
     const [testimonialDesc, setTestimonialDesc] = useState("");
     const [relatedBlogsTitle, setRelatedBlogsTitle] = useState("");

     const fetchHomeData = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API_URL}/home-data`);
               if (res.ok) {
                    const data = await res.json();
                    
                    // Hero
                    setHeroStart(data.hero?.startTitle || "");
                    setHeroMid(data.hero?.midTitle || "");
                    setHeroEnd(data.hero?.endTitle || "");
                    
                    // What We Do
                    setWhatWeDoPoints(data.whatwedo?.point || []);
                    
                    // Our Programs
                    setOurProgramsStart(data.ourprograms?.startTitle || "");
                    setOurProgramsEnd(data.ourprograms?.endTitle || "");

                    // How It Works
                    setHowItWorksTitle(data.howitworks?.title || "");
                    setHowItWorks(data.howitworks?.works || []);

                    // Community
                    setCommunityStartTitle(data.community?.startTitle || "");
                    setCommunityMidTitle(data.community?.midTitle || "");
                    setCommunityEndTitle(data.community?.endTitle || "");
                    setCommunityDesc(data.community?.description || "");
                    setCommunity(data.community?.points || []);

                    // Community Bar
                    setCommunityBar(data.communityBar || []);

                    // Testimonials, Related Blogs
                    setTestimonialStartTitle(data.testimonialstitle?.startTitle || "");
                    setTestimonialMidTitle(data.testimonialstitle?.midTitle || "");
                    setTestimonialEndTitle(data.testimonialstitle?.endTitle || "");
                    setTestimonialDesc(data.testimonialstitle?.description || "");
                    setRelatedBlogsTitle(data.relatedblogstitle || "");
               }
          } catch (err) {
               console.error("Error fetching home data:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchHomeData();
     }, []);

     const handleSaveAll = async () => {
          try {
               setSaving(true);
               const payload = {
                    hero: {
                         startTitle: heroStart,
                         midTitle: heroMid,
                         endTitle: heroEnd,
                    },
                    whatwedo: {
                         point: whatWeDoPoints.map(item => ({ image: item.image, text: item.text }))
                    },
                    ourprograms: {
                         startTitle: ourProgramsStart,
                         endTitle: ourProgramsEnd,
                    },
                    howitworks: {
                         title: howItWorksTitle,
                         works: howItWorks.map(item => ({ title: item.title, description: item.description }))
                    },
                    community: {
                         startTitle: communityStartTitle,
                         midTitle: communityMidTitle,
                         endTitle: communityEndTitle,
                         description: communityDesc,
                         points: community.map(item => ({ title: item.title, description: item.description }))
                    },
                    communityBar: communityBar.map(item => ({ title: item.title, description: item.description, image: item.image })),
                    testimonialstitle: {
                         startTitle: testimonialStartTitle,
                         midTitle: testimonialMidTitle,
                         endTitle: testimonialEndTitle,
                         description: testimonialDesc,
                    },
                    relatedblogstitle: relatedBlogsTitle,
               };

               const res = await fetch(`${API_URL}/home-data`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
               });

               if (res.ok) {
                    alert("Home Data saved successfully!");
                    fetchHomeData();
               } else {
                    alert("Failed to save Home Data.");
               }
          } catch (err) {
               console.error("Error saving home data:", err);
               alert("An error occurred while saving.");
          } finally {
               setSaving(false);
          }
     };

     // Array helpers: What We Do (with Upload)
     const handleAddOrEditWhat = async (e) => {
          e.preventDefault();
          if (!whatWeDoText) return;

          let uploadedUrl = whatWeDoPreviewUrl;

          if (whatWeDoFile) {
               setWhatUploading(true);
               try {
                    const formData = new FormData();
                    formData.append("image", whatWeDoFile);
                    const res = await fetch(`${API_URL}/upload`, {
                         method: "POST",
                         body: formData
                    });
                    if (res.ok) {
                         const data = await res.json();
                         uploadedUrl = data.url;
                    } else {
                         alert("Failed to upload point image");
                         setWhatUploading(false);
                         return;
                    }
               } catch (err) {
                    console.error("WhatWeDo image upload failed:", err);
                    alert("Image upload error.");
                    setWhatUploading(false);
                    return;
               }
               setWhatUploading(false);
          }

          if (!uploadedUrl) {
               alert("Please select or upload an image.");
               return;
          }

          if (editingWhatIndex !== null) {
               const updated = [...whatWeDoPoints];
               updated[editingWhatIndex] = { text: whatWeDoText, image: uploadedUrl };
               setWhatWeDoPoints(updated);
               setEditingWhatIndex(null);
          } else {
               setWhatWeDoPoints([...whatWeDoPoints, { text: whatWeDoText, image: uploadedUrl }]);
          }
          setWhatWeDoText("");
          setWhatWeDoFile(null);
          setWhatWeDoPreviewUrl("");
     };

     const handleEditWhat = (index) => {
          const item = whatWeDoPoints[index];
          setWhatWeDoText(item.text);
          setWhatWeDoFile(null);
          setWhatWeDoPreviewUrl(item.image || "");
          setEditingWhatIndex(index);
     };

     const handleDeleteWhat = (index) => {
          setWhatWeDoPoints(whatWeDoPoints.filter((_, i) => i !== index));
          if (editingWhatIndex === index) {
               setEditingWhatIndex(null);
               setWhatWeDoText("");
               setWhatWeDoFile(null);
               setWhatWeDoPreviewUrl("");
          }
     };

     // Array helpers: How It Works
     const handleAddOrEditHow = (e) => {
          e.preventDefault();
          if (!howTitle || !howDesc) return;

          if (editingHowIndex !== null) {
               const updated = [...howItWorks];
               updated[editingHowIndex] = { title: howTitle, description: howDesc };
               setHowItWorks(updated);
               setEditingHowIndex(null);
          } else {
               setHowItWorks([...howItWorks, { title: howTitle, description: howDesc }]);
          }
          setHowTitle("");
          setHowDesc("");
     };

     const handleEditHow = (index) => {
          const item = howItWorks[index];
          setHowTitle(item.title);
          setHowDesc(item.description);
          setEditingHowIndex(index);
     };

     const handleDeleteHow = (index) => {
          setHowItWorks(howItWorks.filter((_, i) => i !== index));
          if (editingHowIndex === index) {
               setEditingHowIndex(null);
               setHowTitle("");
               setHowDesc("");
          }
     };

     // Array helpers: Community
     const handleAddOrEditComm = (e) => {
          e.preventDefault();
          if (!commTitle || !commDesc) return;

          if (editingCommIndex !== null) {
               const updated = [...community];
               updated[editingCommIndex] = { title: commTitle, description: commDesc };
               setCommunity(updated);
               setEditingCommIndex(null);
          } else {
               setCommunity([...community, { title: commTitle, description: commDesc }]);
          }
          setCommTitle("");
          setCommDesc("");
     };

     const handleEditComm = (index) => {
          const item = community[index];
          setCommTitle(item.title);
          setCommDesc(item.description);
          setEditingCommIndex(index);
     };

     const handleDeleteComm = (index) => {
          setCommunity(community.filter((_, i) => i !== index));
          if (editingCommIndex === index) {
               setEditingCommIndex(null);
               setCommTitle("");
               setCommDesc("");
          }
     };

     // Array helpers: Community Bar (with Upload)
     const handleAddOrEditBar = async (e) => {
          e.preventDefault();
          if (!barTitle || !barDesc) return;

          let uploadedUrl = barPreviewUrl;

          if (barFile) {
               setBarUploading(true);
               try {
                    const formData = new FormData();
                    formData.append("image", barFile);
                    const res = await fetch(`${API_URL}/upload`, {
                         method: "POST",
                         body: formData
                    });
                    if (res.ok) {
                         const data = await res.json();
                         uploadedUrl = data.url;
                    } else {
                         alert("Failed to upload bar image");
                         setBarUploading(false);
                         return;
                    }
               } catch (err) {
                    console.error("Community Bar image upload failed:", err);
                    alert("Image upload error.");
                    setBarUploading(false);
                    return;
               }
               setBarUploading(false);
          }

          if (!uploadedUrl) {
               alert("Please select or upload an image.");
               return;
          }

          if (editingBarIndex !== null) {
               const updated = [...communityBar];
               updated[editingBarIndex] = { title: barTitle, description: barDesc, image: uploadedUrl };
               setCommunityBar(updated);
               setEditingBarIndex(null);
          } else {
               setCommunityBar([...communityBar, { title: barTitle, description: barDesc, image: uploadedUrl }]);
          }
          setBarTitle("");
          setBarDesc("");
          setBarFile(null);
          setBarPreviewUrl("");
     };

     const handleEditBar = (index) => {
          const item = communityBar[index];
          setBarTitle(item.title);
          setBarDesc(item.description);
          setBarFile(null);
          setBarPreviewUrl(item.image || "");
          setEditingBarIndex(index);
     };

     const handleDeleteBar = (index) => {
          setCommunityBar(communityBar.filter((_, i) => i !== index));
          if (editingBarIndex === index) {
               setEditingBarIndex(null);
               setBarTitle("");
               setBarDesc("");
               setBarFile(null);
               setBarPreviewUrl("");
          }
     };

     const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all";
     const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider";
     const tabBtnClass = (tab) => `px-5 py-3 font-semibold text-sm rounded-lg transition-all ${activeTab === tab ? "bg-primary text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

     if (loading) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500 font-medium">Loading Home Data...</p>
               </div>
          );
     }

     return (
          <div className="bg-gray-50/50 min-h-screen pb-12 font-sans">
               <Breadcrumb />
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-6 lg:px-10 max-w-7xl mx-auto">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Home Page Content</h1>
                         <p className="text-sm text-gray-500 mt-1">Manage global content on the website landing page</p>
                    </div>
                    <button
                         onClick={handleSaveAll}
                         disabled={saving}
                         className="bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shrink-0"
                    >
                         <HiOutlineSave className="text-lg" />
                         {saving ? "Saving Changes..." : "Save All Data"}
                    </button>
               </div>

               {/* Tab Navigation */}
               <div className="flex flex-wrap gap-2 px-6 lg:px-10 max-w-7xl mx-auto mb-8">
                    <button onClick={() => setActiveTab("hero")} className={tabBtnClass("hero")}>Hero & What We Do</button>
                    <button onClick={() => setActiveTab("howitworks")} className={tabBtnClass("howitworks")}>How It Works ({howItWorks.length})</button>
                    <button onClick={() => setActiveTab("community")} className={tabBtnClass("community")}>Community ({community.length})</button>
                    <button onClick={() => setActiveTab("communitybar")} className={tabBtnClass("communitybar")}>Community Bar ({communityBar.length})</button>
                    <button onClick={() => setActiveTab("extras")} className={tabBtnClass("extras")}>Testimonials & Blogs</button>
               </div>

               <div className="px-6 lg:px-10 max-w-7xl mx-auto">
                    {activeTab === "hero" && (
                         <div className="space-y-8">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                   {/* Hero Section */}
                                   <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-4">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Hero Section</h2>
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

                                   {/* What We Do Section */}
                                   <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-6">
                                        <div>
                                             <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">What We Do</h2>
                                             
                                             {/* Point Add/Edit Form */}
                                             <form onSubmit={handleAddOrEditWhat} className="space-y-4 border-b border-gray-100 pb-6 mb-6">
                                                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                       {editingWhatIndex !== null ? "Edit Point" : "Add New Point"}
                                                  </h3>
                                                  <div>
                                                       <label className={labelClass}>Point Highlight Text</label>
                                                       <input
                                                            type="text"
                                                            value={whatWeDoText}
                                                            onChange={(e) => setWhatWeDoText(e.target.value)}
                                                            className={inputClass}
                                                            placeholder="e.g. 100% PLACEMENT ASSISTANCE"
                                                            required
                                                       />
                                                  </div>
                                                  <div>
                                                       <label className={labelClass}>Point Icon/Image</label>
                                                       <div className="w-full border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/10 transition relative">
                                                            <input
                                                                 type="file"
                                                                 accept="image/*"
                                                                 onChange={(e) => {
                                                                      const selectedFile = e.target.files[0];
                                                                      if (selectedFile) {
                                                                           setWhatWeDoFile(selectedFile);
                                                                           setWhatWeDoPreviewUrl(URL.createObjectURL(selectedFile));
                                                                      }
                                                                 }}
                                                                 className="absolute inset-0 opacity-0 cursor-pointer"
                                                            />
                                                            {whatWeDoPreviewUrl ? (
                                                                 <div className="flex flex-col items-center gap-1.5">
                                                                      <img src={whatWeDoPreviewUrl} className="h-10 max-w-full object-contain rounded border p-0.5 bg-white" alt="" />
                                                                      <p className="text-[10px] text-gray-500 truncate max-w-[180px]">
                                                                           {whatWeDoFile ? whatWeDoFile.name : "Uploaded Image"}
                                                                      </p>
                                                                 </div>
                                                            ) : (
                                                                 <div className="flex flex-col items-center gap-1">
                                                                      <HiOutlineUpload className="text-gray-400 w-5 h-5" />
                                                                      <span className="text-xs text-gray-500 font-medium">Select Point Icon</span>
                                                                 </div>
                                                            )}
                                                       </div>
                                                  </div>
                                                  <div className="flex gap-2">
                                                       <button
                                                            type="submit"
                                                            disabled={whatUploading}
                                                            className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-355 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                                                       >
                                                            {whatUploading ? "Uploading..." : (editingWhatIndex !== null ? "Update Point" : "Add Point")}
                                                       </button>
                                                       {editingWhatIndex !== null && (
                                                            <button
                                                                 type="button"
                                                                 onClick={() => {
                                                                      setEditingWhatIndex(null);
                                                                      setWhatWeDoText("");
                                                                      setWhatWeDoFile(null);
                                                                      setWhatWeDoPreviewUrl("");
                                                                 }}
                                                                 className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-655 rounded-lg text-sm"
                                                            >
                                                                 Cancel
                                                            </button>
                                                       )}
                                                  </div>
                                             </form>

                                             {/* Point List */}
                                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Highlights List ({whatWeDoPoints.length})</h3>
                                             {whatWeDoPoints.length === 0 ? (
                                                  <p className="text-sm text-gray-400 text-center py-4">No points added. Add up to 3 highlights.</p>
                                             ) : (
                                                  <div className="space-y-3">
                                                       {whatWeDoPoints.map((item, index) => (
                                                            <div key={index} className="flex items-center justify-between border border-gray-150 rounded-lg p-3 bg-gray-50/50">
                                                                 <div className="flex items-center gap-3">
                                                                      <img src={item.image} className="w-8 h-8 object-contain bg-white rounded border p-0.5" alt="" />
                                                                      <span className="text-sm text-gray-700 font-medium">{item.text}</span>
                                                                 </div>
                                                                 <div className="flex gap-1 shrink-0">
                                                                      <button
                                                                           onClick={() => handleEditWhat(index)}
                                                                           className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition cursor-pointer"
                                                                      >
                                                                           <HiOutlinePencil className="w-4 h-4" />
                                                                      </button>
                                                                      <button
                                                                           onClick={() => handleDeleteWhat(index)}
                                                                           className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                                                                      >
                                                                           <HiOutlineTrash className="w-4 h-4" />
                                                                      </button>
                                                                 </div>
                                                            </div>
                                                       ))}
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                              </div>

                              {/* Our Programs Settings */}
                              <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-4">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Our Programs Settings</h2>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                             <label className={labelClass}>Start Title (Normal Text)</label>
                                             <input
                                                  type="text"
                                                  value={ourProgramsStart}
                                                  onChange={(e) => setOurProgramsStart(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Explore Our"
                                             />
                                        </div>
                                        <div>
                                             <label className={labelClass}>End Title (Highlighted/Orange Text)</label>
                                             <input
                                                  type="text"
                                                  value={ourProgramsEnd}
                                                  onChange={(e) => setOurProgramsEnd(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Programs"
                                             />
                                        </div>
                                   </div>
                              </div>
                         </div>
                    )}

                    {activeTab === "howitworks" && (
                         <div className="space-y-8">
                              {/* Title Settings */}
                              <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-4">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">How It Works Title Settings</h2>
                                   <div>
                                        <label className={labelClass}>Section Title</label>
                                        <input
                                             type="text"
                                             value={howItWorksTitle}
                                             onChange={(e) => setHowItWorksTitle(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. How It Works"
                                        />
                                   </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                   {/* Form to Add/Edit */}
                                   <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm h-fit">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                                             {editingHowIndex !== null ? "Edit Step" : "Add Step"}
                                        </h2>
                                        <form onSubmit={handleAddOrEditHow} className="space-y-4">
                                             <div>
                                                  <label className={labelClass}>Step Title</label>
                                                  <input
                                                       type="text"
                                                       value={howTitle}
                                                       onChange={(e) => setHowTitle(e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. Choose your course"
                                                       required
                                                  />
                                             </div>
                                             <div>
                                                  <label className={labelClass}>Step Description</label>
                                                  <textarea
                                                       value={howDesc}
                                                       onChange={(e) => setHowDesc(e.target.value)}
                                                       className={`${inputClass} min-h-24 resize-none`}
                                                       placeholder="Describe what happens in this step..."
                                                       required
                                                  />
                                             </div>
                                             <button
                                                  type="submit"
                                                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                                             >
                                                  <HiOutlinePlus />
                                                  {editingHowIndex !== null ? "Update Step" : "Add Step"}
                                             </button>
                                             {editingHowIndex !== null && (
                                                  <button
                                                       type="button"
                                                       onClick={() => {
                                                            setEditingHowIndex(null);
                                                            setHowTitle("");
                                                            setHowDesc("");
                                                       }}
                                                       className="w-full bg-gray-100 hover:bg-gray-200 text-gray-650 font-semibold py-2 rounded-lg transition-colors text-sm"
                                                  >
                                                       Cancel Edit
                                                  </button>
                                             )}
                                        </form>
                                   </div>

                                   {/* List view */}
                                   <div className="lg:col-span-2 space-y-4">
                                        <h2 className="text-lg font-bold text-gray-800">Steps List ({howItWorks.length})</h2>
                                        {howItWorks.length === 0 ? (
                                             <div className="bg-white rounded-xl border border-gray-150 p-10 text-center text-gray-400">
                                                  No steps added yet. Use the form to add some.
                                             </div>
                                        ) : (
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  {howItWorks.map((item, index) => (
                                                       <div key={index} className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
                                                            <div>
                                                                 <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Step {index + 1}</span>
                                                                 <h3 className="font-bold text-gray-850 mt-2">{item.title}</h3>
                                                                 <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{item.description}</p>
                                                            </div>
                                                            <div className="flex gap-2 mt-4 border-t border-gray-100 pt-3">
                                                                 <button
                                                                      onClick={() => handleEditHow(index)}
                                                                      className="flex items-center gap-1 text-xs text-orange-500 hover:bg-orange-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold"
                                                                 >
                                                                      <HiOutlinePencil /> Edit
                                                                 </button>
                                                                 <button
                                                                      onClick={() => handleDeleteHow(index)}
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
                         </div>
                    )}

                    {activeTab === "community" && (
                         <div className="space-y-8">
                              {/* Heading Settings */}
                              <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-4">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Community Heading Settings</h2>
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                             <label className={labelClass}>Start Title</label>
                                             <input
                                                  type="text"
                                                  value={communityStartTitle}
                                                  onChange={(e) => setCommunityStartTitle(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Creating A Community Of"
                                             />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Mid Title (Highlighted/Orange)</label>
                                             <input
                                                  type="text"
                                                  value={communityMidTitle}
                                                  onChange={(e) => setCommunityMidTitle(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Life Long"
                                             />
                                        </div>
                                        <div>
                                             <label className={labelClass}>End Title</label>
                                             <input
                                                  type="text"
                                                  value={communityEndTitle}
                                                  onChange={(e) => setCommunityEndTitle(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Learners"
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <label className={labelClass}>Section Description</label>
                                        <textarea
                                             value={communityDesc}
                                             onChange={(e) => setCommunityDesc(e.target.value)}
                                             className={`${inputClass} min-h-20 resize-none`}
                                             placeholder="Enter section description..."
                                        />
                                   </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                   {/* Form to Add/Edit */}
                                   <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm h-fit">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                                             {editingCommIndex !== null ? "Edit Item" : "Add Item"}
                                        </h2>
                                        <form onSubmit={handleAddOrEditComm} className="space-y-4">
                                             <div>
                                                  <label className={labelClass}>Title</label>
                                                  <input
                                                       type="text"
                                                       value={commTitle}
                                                       onChange={(e) => setCommTitle(e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. Design Labs"
                                                       required
                                                  />
                                             </div>
                                             <div>
                                                  <label className={labelClass}>Description</label>
                                                  <textarea
                                                       value={commDesc}
                                                       onChange={(e) => setCommDesc(e.target.value)}
                                                       className={`${inputClass} min-h-24 resize-none`}
                                                       placeholder="Describe this community highlight..."
                                                       required
                                                  />
                                             </div>
                                             <button
                                                  type="submit"
                                                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                                             >
                                                  <HiOutlinePlus />
                                                  {editingCommIndex !== null ? "Update Item" : "Add Item"}
                                             </button>
                                             {editingCommIndex !== null && (
                                                  <button
                                                       type="button"
                                                       onClick={() => {
                                                            setEditingCommIndex(null);
                                                            setCommTitle("");
                                                            setCommDesc("");
                                                       }}
                                                       className="w-full bg-gray-100 hover:bg-gray-200 text-gray-650 font-semibold py-2 rounded-lg transition-colors text-sm"
                                                  >
                                                       Cancel Edit
                                                  </button>
                                             )}
                                        </form>
                                   </div>

                                   {/* List view */}
                                   <div className="lg:col-span-2 space-y-4">
                                        <h2 className="text-lg font-bold text-gray-800">Community Highlights ({community.length})</h2>
                                        {community.length === 0 ? (
                                             <div className="bg-white rounded-xl border border-gray-150 p-10 text-center text-gray-400">
                                                  No community items added yet. Use the form to add some.
                                             </div>
                                        ) : (
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  {community.map((item, index) => (
                                                       <div key={index} className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
                                                            <div>
                                                                 <h3 className="font-bold text-gray-850 mt-1">{item.title}</h3>
                                                                 <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{item.description}</p>
                                                            </div>
                                                            <div className="flex gap-2 mt-4 border-t border-gray-100 pt-3">
                                                                 <button
                                                                      onClick={() => handleEditComm(index)}
                                                                      className="flex items-center gap-1 text-xs text-orange-500 hover:bg-orange-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold"
                                                                 >
                                                                      <HiOutlinePencil /> Edit
                                                                 </button>
                                                                 <button
                                                                      onClick={() => handleDeleteComm(index)}
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
                         </div>
                    )}

                    {activeTab === "communitybar" && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              {/* Form to Add/Edit */}
                              <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm h-fit">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                                        {editingBarIndex !== null ? "Edit Bar Item" : "Add Bar Item"}
                                   </h2>
                                   <form onSubmit={handleAddOrEditBar} className="space-y-4">
                                        <div>
                                             <label className={labelClass}>Title</label>
                                             <input
                                                  type="text"
                                                  value={barTitle}
                                                  onChange={(e) => setBarTitle(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. 50+ Mentors"
                                                  required
                                             />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Description</label>
                                             <textarea
                                                  value={barDesc}
                                                  onChange={(e) => setBarDesc(e.target.value)}
                                                  className={`${inputClass} min-h-20 resize-none`}
                                                  placeholder="Describe this bar highlight item..."
                                                  required
                                             />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Icon / Image</label>
                                             <div className="w-full border border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/10 transition relative">
                                                  <input
                                                       type="file"
                                                       accept="image/*"
                                                       onChange={(e) => {
                                                            const selectedFile = e.target.files[0];
                                                            if (selectedFile) {
                                                                 setBarFile(selectedFile);
                                                                 setBarPreviewUrl(URL.createObjectURL(selectedFile));
                                                            }
                                                       }}
                                                       className="absolute inset-0 opacity-0 cursor-pointer"
                                                  />
                                                  {barPreviewUrl ? (
                                                       <div className="flex flex-col items-center gap-1.5">
                                                            <img src={barPreviewUrl} className="h-12 max-w-full object-contain rounded border p-0.5 bg-white" alt="" />
                                                            <p className="text-[10px] text-gray-500 truncate max-w-[180px]">
                                                                 {barFile ? barFile.name : "Uploaded Image"}
                                                            </p>
                                                       </div>
                                                  ) : (
                                                       <div className="flex flex-col items-center gap-1.5">
                                                            <HiOutlineUpload className="text-gray-400 w-5 h-5" />
                                                            <span className="text-xs text-gray-500 font-medium">Select Bar Icon</span>
                                                       </div>
                                                  )}
                                             </div>
                                        </div>
                                        <button
                                             type="submit"
                                             disabled={barUploading}
                                             className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                                        >
                                             <HiOutlinePlus />
                                             {barUploading ? "Uploading..." : (editingBarIndex !== null ? "Update Item" : "Add Item")}
                                        </button>
                                        {editingBarIndex !== null && (
                                             <button
                                                  type="button"
                                                  onClick={() => {
                                                       setEditingBarIndex(null);
                                                       setBarTitle("");
                                                       setBarDesc("");
                                                       setBarFile(null);
                                                       setBarPreviewUrl("");
                                                  }}
                                                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-650 font-semibold py-2 rounded-lg transition-colors text-sm"
                                             >
                                                  Cancel Edit
                                             </button>
                                        )}
                                   </form>
                              </div>

                              {/* List view */}
                              <div className="lg:col-span-2 space-y-4">
                                   <h2 className="text-lg font-bold text-gray-800">Community Bar Highlights ({communityBar.length})</h2>
                                   {communityBar.length === 0 ? (
                                        <div className="bg-white rounded-xl border border-gray-150 p-10 text-center text-gray-400">
                                             No community bar items added yet. Use the form to add some.
                                        </div>
                                   ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             {communityBar.map((item, index) => (
                                                  <div key={index} className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
                                                       <div className="flex gap-4 items-start">
                                                            {item.image && (
                                                                 <img src={item.image} className="w-12 h-12 object-contain bg-white rounded border p-0.5 shrink-0" alt="" />
                                                            )}
                                                            <div>
                                                                 <h3 className="font-bold text-gray-850 mt-1">{item.title}</h3>
                                                                 <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{item.description}</p>
                                                            </div>
                                                       </div>
                                                       <div className="flex gap-2 mt-4 border-t border-gray-100 pt-3">
                                                            <button
                                                                 onClick={() => handleEditBar(index)}
                                                                 className="flex items-center gap-1 text-xs text-orange-500 hover:bg-orange-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold"
                                                            >
                                                                 <HiOutlinePencil /> Edit
                                                            </button>
                                                            <button
                                                                 onClick={() => handleDeleteBar(index)}
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

                    {activeTab === "extras" && (
                         <div className="space-y-8">
                              {/* Testimonials Title Settings */}
                              <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-4">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Testimonials Header Settings</h2>
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                             <label className={labelClass}>Start Title</label>
                                             <input
                                                  type="text"
                                                  value={testimonialStartTitle}
                                                  onChange={(e) => setTestimonialStartTitle(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. What Our"
                                             />
                                        </div>
                                        <div>
                                             <label className={labelClass}>Mid Title (Highlighted/Orange)</label>
                                             <input
                                                  type="text"
                                                  value={testimonialMidTitle}
                                                  onChange={(e) => setTestimonialMidTitle(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Students"
                                             />
                                        </div>
                                        <div>
                                             <label className={labelClass}>End Title</label>
                                             <input
                                                  type="text"
                                                  value={testimonialEndTitle}
                                                  onChange={(e) => setTestimonialEndTitle(e.target.value)}
                                                  className={inputClass}
                                                  placeholder="e.g. Say About Us"
                                             />
                                        </div>
                                   </div>
                                   <div>
                                        <label className={labelClass}>Description / Subtitle</label>
                                        <textarea
                                             value={testimonialDesc}
                                             onChange={(e) => setTestimonialDesc(e.target.value)}
                                             className={`${inputClass} min-h-20 resize-none`}
                                             placeholder="Enter testimonials description..."
                                        />
                                   </div>
                              </div>

                              {/* Related Blogs Settings */}
                              <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-4">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Related Blogs Header Settings</h2>
                                   <div>
                                        <label className={labelClass}>Section Title</label>
                                        <input
                                             type="text"
                                             value={relatedBlogsTitle}
                                             onChange={(e) => setRelatedBlogsTitle(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. Our Latest Blogs"
                                        />
                                   </div>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
}
