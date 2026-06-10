import { useEffect, useState } from "react";
import { HiOutlineSave, HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function HomeData() {
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [activeTab, setActiveTab] = useState("hero");

     // Hero & What We Do State
     const [heroStart, setHeroStart] = useState("");
     const [heroMid, setHeroMid] = useState("");
     const [heroEnd, setHeroEnd] = useState("");
     const [whatWeDoFirst, setWhatWeDoFirst] = useState("");
     const [whatWeDoSecond, setWhatWeDoSecond] = useState("");
     const [whatWeDoThird, setWhatWeDoThird] = useState("");

     // Array states
     const [howItWorks, setHowItWorks] = useState([]);
     const [community, setCommunity] = useState([]);
     const [communityBar, setCommunityBar] = useState([]);

     // Form inputs for managing array items (How It Works)
     const [howTitle, setHowTitle] = useState("");
     const [howDesc, setHowDesc] = useState("");
     const [editingHowIndex, setEditingHowIndex] = useState(null);

     // Form inputs for managing array items (Community)
     const [commTitle, setCommTitle] = useState("");
     const [commDesc, setCommDesc] = useState("");
     const [editingCommIndex, setEditingCommIndex] = useState(null);

     // Form inputs for managing array items (Community Bar)
     const [barTitle, setBarTitle] = useState("");
     const [barDesc, setBarDesc] = useState("");
     const [editingBarIndex, setEditingBarIndex] = useState(null);

     const fetchHomeData = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API_URL}/home-data`);
               if (res.ok) {
                    const data = await res.json();
                    setHeroStart(data.hero?.startTitle || "");
                    setHeroMid(data.hero?.midTitle || "");
                    setHeroEnd(data.hero?.endTitle || "");
                    setWhatWeDoFirst(data.whatwedo?.firstPoint || "");
                    setWhatWeDoSecond(data.whatwedo?.secondPoint || "");
                    setWhatWeDoThird(data.whatwedo?.thirdPoint || "");
                    setHowItWorks(data.howitworks || []);
                    setCommunity(data.community || []);
                    setCommunityBar(data.communityBar || []);
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
                         firstPoint: whatWeDoFirst,
                         secondPoint: whatWeDoSecond,
                         thirdPoint: whatWeDoThird,
                    },
                    howitworks: howItWorks.map(item => ({ title: item.title, description: item.description })),
                    community: community.map(item => ({ title: item.title, description: item.description })),
                    communityBar: communityBar.map(item => ({ title: item.title, description: item.description }))
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

     // Array helpers: Community Bar
     const handleAddOrEditBar = (e) => {
          e.preventDefault();
          if (!barTitle || !barDesc) return;

          if (editingBarIndex !== null) {
               const updated = [...communityBar];
               updated[editingBarIndex] = { title: barTitle, description: barDesc };
               setCommunityBar(updated);
               setEditingBarIndex(null);
          } else {
               setCommunityBar([...communityBar, { title: barTitle, description: barDesc }]);
          }
          setBarTitle("");
          setBarDesc("");
     };

     const handleEditBar = (index) => {
          const item = communityBar[index];
          setBarTitle(item.title);
          setBarDesc(item.description);
          setEditingBarIndex(index);
     };

     const handleDeleteBar = (index) => {
          setCommunityBar(communityBar.filter((_, i) => i !== index));
          if (editingBarIndex === index) {
               setEditingBarIndex(null);
               setBarTitle("");
               setBarDesc("");
          }
     };

     const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all";
     const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider";
     const tabBtnClass = (tab) => `px-5 py-3 font-semibold text-sm rounded-lg transition-all ${activeTab === tab ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

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
                         className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shrink-0"
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
               </div>

               <div className="px-6 lg:px-10 max-w-7xl mx-auto">
                    {activeTab === "hero" && (
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
                              <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-4">
                                   <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">What We Do</h2>
                                   <div>
                                        <label className={labelClass}>First Point</label>
                                        <input
                                             type="text"
                                             value={whatWeDoFirst}
                                             onChange={(e) => setWhatWeDoFirst(e.target.value)}
                                             className={inputClass}
                                             placeholder="Enter first highlight point"
                                        />
                                   </div>
                                   <div>
                                        <label className={labelClass}>Second Point</label>
                                        <input
                                             type="text"
                                             value={whatWeDoSecond}
                                             onChange={(e) => setWhatWeDoSecond(e.target.value)}
                                             className={inputClass}
                                             placeholder="Enter second highlight point"
                                        />
                                   </div>
                                   <div>
                                        <label className={labelClass}>Third Point</label>
                                        <input
                                             type="text"
                                             value={whatWeDoThird}
                                             onChange={(e) => setWhatWeDoThird(e.target.value)}
                                             className={inputClass}
                                             placeholder="Enter third highlight point"
                                        />
                                   </div>
                              </div>
                         </div>
                    )}

                    {activeTab === "howitworks" && (
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
                                                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg transition-colors text-sm"
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
                    )}

                    {activeTab === "community" && (
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
                                                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-lg transition-colors text-sm"
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
                                                  className={`${inputClass} min-h-24 resize-none`}
                                                  placeholder="Describe this bar highlight item..."
                                                  required
                                             />
                                        </div>
                                        <button
                                             type="submit"
                                             className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                                        >
                                             <HiOutlinePlus />
                                             {editingBarIndex !== null ? "Update Item" : "Add Item"}
                                        </button>
                                        {editingBarIndex !== null && (
                                             <button
                                                  type="button"
                                                  onClick={() => {
                                                       setEditingBarIndex(null);
                                                       setBarTitle("");
                                                       setBarDesc("");
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
                                   <h2 className="text-lg font-bold text-gray-800">Community Bar Highlights ({communityBar.length})</h2>
                                   {communityBar.length === 0 ? (
                                        <div className="bg-white rounded-xl border border-gray-150 p-10 text-center text-gray-400">
                                             No community bar items added yet. Use the form to add some.
                                        </div>
                                   ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             {communityBar.map((item, index) => (
                                                  <div key={index} className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
                                                       <div>
                                                            <h3 className="font-bold text-gray-850 mt-1">{item.title}</h3>
                                                            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{item.description}</p>
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
               </div>
          </div>
     );
}
