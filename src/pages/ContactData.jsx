import { useEffect, useState } from "react";
import { HiOutlineSave, HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";
import Breadcrumb from "../components/BreadCrumb";
import { getAdminToken } from "../utils/auth.js";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function ContactData() {
     const [loading, setLoading] = useState(true);
     const [saving, setSaving] = useState(false);
     const [activeTab, setActiveTab] = useState("hero");

     // Hero State
     const [heroTitle, setHeroTitle] = useState("");
     const [heroDesc, setHeroDesc] = useState("");

     // Card State
     const [companyName, setCompanyName] = useState("");
     const [address, setAddress] = useState("");
     const [email, setEmail] = useState("");
     const [phone, setPhone] = useState("");
     const [cardImage, setCardImage] = useState("");
     const [cardLink, setCardLink] = useState("");
     const [cardButtonName, setCardButtonName] = useState("");
     const [uploadingCardImg, setUploadingCardImg] = useState(false);

     // Enquiry State
     const [enquiryTitle, setEnquiryTitle] = useState("");
     const [enquiries, setEnquiries] = useState([]);
     const [cardTitle, setCardTitle] = useState("");
     const [buttonName, setButtonName] = useState("");
     const [enquiryImage, setEnquiryImage] = useState("");
     const [buttonLink, setButtonLink] = useState("");
     const [editingEnquiryIndex, setEditingEnquiryIndex] = useState(null);
     const [uploadingEnquiryImg, setUploadingEnquiryImg] = useState(false);

     const fetchContactData = async () => {
          try {
               setLoading(true);
               const res = await fetch(`${API_URL}/contact-data`);
               if (res.ok) {
                    const data = await res.json();
                    
                    setHeroTitle(data.hero?.title || "");
                    setHeroDesc(data.hero?.description || "");
                    
                    setCompanyName(data.card?.companyname || "");
                    setAddress(data.card?.address || "");
                    setEmail(data.card?.email || "");
                    setPhone(data.card?.phone || "");
                    setCardImage(data.card?.image || "");
                    setCardLink(data.card?.link || "");
                    setCardButtonName(data.card?.buttonname || "Get Directions");

                    setEnquiryTitle(data.enquiry?.title || "");
                    setEnquiries(data.enquiry?.values || []);
               }
          } catch (err) {
               console.error("Error fetching contact data:", err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchContactData();
     }, []);

     const uploadFile = async (file) => {
          if (!file) return null;
          try {
               const formData = new FormData();
               formData.append("image", file);
               const res = await fetch(`${API_URL}/upload`, {
                    method: "POST",
                    body: formData
               });
               if (res.ok) {
                    const data = await res.json();
                    return data.url;
               }
          } catch (err) {
               console.error("Error uploading file:", err);
          }
          return null;
     };

     const handleSaveAll = async () => {
          try {
               setSaving(true);
               const payload = {
                    hero: {
                         title: heroTitle,
                         description: heroDesc,
                    },
                    card: {
                         companyname: companyName,
                         address: address,
                         email: email,
                         phone: phone,
                         image: cardImage,
                         link: cardLink,
                         buttonname: cardButtonName,
                    },
                    enquiry: {
                         title: enquiryTitle,
                         values: enquiries.map(item => ({
                              cardtitle: item.cardtitle,
                              buttonname: item.buttonname,
                              image: item.image,
                              butttonlink: item.butttonlink
                         }))
                    }
               };

               const res = await fetch(`${API_URL}/contact-data`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json",
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: JSON.stringify(payload)
               });

               if (res.ok) {
                    alert("Contact Data saved successfully!");
                    fetchContactData();
               } else {
                    alert("Failed to save Contact Data.");
               }
          } catch (err) {
               console.error("Error saving contact data:", err);
               alert("An error occurred while saving.");
          } finally {
               setSaving(false);
          }
     };

     // Array helpers: Enquiries
     const handleAddOrEditEnquiry = (e) => {
          e.preventDefault();
          if (!cardTitle || !buttonName) return;

          if (editingEnquiryIndex !== null) {
               const updated = [...enquiries];
               updated[editingEnquiryIndex] = { 
                    cardtitle: cardTitle, 
                    buttonname: buttonName, 
                    image: enquiryImage, 
                    butttonlink: buttonLink 
               };
               setEnquiries(updated);
               setEditingEnquiryIndex(null);
          } else {
               setEnquiries([...enquiries, { 
                    cardtitle: cardTitle, 
                    buttonname: buttonName, 
                    image: enquiryImage, 
                    butttonlink: buttonLink 
               }]);
          }
          setCardTitle("");
          setButtonName("");
          setEnquiryImage("");
          setButtonLink("");
     };

     const handleEditEnquiry = (index) => {
          const item = enquiries[index];
          setCardTitle(item.cardtitle);
          setButtonName(item.buttonname);
          setEnquiryImage(item.image || "");
          setButtonLink(item.butttonlink || "");
          setEditingEnquiryIndex(index);
     };

     const handleDeleteEnquiry = (index) => {
          setEnquiries(enquiries.filter((_, i) => i !== index));
          if (editingEnquiryIndex === index) {
               setEditingEnquiryIndex(null);
               setCardTitle("");
               setButtonName("");
               setEnquiryImage("");
               setButtonLink("");
          }
     };

     const inputClass = "w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all";
     const labelClass = "block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider";
     const tabBtnClass = (tab) => `px-5 py-3 font-semibold text-sm rounded-lg transition-all ${activeTab === tab ? "bg-orange-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

     if (loading) {
          return (
               <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500 font-medium">Loading Contact Data...</p>
               </div>
          );
     }

     return (
          <div className="bg-gray-50/50 min-h-screen pb-12 font-sans">
               <Breadcrumb />
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-6 lg:px-10 max-w-7xl mx-auto">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Contact Page Content</h1>
                         <p className="text-sm text-gray-500 mt-1">Manage content on the Contact Us page</p>
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
                    <button onClick={() => setActiveTab("hero")} className={tabBtnClass("hero")}>Hero Section</button>
                    <button onClick={() => setActiveTab("card")} className={tabBtnClass("card")}>Company Card</button>
                    <button onClick={() => setActiveTab("enquiries")} className={tabBtnClass("enquiries")}>Enquiries ({enquiries.length})</button>
               </div>

               <div className="px-6 lg:px-10 max-w-7xl mx-auto">
                    {activeTab === "hero" && (
                         <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-4 max-w-4xl">
                              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Hero Section</h2>
                              <div>
                                   <label className={labelClass}>Hero Title</label>
                                   <input
                                        type="text"
                                        value={heroTitle}
                                        onChange={(e) => setHeroTitle(e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Contact Shiksha"
                                   />
                              </div>
                              <div>
                                   <label className={labelClass}>Hero Description</label>
                                   <textarea
                                        value={heroDesc}
                                        onChange={(e) => setHeroDesc(e.target.value)}
                                        className={`${inputClass} min-h-32 resize-none`}
                                        placeholder="Enter hero description..."
                                   />
                              </div>
                         </div>
                    )}

                    {activeTab === "card" && (
                         <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm space-y-4 max-w-4xl">
                              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">Company Registered Details</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div>
                                        <label className={labelClass}>Company Registered Name</label>
                                        <input
                                             type="text"
                                             value={companyName}
                                             onChange={(e) => setCompanyName(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. Shiksha Bootcamp"
                                        />
                                   </div>
                                   <div>
                                        <label className={labelClass}>Map / Direction Link</label>
                                        <input
                                             type="text"
                                             value={cardLink}
                                             onChange={(e) => setCardLink(e.target.value)}
                                             className={inputClass}
                                             placeholder="Google Map Directions URL"
                                        />
                                   </div>
                                   <div>
                                        <label className={labelClass}>Email Address</label>
                                        <input
                                             type="email"
                                             value={email}
                                             onChange={(e) => setEmail(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. contact@shiksha.com"
                                        />
                                   </div>
                                   <div>
                                        <label className={labelClass}>Phone Number</label>
                                        <input
                                             type="text"
                                             value={phone}
                                             onChange={(e) => setPhone(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. +91 99999 99999"
                                        />
                                   </div>
                                   <div>
                                        <label className={labelClass}>Button Display Name</label>
                                        <input
                                             type="text"
                                             value={cardButtonName}
                                             onChange={(e) => setCardButtonName(e.target.value)}
                                             className={inputClass}
                                             placeholder="e.g. Get Directions"
                                        />
                                   </div>
                              </div>
                              <div>
                                   <label className={labelClass}>Company Address</label>
                                   <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className={`${inputClass} min-h-24 resize-none`}
                                        placeholder="Enter company registered address..."
                                   />
                              </div>
                              <div>
                                   <label className={labelClass}>Company Card Image</label>
                                   <div className="flex items-center gap-4 mt-2">
                                        {cardImage && (
                                             <img src={cardImage} alt="Card Preview" className="h-20 w-36 rounded-lg object-cover border border-gray-200" />
                                        )}
                                        <div className="flex flex-col">
                                             <input
                                                  type="file"
                                                  accept="image/*"
                                                  onChange={async (e) => {
                                                       const file = e.target.files[0];
                                                       if (file) {
                                                            setUploadingCardImg(true);
                                                            const url = await uploadFile(file);
                                                            if (url) setCardImage(url);
                                                            setUploadingCardImg(false);
                                                       }
                                                  }}
                                                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                             />
                                             <span className="text-[11px] text-gray-400 mt-1 font-medium">Recommended Ratio: 17:9 (approx. 16:9 / 340x180 px)</span>
                                        </div>
                                   </div>
                                   {uploadingCardImg && <span className="text-xs text-orange-500">Uploading...</span>}
                              </div>
                         </div>
                    )}

                    {activeTab === "enquiries" && (
                         <div className="space-y-6">
                              {/* Title Config */}
                              <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm max-w-4xl mb-6">
                                   <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Enquiries Title Config</h2>
                                   <div className="space-y-1.5 max-w-md">
                                        <label className={labelClass}>Section Heading</label>
                                        <input
                                             type="text"
                                             value={enquiryTitle}
                                             onChange={(e) => setEnquiryTitle(e.target.value)}
                                             placeholder="e.g. Enquiries"
                                             className={inputClass}
                                        />
                                   </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                   {/* Form to Add/Edit */}
                                   <div className="bg-white rounded-xl p-6 border border-gray-150 shadow-sm h-fit">
                                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">
                                             {editingEnquiryIndex !== null ? "Edit Enquiry Card" : "Add Enquiry Card"}
                                        </h2>
                                        <form onSubmit={handleAddOrEditEnquiry} className="space-y-4">
                                             <div>
                                                  <label className={labelClass}>Card Title</label>
                                                  <input
                                                       type="text"
                                                       value={cardTitle}
                                                       onChange={(e) => setCardTitle(e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. About Us"
                                                       required
                                                  />
                                             </div>
                                             <div>
                                                  <label className={labelClass}>Button Display Name</label>
                                                  <input
                                                       type="text"
                                                       value={buttonName}
                                                       onChange={(e) => setButtonName(e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. Know more"
                                                       required
                                                  />
                                             </div>
                                             <div>
                                                  <label className={labelClass}>Button Redirect Link</label>
                                                  <input
                                                       type="text"
                                                       value={buttonLink}
                                                       onChange={(e) => setButtonLink(e.target.value)}
                                                       className={inputClass}
                                                       placeholder="e.g. /about-us"
                                                  />
                                             </div>
                                             <div>
                                                  <label className={labelClass}>Card Icon / Image</label>
                                                  <div className="flex items-center gap-4 mt-2">
                                                       {enquiryImage && (
                                                            <img src={enquiryImage} alt="Enquiry Card Icon" className="h-12 w-12 rounded-lg object-cover border border-gray-200" />
                                                       )}
                                                       <div className="flex flex-col">
                                                            <input
                                                                 type="file"
                                                                 accept="image/*"
                                                                 onChange={async (e) => {
                                                                      const file = e.target.files[0];
                                                                      if (file) {
                                                                           setUploadingEnquiryImg(true);
                                                                           const url = await uploadFile(file);
                                                                           if (url) setEnquiryImage(url);
                                                                           setUploadingEnquiryImg(false);
                                                                      }
                                                                 }}
                                                                 className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                                            />
                                                            <span className="text-[11px] text-gray-400 mt-1 font-medium">Recommended Ratio: 1:1 (Square / 60x60 px)</span>
                                                       </div>
                                                  </div>
                                                  {uploadingEnquiryImg && <span className="text-xs text-orange-500">Uploading...</span>}
                                             </div>
                                             <button
                                                  type="submit"
                                                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm"
                                             >
                                                  <HiOutlinePlus />
                                                  {editingEnquiryIndex !== null ? "Update Card" : "Add Card"}
                                             </button>
                                             {editingEnquiryIndex !== null && (
                                                  <button
                                                       type="button"
                                                       onClick={() => {
                                                            setEditingEnquiryIndex(null);
                                                            setCardTitle("");
                                                            setButtonName("");
                                                            setEnquiryImage("");
                                                            setButtonLink("");
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
                                        <h2 className="text-lg font-bold text-gray-800">Enquiries List ({enquiries.length})</h2>
                                        {enquiries.length === 0 ? (
                                             <div className="bg-white rounded-xl border border-gray-150 p-10 text-center text-gray-400">
                                                  No enquiry cards added yet. Use the form to add some.
                                             </div>
                                        ) : (
                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                  {enquiries.map((item, index) => (
                                                       <div key={index} className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col justify-between">
                                                            <div>
                                                                 <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Card {index + 1}</span>
                                                                 <h3 className="font-bold text-gray-855 mt-2">{item.cardtitle}</h3>
                                                                 <p className="text-sm text-gray-500 mt-1">Button: {item.buttonname} ({item.butttonlink || "No link"})</p>
                                                                 {item.image && (
                                                                      <img src={item.image} alt={item.cardtitle} className="h-10 w-10 rounded-lg object-cover border border-gray-200 mt-2" />
                                                                 )}
                                                            </div>
                                                            <div className="flex gap-2 mt-4 border-t border-gray-100 pt-3">
                                                                 <button
                                                                      onClick={() => handleEditEnquiry(index)}
                                                                      className="flex items-center gap-1 text-xs text-orange-500 hover:bg-orange-50 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold"
                                                                 >
                                                                      <HiOutlinePencil /> Edit
                                                                 </button>
                                                                 <button
                                                                      onClick={() => handleDeleteEnquiry(index)}
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
               </div>
          </div>
     );
}
