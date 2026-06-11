import { useEffect, useState } from "react";
import Editor from "../components/Editor";
import ImageUploader from "../components/ImageUploader";
import Breadcrumb from "../components/BreadCrumb";
import { HiOutlineTrash } from "react-icons/hi";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const emptyHero = { title: "", description: "", points: [""] };
const emptyPageSection = { title: "", description: "", cards: [] };
const emptyPage = {
     help: emptyPageSection,
     location: emptyPageSection,
     why: { title: "", content: "" },
     faq: [{ ques: "", ans: "" }]
};

const normalizeHero = (hero) => ({
     title: hero?.title || "",
     description: hero?.description || "",
     points: Array.isArray(hero?.points) && hero.points.length ? hero.points : [""]
});

const normalizePageSection = (section) => ({
     title: section?.title || "",
     description: section?.description || "",
     cards: Array.isArray(section?.cards) ? section.cards : []
});

const normalizePage = (page) => ({
     help: normalizePageSection(page?.help),
     location: normalizePageSection(page?.location),
     why: {
          title: page?.why?.title || "",
          content: page?.why?.content || ""
     },
     faq: Array.isArray(page?.faq) ? page.faq.map(f => ({ ques: f?.ques || "", ans: f?.ans || "" })) : (page?.faq ? [{ ques: page.faq.ques || "", ans: page.faq.ans || "" }] : [{ ques: "", ans: "" }])

});

const cleanPoints = (points) => points.map((point) => point.trim()).filter(Boolean);

const hasPageContent = (page) => Boolean(
     page?.help?.title ||
     page?.help?.description ||
     page?.help?.cards?.length ||
     page?.location?.title ||
     page?.location?.description ||
     page?.location?.cards?.length ||
     page?.why?.title ||
     page?.why?.content ||
     (page?.faq?.length > 0 && page.faq.some(f => f.ques || f.ans))
);

const stripPageFiles = (page) => ({
     ...page,
     location: {
          ...page.location,
          cards: page.location.cards.map(({ file, ...card }) => ({
               image: card.image || "",
               para: card.para || ""
          }))
     }
});

const getErrorMessage = async (res, fallback) => {
     const data = await res.json().catch(() => ({}));
     return data.error || fallback;
};

export default function Locations() {
     const [locations, setLocations] = useState([]);
     const [locationModal, setLocationModal] = useState(null);
     const [locationForm, setLocationForm] = useState({ title: "", slug: "" });
     const [itemModal, setItemModal] = useState(null);
     const [itemTitle, setItemTitle] = useState("");
     const [itemSeoTitle, setItemSeoTitle] = useState("");
     const [itemSlug, setItemSlug] = useState("");
     const [itemDescription, setItemDescription] = useState("");
     const [itemKeywords, setItemKeywords] = useState("");
     const [heroModal, setHeroModal] = useState(null);
     const [heroForm, setHeroForm] = useState(emptyHero);
     const [pageModal, setPageModal] = useState(null);
     const [pageForm, setPageForm] = useState(emptyPage);
     const [cardModal, setCardModal] = useState(null);
     const [editingCardIndex, setEditingCardIndex] = useState(null);
     const [tempCard, setTempCard] = useState({});
     const [toast, setToast] = useState({ show: false, message: "" });
     const [loadingAction, setLoadingAction] = useState(null);
     const [selectedLocation, setSelectedLocation] = useState("");

     const fetchLocations = async () => {
          const res = await fetch(`${API}/locations`);
          const data = await res.json();
          setLocations(Array.isArray(data) ? data : []);
     };

     useEffect(() => {
          fetchLocations();
     }, []);

     const displayToast = (message) => {
          setToast({ show: true, message });
          setTimeout(() => setToast({ show: false, message: "" }), 3000);
     };

     const saveLocation = async () => {
          if (loadingAction) return;
          setLoadingAction("location");
          const formData = new FormData();
          formData.append("data", JSON.stringify(locationForm));

          const url = locationModal?.location
               ? `${API}/locations/${locationModal.location._id}`
               : `${API}/locations`;

          try {
               const res = await fetch(url, {
                    method: locationModal?.location ? "PUT" : "POST",
                    body: formData
               });

               if (!res.ok) {
                    displayToast(await getErrorMessage(res, "Location save failed."));
                    return;
               }

               setLocationModal(null);
               await fetchLocations();
               displayToast("Location saved successfully!");
          } finally {
               setLoadingAction(null);
          }
     };

     const deleteLocation = async (locationId) => {
          await fetch(`${API}/locations/${locationId}`, { method: "DELETE" });
          await fetchLocations();
          displayToast("Location deleted successfully!");
     };

     const openLocationModal = (location = null) => {
          setLocationModal({ location });
          setLocationForm({
               title: location?.title || "",
               slug: location?.slug || ""
          });
     };

     const openItemModal = (location, item = null) => {
          setItemModal({ location, item });
          setItemTitle(item?.title || "");
          setItemSeoTitle(item?.seoTitle || "");
          setItemSlug(item?.slug || "");
          setItemDescription(item?.description || "");
          setItemKeywords(Array.isArray(item?.keywords) ? item.keywords.join(", ") : (item?.keywords || ""));
          setSelectedLocation(location._id);
     };

     const saveItem = async () => {
          if (loadingAction) return;
          if (!selectedLocation) {
               displayToast("Please select a location.");
               return;
          }
          setLoadingAction("item");
          const existing = itemModal.item || {};
          const payload = {
               _id: existing._id,
               title: itemTitle,
               slug: itemSlug,
               seoTitle: itemSeoTitle,
               description: itemDescription,
               keywords: itemKeywords,
               hero: existing.hero || {},
               page: existing.page || {}
          };

          const formData = new FormData();
          formData.append("data", JSON.stringify(payload));

          try {
               if (existing._id && selectedLocation !== itemModal.location._id) {
                    // Move item to new location: delete from old, add to new
                    await fetch(`${API}/locations/${itemModal.location._id}/items/${existing._id}`, { method: "DELETE" });
                    const addRes = await fetch(`${API}/locations/${selectedLocation}/items`, {
                         method: "POST",
                         body: formData
                    });
                    if (!addRes.ok) {
                         displayToast(await getErrorMessage(addRes, "Item move failed."));
                         return;
                    }
               } else {
                    const url = existing._id
                         ? `${API}/locations/${selectedLocation}/items/${existing._id}`
                         : `${API}/locations/${selectedLocation}/items`;
                    const res = await fetch(url, {
                         method: existing._id ? "PUT" : "POST",
                         body: formData
                    });
                    if (!res.ok) {
                         displayToast(await getErrorMessage(res, "Item save failed."));
                         return;
                    }
               }

               setItemModal(null);
               await fetchLocations();
               displayToast("Item saved successfully!");
          } finally {
               setLoadingAction(null);
          }
     };

     const deleteItem = async (locationId, itemId) => {
          await fetch(`${API}/locations/${locationId}/items/${itemId}`, { method: "DELETE" });
          await fetchLocations();
          displayToast("Item deleted successfully!");
     };

     const openHeroModal = (location, item) => {
          setHeroModal({ location, item });
          setHeroForm(normalizeHero(item.hero));
     };

     const saveHero = async () => {
          if (loadingAction) return;
          setLoadingAction("hero");
          const payload = {
               _id: heroModal.item._id,
               title: heroModal.item.title,
               slug: heroModal.item.slug,
               description: heroModal.item.description,
               hero: {
                    ...heroForm,
                    points: cleanPoints(heroForm.points)
               },
               page: heroModal.item.page || {}
          };

          const formData = new FormData();
          formData.append("data", JSON.stringify(payload));

          try {
               await fetch(`${API}/locations/${heroModal.location._id}/items/${heroModal.item._id}`, {
                    method: "PUT",
                    body: formData
               });

               setHeroModal(null);
               await fetchLocations();
               displayToast("Hero saved successfully!");
          } finally {
               setLoadingAction(null);
          }
     };

     const openPageModal = (location, item) => {
          setPageModal({ location, item });
          setPageForm(normalizePage(item.page));
     };

     const savePage = async (updatedPage = pageForm) => {
          if (loadingAction) return;
          setLoadingAction("page");
          const payload = {
               _id: pageModal.item._id,
               title: pageModal.item.title,
               slug: pageModal.item.slug,
               description: pageModal.item.description,
               hero: pageModal.item.hero || {},
               page: stripPageFiles(updatedPage)
          };

          const formData = new FormData();
          formData.append("data", JSON.stringify(payload));

          updatedPage.location.cards.forEach((card, index) => {
               if (card.file instanceof File) {
                    formData.append("locationImages", card.file);
                    formData.append("locationImageIndex", index);
               }
          });

          try {
               await fetch(`${API}/locations/${pageModal.location._id}/items/${pageModal.item._id}`, {
                    method: "PUT",
                    body: formData
               });

               setPageModal(null);
               await fetchLocations();
               displayToast("Page saved successfully!");
          } finally {
               setLoadingAction(null);
          }
     };

     const deletePageCard = (section, index) => {
          const updated = {
               ...pageForm,
               [section]: {
                    ...pageForm[section],
                    cards: pageForm[section].cards.filter((_, cardIndex) => cardIndex !== index)
               }
          };

          setPageForm(updated);
     };

     const openCardModal = (section, card = null, index = null) => {
          setCardModal(section);
          setEditingCardIndex(index);
          setTempCard(card ? { ...card } : section === "help" ? { head: "", subhead: "", para: "" } : { image: "", para: "" });
     };

     const closeCardModal = () => {
          setCardModal(null);
          setEditingCardIndex(null);
          setTempCard({});
     };

     const savePageCard = () => {
          const cards = editingCardIndex === null
               ? [...pageForm[cardModal].cards, tempCard]
               : pageForm[cardModal].cards.map((card, index) => (
                    index === editingCardIndex ? tempCard : card
               ));

          const updated = {
               ...pageForm,
               [cardModal]: {
                    ...pageForm[cardModal],
                    cards
               }
          };

          setPageForm(updated);
          closeCardModal();
     };

     const updateHeroPoint = (index, value) => {
          const points = [...heroForm.points];
          points[index] = value;
          setHeroForm({ ...heroForm, points });
     };

     const updateFaq = (index, field, value) => {
          const faq = [...pageForm.faq];
          faq[index] = { ...faq[index], [field]: value };
          setPageForm({ ...pageForm, faq });
     };

     const addFaq = () => {
          setPageForm({ ...pageForm, faq: [...pageForm.faq, { ques: "", ans: "" }] });
     };

     const deleteFaq = (index) => {
          setPageForm({ ...pageForm, faq: pageForm.faq.filter((_, i) => i !== index) });
     };

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
               <Breadcrumb />
               <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                         <div>
                              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Location Manager</h1>
                              <p className="text-gray-500 text-sm mt-1">Manage location groups, campus items, hero details, and branch pages.</p>
                         </div>

                         <button
                              onClick={() => openLocationModal()}
                              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0"
                         >
                              <span>Add Location</span>
                         </button>
                    </div>

                    <div className="space-y-6">
                         {locations.map((location) => (
                              <div key={location._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-4">
                                        <h2 className="text-lg font-bold text-gray-900">{location.title || "Untitled Location"}</h2>

                                        <div className="flex items-center gap-2">
                                             <button onClick={() => openItemModal(location)} className="bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-100 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer">
                                                  + Add Item
                                             </button>
                                             <button onClick={() => openLocationModal(location)} className="bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer">
                                                  Edit
                                             </button>
                                             <button onClick={() => deleteLocation(location._id)} className="bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer">
                                                  Delete
                                             </button>
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {(location.items || []).map((item) => (
                                             <div key={item._id} className="border border-gray-200 bg-gray-50/50 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                                                  <div>
                                                       <div className="flex items-start justify-between gap-3 mb-2">
                                                            <h3 className="font-bold text-gray-900 text-sm">{item.title || "Untitled Item"}</h3>
                                                            <button onClick={() => openItemModal(location, item)} className="text-orange-600 hover:text-orange-700 text-xs font-bold cursor-pointer">
                                                                 Edit
                                                            </button>
                                                       </div>
                                                       {item.description && (
                                                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                                                       )}
                                                       <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-500 bg-white border border-gray-100 px-2.5 py-1 rounded-lg w-fit">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                                                            <span>{item.hero?.title ? "Hero Active" : "Hero Pending"}</span>
                                                            <span className="text-gray-300">|</span>
                                                            <span>{hasPageContent(item.page) ? "Page Configured" : "Page Pending"}</span>
                                                       </div>
                                                  </div>

                                                  <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100">
                                                       <button onClick={() => openHeroModal(location, item)} className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-orange-100 cursor-pointer text-center">
                                                            Hero
                                                       </button>
                                                       <button onClick={() => openPageModal(location, item)} className="flex-1 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-purple-100 cursor-pointer text-center">
                                                            Page Content
                                                       </button>
                                                       <button onClick={() => deleteItem(location._id, item._id)} className="p-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-500 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center">
                                                            <HiOutlineTrash className="w-4 h-4" />
                                                       </button>
                                                  </div>
                                             </div>
                                        ))}

                                        {(!location.items || location.items.length === 0) && (
                                             <div className="col-span-full border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 bg-gray-50/20 text-xs">
                                                  No branch items added yet. Click "+ Add Item" to register branches.
                                             </div>
                                        )}
                                   </div>
                              </div>
                         ))}
                    </div>

                    {locationModal && (
                         <Modal title={locationModal.location ? "Edit Location Group" : "Add Location Group"} onClose={() => setLocationModal(null)}>
                              <div className="space-y-4">
                                   <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Group Name</label>
                                        <input value={locationForm.title} onChange={(e) => setLocationForm({ ...locationForm, title: e.target.value })} placeholder="e.g. Bangalore" className={inputClass} required />
                                   </div>
                              </div>
                              <ModalActions onCancel={() => setLocationModal(null)} onSave={saveLocation} loading={loadingAction === "location"} />
                         </Modal>
                    )}

                    {itemModal && (
                         <Modal title={itemModal.item ? "Edit Location Item" : "Add Location Item"} onClose={() => setItemModal(null)}>
                              <div className="space-y-4">
                                   <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Parent Location Group</label>
                                        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className={`${inputClass} cursor-pointer`}>
                                             <option value="">Select Location</option>
                                             {locations.map(loc => <option className="cursor-pointer" key={loc._id} value={loc._id}>{loc.title}</option>)}
                                        </select>
                                   </div>
                                   <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Branch Title</label>
                                        <input value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} placeholder="e.g. Shiksha Indira Nagar" className={inputClass} required />
                                   </div>
                                   <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">SEO Title</label>
                                        <input value={itemSeoTitle} onChange={(e) => setItemSeoTitle(e.target.value)} placeholder="SEO Optimized Page Title" className={inputClass} />
                                   </div>
                                   <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">URL Slug / Path</label>
                                        <input value={itemSlug} onChange={(e) => setItemSlug(e.target.value)} placeholder="e.g. indiranagar-bangalore" className={inputClass} required />
                                   </div>
                                   <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Branch Description</label>
                                        <textarea value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="Brief summary of campus location..." rows={3} className={textareaClass} />
                                   </div>
                                   <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">SEO Keywords</label>
                                        <input value={itemKeywords} onChange={(e) => setItemKeywords(e.target.value)} placeholder="e.g. learning center, ui ux school, indiranagar" className={inputClass} />
                                   </div>
                              </div>
                              <ModalActions onCancel={() => setItemModal(null)} onSave={saveItem} loading={loadingAction === "item"} />
                         </Modal>
                    )}

                    {heroModal && (
                         <Modal title="Configure Branch Hero Section" onClose={() => setHeroModal(null)}>
                              <div className="space-y-4">
                                   <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Hero Banner Title</label>
                                        <input value={heroForm.title} onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })} placeholder="e.g. Best UI/UX Courses in Indiranagar" className={inputClass} />
                                   </div>
                                   <div className="space-y-1.5">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Hero Description</label>
                                        <textarea value={heroForm.description} onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })} placeholder="Write hero paragraph intro..." rows={3} className={textareaClass} />
                                   </div>

                                   <div className="space-y-2 border-t border-gray-100 pt-3">
                                        <div className="flex justify-between items-center mb-1">
                                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Key Highlights / Points</label>
                                             <button onClick={() => setHeroForm({ ...heroForm, points: [...heroForm.points, ""] })} className="text-xs font-bold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer">
                                                  + Add Highlight
                                             </button>
                                        </div>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                             {heroForm.points.map((point, index) => (
                                                  <input key={index} value={point} onChange={(e) => updateHeroPoint(index, e.target.value)} placeholder={`Highlight bullet point #${index + 1}`} className={inputClass} />
                                             ))}
                                        </div>
                                   </div>
                              </div>

                              <ModalActions onCancel={() => setHeroModal(null)} onSave={saveHero} loading={loadingAction === "hero"} />
                         </Modal>
                    )}

                    {pageModal && (
                         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start z-50 p-4 overflow-y-auto">
                              <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl my-6 flex flex-col justify-between">
                                   <div className="sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-2xl px-6 py-4 flex justify-between items-center shrink-0">
                                        <div>
                                             <h3 className="text-lg font-bold text-gray-900">Branch Subpage Content Builder</h3>
                                             <p className="text-xs text-gray-400 mt-0.5">Build content blocks, choose us statements, and regional FAQs.</p>
                                        </div>
                                        <div className="flex gap-3">
                                             <button onClick={() => setPageModal(null)} className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">Cancel</button>
                                             <button disabled={loadingAction === "page"} onClick={() => savePage(pageForm)} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-200 transition-all cursor-pointer disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center gap-2">
                                                  {loadingAction === "page" && <Spinner />}
                                                  {loadingAction === "page" ? "Saving Changes..." : "Save Page Content"}
                                             </button>
                                        </div>
                                   </div>

                                   <div className="p-6 lg:p-8 space-y-8 overflow-y-auto">
                                        <PageSection title="Help & Support Section" data={pageForm.help} onChange={(val) => setPageForm({ ...pageForm, help: val })} onAdd={() => openCardModal("help")}>
                                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                  {pageForm.help.cards.map((card, index) => (
                                                       <Card key={index}>
                                                            <h4 className="text-sm font-bold text-gray-900 mb-1">{card.head}</h4>
                                                            <p className="text-xs font-semibold text-orange-600 mb-3">{card.subhead}</p>
                                                            <p className="text-xs text-gray-400 leading-normal line-clamp-4">{card.para}</p>
                                                            <EditBtn onClick={() => openCardModal("help", card, index)} />
                                                            <DeleteBtn onClick={() => deletePageCard("help", index)} />
                                                       </Card>
                                                  ))}
                                             </div>
                                        </PageSection>

                                        <PageSection title="Services Section" data={pageForm.location} onChange={(val) => setPageForm({ ...pageForm, location: val })} onAdd={() => openCardModal("location")}>
                                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                  {pageForm.location.cards.map((card, index) => (
                                                       <Card key={index}>
                                                            {card.image || card.file ? (
                                                                 <div className="aspect-16/10 w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-100 p-1 mb-3">
                                                                      <img src={card.file instanceof File ? URL.createObjectURL(card.file) : card.image} className="w-full h-full object-cover rounded" alt="Location" />
                                                                 </div>
                                                            ) : (
                                                                 <div className="aspect-16/10 w-full bg-gray-50 rounded-lg mb-3 flex items-center justify-center border border-dashed border-gray-200">
                                                                      <span className="text-gray-400 text-xs">No Image Selected</span>
                                                                 </div>
                                                            )}
                                                            <p className="text-xs text-gray-500 leading-normal line-clamp-3">{card.para}</p>
                                                            <EditBtn onClick={() => openCardModal("location", card, index)} />
                                                            <DeleteBtn onClick={() => deletePageCard("location", index)} />
                                                       </Card>
                                                  ))}
                                             </div>
                                        </PageSection>

                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                                             <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Why Choose Us Section</h2>
                                             <div className="space-y-1.5">
                                                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Section Title</label>
                                                  <input value={pageForm.why.title} onChange={(e) => setPageForm({ ...pageForm, why: { ...pageForm.why, title: e.target.value } })} placeholder="e.g. Why Join Shiksha Indira Nagar" className={inputClass} />
                                             </div>
                                             <div className="space-y-1.5 pt-2">
                                                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Rich Text Content Editor</label>
                                                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                                       <Editor value={pageForm.why.content} onChange={(val) => setPageForm({ ...pageForm, why: { ...pageForm.why, content: val } })} />
                                                  </div>
                                             </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                                             <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                                                  <h2 className="text-base font-bold text-gray-900">Regional FAQ Section</h2>
                                                  <button onClick={addFaq} className="text-xs font-bold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-100 transition-colors cursor-pointer">
                                                       + Add FAQ
                                                  </button>
                                             </div>
                                             <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                                                  {pageForm.faq.map((faq, index) => (
                                                       <div key={index} className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 relative space-y-3 pt-8">
                                                            <div className="space-y-1">
                                                                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Question #{index + 1}</label>
                                                                 <input value={faq.ques} onChange={(e) => updateFaq(index, 'ques', e.target.value)} placeholder="e.g. Are offline classes available?" className={inputClass} />
                                                            </div>
                                                            <div className="space-y-1">
                                                                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Answer #{index + 1}</label>
                                                                 <input value={faq.ans} onChange={(e) => updateFaq(index, 'ans', e.target.value)} placeholder="Write FAQ answer..." className={inputClass} />
                                                            </div>
                                                            <button onClick={() => deleteFaq(index)} className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all cursor-pointer" title="Delete FAQ">
                                                                 <HiOutlineTrash className="w-4.5 h-4.5" />
                                                            </button>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    )}

                    {cardModal && (
                         <Modal title={`${editingCardIndex === null ? "Add New" : "Edit"} ${cardModal === "help" ? "Help Card" : "Service Card"}`} onClose={closeCardModal}>
                              {cardModal === "help" && (
                                   <div className="space-y-4">
                                        <div className="space-y-1.5">
                                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Heading</label>
                                             <input value={tempCard.head || ""} placeholder="e.g. 24/7 Mentor Support" className={inputClass} onChange={(e) => setTempCard({ ...tempCard, head: e.target.value })} />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Subheading</label>
                                             <input value={tempCard.subhead || ""} placeholder="e.g. Online Chat" className={inputClass} onChange={(e) => setTempCard({ ...tempCard, subhead: e.target.value })} />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                                             <textarea value={tempCard.para || ""} placeholder="Description paragraph details..." rows={3} className={textareaClass} onChange={(e) => setTempCard({ ...tempCard, para: e.target.value })} />
                                        </div>
                                   </div>
                              )}

                              {cardModal === "location" && (
                                   <div className="space-y-4">
                                        <div className="space-y-1.5">
                                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Upload Service Image</label>
                                             <ImageUploader initialImage={tempCard.image} setImage={(file) => setTempCard({ ...tempCard, file })} />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                                             <textarea value={tempCard.para || ""} placeholder="Description details..." rows={3} className={textareaClass} onChange={(e) => setTempCard({ ...tempCard, para: e.target.value })} />
                                        </div>
                                   </div>
                              )}

                              <ModalActions onCancel={closeCardModal} onSave={savePageCard} saveLabel="Save Card" />
                         </Modal>
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

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-200";
const textareaClass = `${inputClass} resize-none`;

const Modal = ({ title, onClose, children }) => (
     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3 shrink-0">
                    <h3 className="text-base font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-150 text-gray-500 hover:text-gray-700 hover:bg-gray-250 transition-colors cursor-pointer text-xs font-bold">✕</button>
               </div>
               <div className="space-y-4">{children}</div>
          </div>
     </div>
);

const ModalActions = ({ onCancel, onSave, saveLabel = "Save", loading = false }) => (
     <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2 shrink-0">
          <button disabled={loading} onClick={onCancel} className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50">Cancel</button>
          <button disabled={loading} onClick={onSave} className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-200 transition-all cursor-pointer disabled:bg-orange-300 disabled:cursor-not-allowed flex items-center gap-1.5">
               {loading && <Spinner />}
               <span>{loading ? "Saving..." : saveLabel}</span>
          </button>
     </div>
);

const Spinner = () => (
     <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
);

const PageSection = ({ title, data, onChange, onAdd, children }) => (
     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
               <h2 className="text-base font-bold text-gray-900">{title}</h2>
               <button onClick={onAdd} className="bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-orange-100 transition-colors cursor-pointer">+ Add Card</button>
          </div>

          <div className="space-y-4 mb-6 bg-gray-50/50 p-5 rounded-xl border border-gray-200">
               <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Section Heading</label>
                    <input value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} className={inputClass} placeholder="Enter main section title..." />
               </div>
               <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Section Subtitle / Description</label>
                    <textarea value={data.description} onChange={(e) => onChange({ ...data, description: e.target.value })} rows={2} className={textareaClass} placeholder="Enter brief section description..." />
               </div>
          </div>

          {children}
     </div>
);

const Card = ({ children }) => (
     <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative group hover:shadow-md transition-shadow duration-200">
          {children}
     </div>
);

const EditBtn = ({ onClick }) => (
     <button onClick={onClick} title="Edit Card" className="absolute top-3 right-11 bg-orange-50 text-orange-500 opacity-0 group-hover:opacity-100 hover:bg-orange-500 hover:text-white p-1.5 rounded-lg border border-orange-100 transition-all duration-200 shadow-sm focus:opacity-100 outline-none cursor-pointer">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
     </button>
);

const DeleteBtn = ({ onClick }) => (
     <button onClick={onClick} title="Delete Card" className="absolute top-3 right-3 bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white p-1.5 rounded-lg border border-red-100 transition-all duration-200 shadow-sm focus:opacity-100 outline-none cursor-pointer">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
     </button>
);

