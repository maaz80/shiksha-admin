import { useEffect, useState } from "react";
import { getAdminToken } from "../utils/auth.js";
import Breadcrumb from "../components/BreadCrumb.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import Editor from "../components/Editor.jsx";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";

const API_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api").trim().replace(/\/$/, "");

export default function Courses() {
     const [toast, setToast] = useState({ show: false, message: "", type: "success" });
     const showToast = (message, type = "success") => {
          setToast({ show: true, message, type });
          setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
     };

     const [courses, setCourses] = useState([]);
     const [activeTab, setActiveTab] = useState("list");

     const [savingPageTitle, setSavingPageTitle] = useState(false);
     const [showModal, setShowModal] = useState(false);
     const [editIndex, setEditIndex] = useState(null); // stores index in 'courses' array
     const [editItem, setEditItem] = useState(null);
     const [uploading, setUploading] = useState(false);

     // Course Form States
     const [title, setTitle] = useState("");
     const [alt, setAlt] = useState("");
     const [startDate, setStartDate] = useState("");
     const [category, setCategory] = useState("");
     const [overview, setOverview] = useState("");
     const [slug, setSlug] = useState("");
     const [seoTitle, setSeoTitle] = useState("");
     const [seoDescription, setSeoDescription] = useState("");
     const [image, setImage] = useState(null);
     const [schemas, setSchemas] = useState([]);

     // New Promo & Brochure Custom Fields
     const [promoTitle, setPromoTitle] = useState("");
     const [promoDescription, setPromoDescription] = useState("");
     const [promoBenefits, setPromoBenefits] = useState("");
     const [promoSocialBottomContent, setPromoSocialBottomContent] = useState("");
     const [brochureTitle, setBrochureTitle] = useState("");
     const [brochureSubtext, setBrochureSubtext] = useState("");
     const [brochurePhones, setBrochurePhones] = useState("");
     const [brochureLink, setBrochureLink] = useState("");

     // Chapter States
     const [chapters, setChapters] = useState([]);
     const [faqTitle, setFaqTitle] = useState("");
     const [faqStartheading, setFaqStartheading] = useState("");
     const [faqMidheading, setFaqMidheading] = useState("");
     const [faqEndheading, setFaqEndheading] = useState("");
     const [faqDescription, setFaqDescription] = useState("");
     const [faqItems, setFaqItems] = useState([]);

     // Short-Term Courses Section States
     const [shortTermTitle, setShortTermTitle] = useState("");
     const [shortTermDescription, setShortTermDescription] = useState("");
     const [shortTermItems, setShortTermItems] = useState([]);

     // Student Case Studies Section States (Global in Page & Layout Config)
     const [caseStudiesTitle, setCaseStudiesTitle] = useState("");
     const [caseStudiesDescription, setCaseStudiesDescription] = useState("");
     const [caseStudiesButtonText, setCaseStudiesButtonText] = useState("");
     const [caseStudiesItems, setCaseStudiesItems] = useState([]);

     // Career Domains Section States (Global in Page & Layout Config)
     const [careerDomainsTitle, setCareerDomainsTitle] = useState("");
     const [careerDomainsDescription, setCareerDomainsDescription] = useState("");
     const [careerDomainsItems, setCareerDomainsItems] = useState([]);

     // Course Videos Section States
     const [videos, setVideos] = useState([]);
     const [showVideoModal, setShowVideoModal] = useState(false);

     const addVideoItem = () => {
          setVideos(prev => [...prev, { video: "", alt: "", title: "", thumbnail: "", uploading: false, progress: 0, uploadError: "" }]);
     };

     const removeVideoItem = (vIdx) => {
          setVideos(prev => prev.filter((_, idx) => idx !== vIdx));
     };

     const updateVideoItemField = (vIdx, key, value) => {
          setVideos(prev => prev.map((v, idx) => idx === vIdx ? { ...v, [key]: value } : v));
     };

     const uploadVideoFile = (file, onProgress) => {
          return new Promise((resolve, reject) => {
               const xhr = new XMLHttpRequest();
               const formData = new FormData();
               formData.append("video", file);

               xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) {
                         const percent = Math.round((e.loaded / e.total) * 100);
                         onProgress(percent);
                    }
               };

               xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                         try {
                              const response = JSON.parse(xhr.responseText);
                              if (response.url) {
                                   resolve(response.url);
                              } else {
                                   reject(new Error(response.error || "Upload failed"));
                              }
                         } catch (err) {
                              reject(err);
                         }
                    } else {
                         try {
                              const response = JSON.parse(xhr.responseText);
                              reject(new Error(response.error || `Upload failed with status ${xhr.status}`));
                         } catch {
                              reject(new Error(`Upload failed with status ${xhr.status}`));
                         }
                    }
               };

               xhr.onerror = () => {
                    reject(new Error("Network error during video upload"));
               };

               xhr.open("POST", `${API_URL}/courses/video`);
               const token = getAdminToken();
               if (token) {
                    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
               }
               xhr.send(formData);
          });
     };

     const handleVideoFileUpload = async (vIdx, file) => {
          if (!file) return;

          setVideos(prev => prev.map((v, idx) => idx === vIdx ? { ...v, uploading: true, progress: 0, uploadError: "" } : v));

          try {
               const videoUrl = await uploadVideoFile(file, (percent) => {
                    setVideos(prev => prev.map((v, idx) => idx === vIdx ? { ...v, progress: percent } : v));
               });

               setVideos(prev => prev.map((v, idx) => idx === vIdx ? { ...v, video: videoUrl, uploading: false, progress: 100, uploadError: "" } : v));
               showToast("Video uploaded successfully!", "success");
          } catch (err) {
               console.error("Video upload failed:", err);
               setVideos(prev => prev.map((v, idx) => idx === vIdx ? { ...v, uploading: false, uploadError: err.message || "Upload failed" } : v));
               showToast(`Video upload failed: ${err.message || "Upload error"}`, "error");
          }
     };

     const fetchCourses = async () => {
          try {
               const res = await fetch(`${API_URL}/courses`);
               if (res.ok) {
                    const data = await res.json();
                    const list = Array.isArray(data) ? data : (data.course || []);
                    setCourses(list);
               }

               const pageRes = await fetch(`${API_URL}/coursepage-data`);
               if (pageRes.ok) {
                    const pageData = await pageRes.json();
                    if (pageData.caseStudies) {
                         setCaseStudiesTitle(pageData.caseStudies.title || "");
                         setCaseStudiesDescription(pageData.caseStudies.description || "");
                         setCaseStudiesButtonText(pageData.caseStudies.buttonText || "");
                         setCaseStudiesItems(pageData.caseStudies.items || []);
                    }
                    if (pageData.careerDomains) {
                         setCareerDomainsTitle(pageData.careerDomains.title || "");
                         setCareerDomainsDescription(pageData.careerDomains.description || "");
                         setCareerDomainsItems(pageData.careerDomains.items || []);
                    }
               }
          } catch (err) {
               console.error("Error fetching courses data:", err);
          }
     };

     useEffect(() => {
          fetchCourses();
     }, []);

     const saveGlobalConfig = async () => {
          try {
               setSavingPageTitle(true);
               const formData = new FormData();
               const globalCaseStudies = {
                    title: caseStudiesTitle,
                    description: caseStudiesDescription,
                    buttonText: caseStudiesButtonText,
                    items: caseStudiesItems.map(item => ({
                         image: (item.image && item.image instanceof File) ? "" : (item.image || ""),
                         alt: item.alt || "",
                         link: item.link || ""
                    }))
               };
               const globalCareerDomains = {
                    title: careerDomainsTitle,
                    description: careerDomainsDescription,
                    items: careerDomainsItems.map(item => ({
                         name: item.name || "",
                         link: item.link || "",
                         iconName: item.iconName || "",
                         color: item.color || ""
                    }))
               };

               formData.append("data", JSON.stringify({
                    caseStudies: globalCaseStudies,
                    careerDomains: globalCareerDomains,
                    course: courses
               }));

               caseStudiesItems.forEach((item, itemIdx) => {
                    if (item.image && item.image instanceof File) {
                         formData.append(`globalCaseStudy_${itemIdx}`, item.image);
                    }
               });

               const res = await fetch(`${API_URL}/courses`, {
                    method: "PUT",
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: formData
               });
               if (res.ok) {
                    showToast("Global configuration saved successfully!", "success");
                    fetchCourses();
               } else {
                    showToast("Failed to save global configuration.", "error");
               }
          } catch (err) {
               console.error("Error saving global config:", err);
               showToast("Server error occurred.", "error");
          } finally {
               setSavingPageTitle(false);
          }
     };

     const resetForm = () => {
          setTitle("");
          setAlt("");
          setStartDate("");
          setCategory("");
          setOverview("");
          setSlug("");
          setSeoTitle("");
          setSeoDescription("");
          setImage(null);
          setPromoTitle("");
          setPromoDescription("");
          setPromoBenefits("");
          setPromoSocialBottomContent("");
          setBrochureTitle("");
          setBrochureSubtext("");
          setBrochurePhones("");
          setBrochureLink("");
          setShortTermTitle("");
          setShortTermDescription("");
          setShortTermItems([]);
          setChapters([]);
          setFaqTitle("");
          setFaqStartheading("");
          setFaqMidheading("");
          setFaqEndheading("");
          setFaqDescription("");
          setFaqItems([]);
          setSchemas([]);
          setVideos([]);
          setShowVideoModal(false);
          setEditIndex(null);
          setEditItem(null);
     };

     const openUpload = () => {
          resetForm();
          setShowModal(true);
     };

     const openEdit = (course, index) => {
          resetForm();
          setEditIndex(index);
          setEditItem(course);

          setTitle(course.title || "");
          setAlt(course.alt || "");
          setStartDate(course.startdate || "");
          setCategory(course.category || "");
          setOverview(course.overview || "");
          setSlug(course.slug || "");
          setSeoTitle(course.seoTitle || course.seotitle || "");
          setSeoDescription(course.seoDescription || course.seodescription || "");
          setPromoTitle(course.promoTitle || "");
          setPromoDescription(course.promoDescription || "");
          setPromoBenefits(course.promoBenefits || "");
          setPromoSocialBottomContent(course.promoSocialBottomContent || "");
          setBrochureTitle(course.brochureTitle || "");
          setBrochureSubtext(course.brochureSubtext || "");
          setBrochurePhones(course.brochurePhones || "");
          setBrochureLink(course.brochureLink || "");
          setShortTermTitle(course.shortTerm?.title || "");
          setShortTermDescription(course.shortTerm?.description || "");
          setShortTermItems(course.shortTerm?.items || []);
          setSchemas(course.schemas || []);
          setVideos(course.videos || []);

          if (course.chapter) {
               if (Array.isArray(course.chapter)) {
                    setChapters(course.chapter.map(ch => ({
                         chaptername: ch.chaptername || ch.title || "",
                         lessons: Array.isArray(ch.lessons)
                              ? ch.lessons.map(l => ({ lessonname: typeof l === "object" ? (l.lessonname || l.title || "") : l }))
                              : []
                    })));
               } else {
                    setChapters([{
                         chaptername: course.chapter.chaptername || course.chapter.title || "",
                         lessons: Array.isArray(course.chapter.lessons)
                              ? course.chapter.lessons.map(l => ({ lessonname: typeof l === "object" ? (l.lessonname || l.title || "") : l }))
                              : []
                    }]);
               }
          } else if (course.sections && Array.isArray(course.sections)) {
               setChapters(course.sections.map(sec => ({
                    chaptername: sec.title || "",
                    lessons: Array.isArray(sec.lessons)
                         ? sec.lessons.map(l => ({ lessonname: typeof l === "object" ? (l.lessonname || l.title || "") : l }))
                         : []
               })));
          } else {
               setChapters([]);
          }

          const courseFaq = course.faq || [];
          if (Array.isArray(courseFaq)) {
               setFaqItems(courseFaq);
               setFaqTitle("");
               setFaqStartheading("");
               setFaqMidheading("");
               setFaqEndheading("");
               setFaqDescription("");
          } else {
               setFaqTitle(courseFaq.title || "");
               setFaqStartheading(courseFaq.startheading || "");
               setFaqMidheading(courseFaq.midheading || "");
               setFaqEndheading(courseFaq.endheading || "");
               setFaqDescription(courseFaq.description || "");
               setFaqItems(courseFaq.items || []);
          }

          setShowModal(true);
     };

     const addChapter = () => {
          setChapters([...chapters, { chaptername: "", lessons: [] }]);
     };

     const removeChapter = (chapterIdx) => {
          setChapters(chapters.filter((_, idx) => idx !== chapterIdx));
     };

     const updateChapterField = (chapterIdx, key, value) => {
          setChapters(prev => prev.map((ch, idx) => idx === chapterIdx ? { ...ch, [key]: value } : ch));
     };

     const addLesson = (chapterIdx) => {
          setChapters(prev => prev.map((ch, idx) => {
               if (idx === chapterIdx) {
                    return {
                         ...ch,
                         lessons: [...(ch.lessons || []), { lessonname: "" }]
                    };
               }
               return ch;
          }));
     };

     const removeLesson = (chapterIdx, lessonIdx) => {
          setChapters(prev => prev.map((ch, idx) => {
               if (idx === chapterIdx) {
                    return {
                         ...ch,
                         lessons: (ch.lessons || []).filter((_, lIdx) => lIdx !== lessonIdx)
                    };
               }
               return ch;
          }));
     };

     const updateLessonField = (chapterIdx, lessonIdx, key, value) => {
          setChapters(prev => prev.map((ch, idx) => {
               if (idx === chapterIdx) {
                    const updatedLessons = [...(ch.lessons || [])];
                    if (typeof key === "object" && key !== null) {
                         updatedLessons[lessonIdx] = { ...updatedLessons[lessonIdx], ...key };
                    } else {
                         updatedLessons[lessonIdx] = { ...updatedLessons[lessonIdx], [key]: value };
                    }
                    return { ...ch, lessons: updatedLessons };
               }
               return ch;
          }));
     };

     const addShortTermItem = () => {
          setShortTermItems([...shortTermItems, { title: "", description: "", duration: "", iconText: "", image: "", alt: "" }]);
     };

     const removeShortTermItem = (itemIdx) => {
          setShortTermItems(shortTermItems.filter((_, idx) => idx !== itemIdx));
     };

     const updateShortTermItemField = (itemIdx, key, value) => {
          setShortTermItems(prev => prev.map((item, idx) => idx === itemIdx ? { ...item, [key]: value } : item));
     };

     const addCaseStudyItem = () => {
          setCaseStudiesItems([...caseStudiesItems, { image: "", alt: "", link: "" }]);
     };

     const removeCaseStudyItem = (itemIdx) => {
          setCaseStudiesItems(caseStudiesItems.filter((_, idx) => idx !== itemIdx));
     };

     const updateCaseStudyItemField = (itemIdx, key, value) => {
          setCaseStudiesItems(prev => prev.map((item, idx) => idx === itemIdx ? { ...item, [key]: value } : item));
     };

     const addCareerDomainItem = () => {
          setCareerDomainsItems([...careerDomainsItems, { name: "", link: "", iconName: "", color: "" }]);
     };

     const removeCareerDomainItem = (itemIdx) => {
          setCareerDomainsItems(careerDomainsItems.filter((_, idx) => idx !== itemIdx));
     };

     const updateCareerDomainItemField = (itemIdx, key, value) => {
          setCareerDomainsItems(prev => prev.map((item, idx) => idx === itemIdx ? { ...item, [key]: value } : item));
     };

     const saveCourse = async () => {
          setUploading(true);
          try {
               const formData = new FormData();
               formData.append("title", title);
               formData.append("category", category);
               formData.append("name", title);
               formData.append("overview", overview);
               formData.append("slug", slug);
               formData.append("seoTitle", seoTitle || title);
               formData.append("seoDescription", seoDescription || overview);
               formData.append("alt", alt || title);
               formData.append("startdate", startDate);

               formData.append("promoTitle", promoTitle);
               formData.append("promoDescription", promoDescription);
               formData.append("promoBenefits", promoBenefits);
               formData.append("promoSocialBottomContent", promoSocialBottomContent);

               formData.append("brochureTitle", brochureTitle);
               formData.append("brochureSubtext", brochureSubtext);
               formData.append("brochurePhones", brochurePhones);
               formData.append("brochureLink", brochureLink);

               const formattedSections = chapters.map(ch => ({
                    title: ch.chaptername,
                    chaptername: ch.chaptername,
                    lessons: (ch.lessons || []).map(l => ({
                         title: l.lessonname,
                         lessonname: l.lessonname
                    }))
               }));
               formData.append("sections", JSON.stringify(formattedSections));
               formData.append("chapter", JSON.stringify(formattedSections));

               formData.append("faq", JSON.stringify(faqItems));
                
               const formattedVideos = (videos || []).map((v) => {
                    let thumbUrl = (v.thumbnail && typeof v.thumbnail === "string") ? v.thumbnail : "";
                    return {
                         title: v.title || "",
                         alt: v.alt || "",
                         video: typeof v.video === "string" ? v.video : "",
                         thumbnail: thumbUrl
                    };
               });
               formData.append("videos", JSON.stringify(formattedVideos));

               (videos || []).forEach((v, vIdx) => {
                    if (v.thumbnail && (v.thumbnail instanceof File || v.thumbnail instanceof Blob)) {
                         formData.append(`videoThumbnail_${vIdx}`, v.thumbnail);
                    }
               });

               formData.append("shortTerm", JSON.stringify({
                    title: shortTermTitle,
                    description: shortTermDescription,
                    items: shortTermItems.map(item => ({
                         title: item.title || "",
                         description: item.description || "",
                         duration: item.duration || "",
                         iconText: item.iconText || "",
                         image: (item.image && item.image instanceof File) ? "" : (item.image || ""),
                         alt: item.alt || ""
                    }))
               }));

               shortTermItems.forEach((item, itemIdx) => {
                    if (item.image && item.image instanceof File) {
                         formData.append(`shortTerm_${itemIdx}`, item.image);
                    }
               });

               if (image) formData.append("image", image);

               let res;
               if (editItem && editItem._id) {
                    res = await fetch(`${API_URL}/courses/${editItem._id}`, {
                         method: "PUT",
                         headers: {
                              "Authorization": `Bearer ${getAdminToken()}`
                         },
                         body: formData
                    });
               } else {
                    res = await fetch(`${API_URL}/courses`, {
                         method: "POST",
                         headers: {
                              "Authorization": `Bearer ${getAdminToken()}`
                         },
                         body: formData
                    });
               }

               if (res.ok) {
                    showToast(editItem ? "Course updated successfully!" : "Course published successfully!", "success");
                    setShowModal(false);
                    fetchCourses();
               } else {
                    const errData = await res.json();
                    showToast(errData.error || "Failed to save course.", "error");
               }
          } catch (err) {
               console.error("Error saving course:", err);
               showToast("Server error occurred.", "error");
          } finally {
               setUploading(false);
          }
     };

     const deleteCourse = async (index) => {
          const targetCourse = courses[index];
          if (!targetCourse) return;
          if (!window.confirm(`Are you sure you want to delete "${targetCourse.title}"?`)) return;

          try {
               let res;
               if (targetCourse._id) {
                    res = await fetch(`${API_URL}/courses/${targetCourse._id}`, {
                         method: "DELETE",
                         headers: {
                              "Authorization": `Bearer ${getAdminToken()}`
                         }
                    });
               } else {
                    const nextCourses = courses.filter((_, idx) => idx !== index);
                    res = await fetch(`${API_URL}/courses`, {
                         method: "PUT",
                         headers: {
                              "Content-Type": "application/json",
                              "Authorization": `Bearer ${getAdminToken()}`
                         },
                         body: JSON.stringify({
                              course: nextCourses
                         })
                    });
               }

               if (res.ok) {
                    showToast("Course deleted successfully.", "success");
                    fetchCourses();
               } else {
                    showToast("Failed to delete course.", "error");
               }
          } catch (err) {
               console.error("Error deleting course:", err);
               showToast("Server error occurred.", "error");
          }
     };

     const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200";
     const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
               <Breadcrumb />

               {/* Top Navigation / Tabs */}
               <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Course Manager</h1>
                         <p className="text-sm text-gray-500 mt-1">Manage single-document courses and layout metadata.</p>
                    </div>

                    <button
                         onClick={openUpload}
                         className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                         </svg>
                         Add Course
                    </button>
               </div>

               <div className="flex border-b border-gray-200 mb-8 max-w-7xl mx-auto px-6 lg:px-10">
                    <button
                         onClick={() => setActiveTab("list")}
                         className={`pb-4 px-4 text-sm font-semibold transition-all cursor-pointer ${activeTab === "list"
                                   ? "border-b-2 border-primary text-primary"
                                   : "text-gray-400 hover:text-gray-600"
                              }`}
                    >
                         Courses List
                    </button>
                    <button
                         onClick={() => setActiveTab("config")}
                         className={`pb-4 px-4 text-sm font-semibold transition-all cursor-pointer ${activeTab === "config"
                                   ? "border-b-2 border-primary text-primary"
                                   : "text-gray-400 hover:text-gray-600"
                              }`}
                    >
                         Page & Layout Config
                    </button>
               </div>

               {/* TAB CONTENTS */}
               <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {activeTab === "list" ? (
                         /* COURSE LIST TAB */
                         courses.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-32 bg-white border border-gray-200 rounded-2xl text-center shadow-sm">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                   </svg>
                                   <p className="text-lg font-semibold text-gray-800">No courses yet</p>
                                   <p className="text-sm text-gray-450 mt-1">Click "Add Course" above to write your first program</p>
                              </div>
                         ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                   {courses.map((course, index) => (
                                        <div key={course._id || index} className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
                                             <div className="relative overflow-hidden aspect-16/10">
                                                  <img
                                                       src={course.image || "/images/shiksha-design-hero.webp"}
                                                       className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-350"
                                                       alt={course.title}
                                                  />
                                                  {course.category && (
                                                       <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-orange-100 uppercase tracking-wider shadow-sm">
                                                            {course.category}
                                                       </span>
                                                  )}
                                             </div>

                                             <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                                  <div className="space-y-2">
                                                       <h2 className="font-bold text-gray-900 text-base leading-snug line-clamp-2" title={course.title}>
                                                            {course.title}
                                                       </h2>
                                                       <p className="text-xs text-gray-400 line-clamp-3 leading-normal">
                                                            {course.overview}
                                                       </p>
                                                  </div>

                                                  <div className="flex gap-2.5 pt-2">
                                                       <button
                                                            onClick={() => openEdit(course, index)}
                                                            className="flex-1 flex items-center justify-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                                       >
                                                            Edit
                                                       </button>
                                                       <button
                                                            onClick={() => deleteCourse(index)}
                                                            className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                                       >
                                                            Delete
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         )
                    ) : (
                         /* CONFIG CONFIGURATION TAB */
                         <div className="space-y-8">
                              {/* Global Student Portfolios (Case Studies) Config */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                   <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 font-sans">1. Global Student Portfolios (Case Studies) Section</h2>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Section Title</label>
                                             <input
                                                  value={caseStudiesTitle}
                                                  onChange={(e) => setCaseStudiesTitle(e.target.value)}
                                                  placeholder="e.g. UX Case Studies by Our Students"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>View All Button Text</label>
                                             <input
                                                  value={caseStudiesButtonText}
                                                  onChange={(e) => setCaseStudiesButtonText(e.target.value)}
                                                  placeholder="e.g. View All Works"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5 sm:col-span-2">
                                             <label className={labelClass}>Section Description</label>
                                             <textarea
                                                  value={caseStudiesDescription}
                                                  onChange={(e) => setCaseStudiesDescription(e.target.value)}
                                                  placeholder="e.g. Click and explore our students UX projects..."
                                                  rows={2}
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   {/* Case Studies Cards List */}
                                   <div className="space-y-3 pt-2">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                             <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Portfolio Cards ({caseStudiesItems.length})</p>
                                             <button
                                                  type="button"
                                                  onClick={addCaseStudyItem}
                                                  className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                             >
                                                  + Add Portfolio Card
                                             </button>
                                        </div>

                                        {caseStudiesItems.map((item, itemIdx) => (
                                             <div key={itemIdx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 relative group text-left">
                                                  <button
                                                       type="button"
                                                       onClick={() => removeCaseStudyItem(itemIdx)}
                                                       className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs transition-colors duration-155 cursor-pointer"
                                                  >
                                                       Remove
                                                  </button>
                                                  
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                       <div className="space-y-1">
                                                            <label className="text-[11px] font-bold text-gray-500">Alt Text / Title</label>
                                                            <input
                                                                 value={item.alt || ""}
                                                                 onChange={(e) => updateCaseStudyItemField(itemIdx, "alt", e.target.value)}
                                                                 placeholder="e.g. Case Study 1 mockup"
                                                                 className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                            />
                                                       </div>
                                                       <div className="space-y-1">
                                                            <label className="text-[11px] font-bold text-gray-500">Link URL</label>
                                                            <input
                                                                 value={item.link || ""}
                                                                 onChange={(e) => updateCaseStudyItemField(itemIdx, "link", e.target.value)}
                                                                 placeholder="e.g. # or URL"
                                                                 className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                            />
                                                       </div>
                                                  </div>

                                                  <div className="space-y-1.5">
                                                       <label className="text-[11px] font-bold text-gray-500">Card Image Upload</label>
                                                       <ImageUploader 
                                                            setImage={(imgFile) => updateCaseStudyItemField(itemIdx, "image", imgFile)}
                                                            initialImage={item.image}
                                                       />
                                                  </div>
                                             </div>
                                        ))}

                                        {caseStudiesItems.length === 0 && (
                                             <p className="text-xs text-gray-400 text-center py-3 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">No portfolio items added yet. Click "+ Add Portfolio Card" above.</p>
                                        )}
                                   </div>
                              </div>

                              {/* Global Career Domains Config */}
                              <div className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200/50 space-y-4">
                                   <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 font-sans">2. Global Career Domains Section</h2>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5 sm:col-span-2">
                                             <label className={labelClass}>Section Title</label>
                                             <input
                                                  value={careerDomainsTitle}
                                                  onChange={(e) => setCareerDomainsTitle(e.target.value)}
                                                  placeholder="e.g. Explore More Career Domains"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5 sm:col-span-2">
                                             <label className={labelClass}>Section Description</label>
                                             <textarea
                                                  value={careerDomainsDescription}
                                                  onChange={(e) => setCareerDomainsDescription(e.target.value)}
                                                  placeholder="e.g. Discover diverse courses..."
                                                  rows={2}
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   {/* Career Domains Items List */}
                                   <div className="space-y-3 pt-2">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                             <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Domain Cards ({careerDomainsItems.length})</p>
                                             <button
                                                  type="button"
                                                  onClick={addCareerDomainItem}
                                                  className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                             >
                                                  + Add Domain Card
                                             </button>
                                        </div>

                                        {careerDomainsItems.map((item, itemIdx) => (
                                             <div key={itemIdx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 relative group text-left">
                                                  <button
                                                       type="button"
                                                       onClick={() => removeCareerDomainItem(itemIdx)}
                                                       className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs transition-colors duration-155 cursor-pointer"
                                                  >
                                                       Remove
                                                  </button>
                                                  
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                                       <div className="space-y-1">
                                                            <label className="text-[11px] font-bold text-gray-500">Domain Name</label>
                                                            <input
                                                                 value={item.name || ""}
                                                                 onChange={(e) => updateCareerDomainItemField(itemIdx, "name", e.target.value)}
                                                                 placeholder="e.g. Graphic Design"
                                                                 className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                            />
                                                       </div>
                                                       <div className="space-y-1">
                                                            <label className="text-[11px] font-bold text-gray-500">Link URL</label>
                                                            <input
                                                                 value={item.link || ""}
                                                                 onChange={(e) => updateCareerDomainItemField(itemIdx, "link", e.target.value)}
                                                                 placeholder="e.g. # or URL"
                                                                 className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                            />
                                                       </div>
                                                       <div className="space-y-1">
                                                            <label className="text-[11px] font-bold text-gray-500">Select Icon Style</label>
                                                            <select
                                                                 value={item.iconName || ""}
                                                                 onChange={(e) => updateCareerDomainItemField(itemIdx, "iconName", e.target.value)}
                                                                 className="w-full h-9 px-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs bg-white"
                                                            >
                                                                 <option value="">-- Choose Icon --</option>
                                                                 <option value="graphic">Graphic Design (Brush)</option>
                                                                 <option value="web">Web Design (Globe)</option>
                                                                 <option value="post">Post Production (Sliders)</option>
                                                                 <option value="analytics">Data Analytics (Line Chart)</option>
                                                                 <option value="cad">CAD & Architecture (Temple/Building)</option>
                                                                 <option value="animation">3D Animation (Cube)</option>
                                                                 <option value="code">Web Development (Code Brackets)</option>
                                                                 <option value="textile">CAD Textile Design (Geometric Pattern)</option>
                                                                 <option value="software">Software Development (Gears)</option>
                                                                 <option value="marketing">Digital Marketing (Megaphone)</option>
                                                                 <option value="ai">Machine Learning & AI (Android Robot)</option>
                                                                 <option value="video">Video Editing (YouTube Play)</option>
                                                            </select>
                                                       </div>
                                                       <div className="space-y-1">
                                                            <label className="text-[11px] font-bold text-gray-500">Card Color / Theme</label>
                                                            <div className="flex gap-1.5 items-center">
                                                                 <input
                                                                      type="color"
                                                                      value={item.color || "#10B981"}
                                                                      onChange={(e) => updateCareerDomainItemField(itemIdx, "color", e.target.value)}
                                                                      className="w-8 h-8 rounded border border-gray-300 p-0 cursor-pointer overflow-hidden"
                                                                 />
                                                                 <input
                                                                      type="text"
                                                                      value={item.color || ""}
                                                                      onChange={(e) => updateCareerDomainItemField(itemIdx, "color", e.target.value)}
                                                                      placeholder="Hex color code"
                                                                      className="flex-1 h-9 px-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        ))}

                                        {careerDomainsItems.length === 0 && (
                                             <p className="text-xs text-gray-400 text-center py-3 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">No career domains added yet. Click "+ Add Domain Card" above.</p>
                                        )}
                                   </div>
                              </div>

                              {/* Save Actions */}
                              <div className="flex justify-end pt-4">
                                   <button
                                        onClick={saveGlobalConfig}
                                        disabled={savingPageTitle}
                                        className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                                   >
                                        {savingPageTitle ? "Saving Configurations..." : "Save Global Settings"}
                                   </button>
                              </div>
                         </div>
                    )}
               </div>

               {/* ADD / EDIT MODAL */}
               {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col justify-between">
                              {/* Modal Header */}
                              <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                             {editItem ? "Edit Course" : "Upload New Course"}
                                        </h2>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                             Fill in basic properties, seo tags, cover image, and curriculum.
                                        </p>
                                   </div>
                                   <button
                                        onClick={() => setShowModal(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                                   >
                                        ✕
                                   </button>
                              </div>

                              {/* Modal Content */}
                              <div className="px-7 py-6 space-y-6">
                                   {/* Basic Info */}
                                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Basic Info</p>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Course Title</label>
                                             <input
                                                  value={title}
                                                  onChange={(e) => setTitle(e.target.value)}
                                                  placeholder="e.g. Figma UI/UX Masterclass"
                                                  className={inputClass}
                                                  required
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Category</label>
                                             <input
                                                  value={category}
                                                  onChange={(e) => setCategory(e.target.value)}
                                                  placeholder="e.g. Design"
                                                  className={inputClass}
                                                  required
                                             />
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Course Start Date</label>
                                             <input
                                                  value={startDate}
                                                  onChange={(e) => setStartDate(e.target.value)}
                                                  placeholder="e.g. July 1, 2026"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>URL Slug</label>
                                             <input
                                                  value={slug}
                                                  onChange={(e) => setSlug(e.target.value)}
                                                  placeholder="e.g. figma-ui-ux-masterclass"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Course Overview / Summary</label>
                                        <textarea
                                             value={overview}
                                             onChange={(e) => setOverview(e.target.value)}
                                             placeholder="Detailed description of the program..."
                                             rows={3}
                                             className={inputClass}
                                        />
                                   </div>

                                   {/* Cover Image */}
                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Course Cover Image</label>
                                        <ImageUploader
                                             setImage={setImage}
                                             initialImage={image || editItem?.image}
                                        />
                                        <p className="text-[11px] text-gray-400 mt-1">Suggested size: 800 x 450 px (ideal for standard wide card layout on desktop and mobile).</p>
                                        <div className="mt-2">
                                             <label className={labelClass}>Image Alt Text</label>
                                             <input
                                                  value={alt}
                                                  onChange={(e) => setAlt(e.target.value)}
                                                  placeholder="e.g. Design mockup preview"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   {/* Course Videos Section Banner */}
                                   <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                             <p className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                                                  <span className="text-orange-500">🎬</span> Course Session Recording Videos
                                             </p>
                                             <p className="text-xs text-gray-500 mt-0.5">
                                                  Manage video recordings, title, alt text, and thumbnail for this course ({videos.length} video{videos.length !== 1 ? 's' : ''} added).
                                             </p>
                                        </div>
                                        <button
                                             type="button"
                                             onClick={() => setShowVideoModal(true)}
                                             className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
                                        >
                                             <HiOutlinePlus size={15} /> Add course Videos
                                        </button>
                                   </div>

                                   {/* Promo & Brochure Custom Fields */}
                                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 pt-2">Promo & Brochure Fields</p>

                                   <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Promo Section Heading</label>
                                             <input
                                                  value={promoTitle}
                                                  onChange={(e) => setPromoTitle(e.target.value)}
                                                  placeholder="e.g. UI UX Design Courses in Delhi at Affordable Fees"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Promo Section Description</label>
                                             <textarea
                                                  value={promoDescription}
                                                  onChange={(e) => setPromoDescription(e.target.value)}
                                                  placeholder="The demand for skilled UI/UX designers has increased..."
                                                  rows={3}
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Promo Benefits List (comma-separated)</label>
                                             <textarea
                                                  value={promoBenefits}
                                                  onChange={(e) => setPromoBenefits(e.target.value)}
                                                  placeholder="Training Since 2006, Small Batches, Experienced Faculty..."
                                                  rows={2}
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Left Column Content (Below Social Media Icons - Rich Text Editor)</label>
                                             <Editor
                                                  value={promoSocialBottomContent}
                                                  onChange={(html) => setPromoSocialBottomContent(html)}
                                             />
                                        </div>
                                   </div>

                                   <div className="grid grid-cols-1 gap-4 mt-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Brochure Banner Title</label>
                                             <input
                                                  value={brochureTitle}
                                                  onChange={(e) => setBrochureTitle(e.target.value)}
                                                  placeholder="e.g. Comprehensive Syllabus for UI UX Design Training"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Brochure Banner Subtext</label>
                                             <textarea
                                                  value={brochureSubtext}
                                                  onChange={(e) => setBrochureSubtext(e.target.value)}
                                                  placeholder="Chart your path to a thriving career..."
                                                  rows={2}
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Brochure Banner Contact Phones</label>
                                             <input
                                                  value={brochurePhones}
                                                  onChange={(e) => setBrochurePhones(e.target.value)}
                                                  placeholder="e.g. +91 9911782350 or +91 9811818122"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   {/* SEO Configurations */}
                                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 pt-2">SEO Configurations</p>

                                   <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>SEO Meta Title</label>
                                             <input
                                                  value={seoTitle}
                                                  onChange={(e) => setSeoTitle(e.target.value)}
                                                  placeholder="Optimized Search Heading"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>SEO Meta Description</label>
                                             <textarea
                                                  value={seoDescription}
                                                  onChange={(e) => setSeoDescription(e.target.value)}
                                                  placeholder="Search results descriptive snippet..."
                                                  rows={2}
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   {/* Schemas Section */}
                                   <div className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-150">
                                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200/60 pb-1.5">JSON-LD Schema Scripts</p>
                                        <div className="space-y-3">
                                             {schemas.map((schema, index) => (
                                                  <div key={index} className="flex gap-2 items-start">
                                                       <textarea
                                                            value={schema}
                                                            onChange={e => {
                                                                 const newSchemas = [...schemas];
                                                                 newSchemas[index] = e.target.value;
                                                                 setSchemas(newSchemas);
                                                            }}
                                                            placeholder='e.g. {"@context": "https://schema.org", "@type": "Course", ...}'
                                                            rows={2}
                                                            className={inputClass}
                                                       />
                                                       <button
                                                            type="button"
                                                            onClick={() => {
                                                                 const newSchemas = schemas.filter((_, idx) => idx !== index);
                                                                 setSchemas(newSchemas);
                                                            }}
                                                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-xs transition-colors cursor-pointer mt-1"
                                                       >
                                                            ✕
                                                       </button>
                                                  </div>
                                             ))}
                                             <button
                                                  type="button"
                                                  onClick={() => setSchemas([...schemas, ''])}
                                                  className="text-orange-500 hover:text-orange-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                             >
                                                  + Add Schema Script
                                             </button>
                                        </div>
                                   </div>

                                   {/* Short-Term Courses Section */}
                                   <div className="border-t border-gray-100 pt-4 space-y-4">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Short-Term Courses (Slider Section)</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Short-Term Section Title</label>
                                                  <input
                                                       value={shortTermTitle}
                                                       onChange={(e) => setShortTermTitle(e.target.value)}
                                                       placeholder="e.g. Short-term UX Design Courses"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Short-Term Section Description</label>
                                                  <textarea
                                                       value={shortTermDescription}
                                                       onChange={(e) => setShortTermDescription(e.target.value)}
                                                       placeholder="Check out short duration courses..."
                                                       rows={2}
                                                       className={inputClass}
                                                  />
                                             </div>
                                        </div>

                                        {/* Short-Term items list with ImageUploader */}
                                        <div className="space-y-3 pt-2">
                                             <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Short-Term Course Cards ({shortTermItems.length})</p>
                                                  <button
                                                       type="button"
                                                       onClick={addShortTermItem}
                                                       className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                  >
                                                       + Add Short-Term Card
                                                  </button>
                                             </div>

                                             {shortTermItems.map((item, itemIdx) => (
                                                  <div key={itemIdx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 relative group text-left">
                                                       <button
                                                            type="button"
                                                            onClick={() => removeShortTermItem(itemIdx)}
                                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xs transition-colors duration-155 cursor-pointer"
                                                       >
                                                            Remove
                                                       </button>
                                                       
                                                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Course Title</label>
                                                                 <input
                                                                      value={item.title || ""}
                                                                      onChange={(e) => updateShortTermItemField(itemIdx, "title", e.target.value)}
                                                                      placeholder="e.g. Adobe XD Course"
                                                                      className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Duration</label>
                                                                 <input
                                                                      value={item.duration || ""}
                                                                      onChange={(e) => updateShortTermItemField(itemIdx, "duration", e.target.value)}
                                                                      placeholder="e.g. DURATION: 01 MONTH"
                                                                      className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                            <div className="space-y-1">
                                                                 <label className="text-[11px] font-bold text-gray-500">Badge Text / Alt</label>
                                                                 <input
                                                                      value={item.alt || item.iconText || ""}
                                                                      onChange={(e) => {
                                                                           updateShortTermItemField(itemIdx, "alt", e.target.value);
                                                                           updateShortTermItemField(itemIdx, "iconText", e.target.value);
                                                                      }}
                                                                      placeholder="e.g. Xd / Adobe XD Logo"
                                                                      className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                                 />
                                                            </div>
                                                       </div>

                                                       <div className="space-y-1.5">
                                                            <label className="text-[11px] font-bold text-gray-500">Card Image Upload (ImageUploader)</label>
                                                            <ImageUploader 
                                                                 setImage={(imgFile) => updateShortTermItemField(itemIdx, "image", imgFile)}
                                                                 initialImage={item.image}
                                                            />
                                                       </div>

                                                       <div className="space-y-1">
                                                            <label className="text-[11px] font-bold text-gray-500">Description</label>
                                                            <textarea
                                                                 value={item.description || ""}
                                                                 onChange={(e) => updateShortTermItemField(itemIdx, "description", e.target.value)}
                                                                 placeholder="Short summary of this tool course..."
                                                                 rows={2}
                                                                 className="w-full p-2.5 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                            />
                                                       </div>
                                                  </div>
                                             ))}

                                             {shortTermItems.length === 0 && (
                                                  <p className="text-xs text-gray-400 text-center py-3 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">No short term items added yet. Click "+ Add Short-Term Card" above.</p>
                                             )}
                                        </div>
                                   </div>

                                   {/* Chapters & Curriculum Section */}
                                   <div className="space-y-4 border-t border-gray-100 pt-4">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Course Curriculum / Syllabus Chapters</p>
                                             <button
                                                  type="button"
                                                  onClick={addChapter}
                                                  className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                             >
                                                  + Add Chapter
                                             </button>
                                        </div>

                                        <div className="space-y-4">
                                             {chapters.map((chapter, chIdx) => (
                                                  <div key={chIdx} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4 text-left relative">
                                                       <button
                                                            type="button"
                                                            onClick={() => removeChapter(chIdx)}
                                                            className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:text-red-600 cursor-pointer"
                                                       >
                                                            Delete Chapter
                                                       </button>
                                                       
                                                       <div className="space-y-1.5">
                                                            <label className={labelClass}>Chapter Name</label>
                                                            <input
                                                                 value={chapter.chaptername || ""}
                                                                 onChange={(e) => updateChapterField(chIdx, "chaptername", e.target.value)}
                                                                 placeholder="e.g. Introduction to Figma"
                                                                 className={inputClass}
                                                            />
                                                       </div>

                                                       {/* Lessons list for this chapter */}
                                                       <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                 <p className="text-xs font-bold text-gray-500">Lessons Inside Chapter #{chIdx + 1}</p>
                                                                 <button
                                                                      type="button"
                                                                      onClick={() => addLesson(chIdx)}
                                                                      className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                                 >
                                                                      + Add Lesson
                                                                 </button>
                                                            </div>

                                                            <div className="space-y-4">
                                                                 {chapter.lessons && chapter.lessons.map((lesson, lIdx) => (
                                                                      <div key={lIdx} className="border border-gray-200 rounded-xl p-4 bg-white space-y-4">
                                                                           <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                                                                <span className="text-xs font-semibold text-gray-400 uppercase">Lesson #{lIdx + 1}</span>
                                                                                <button
                                                                                     type="button"
                                                                                     onClick={() => removeLesson(chIdx, lIdx)}
                                                                                     className="text-xs text-red-500 hover:text-red-600 font-bold cursor-pointer"
                                                                                >
                                                                                     Remove
                                                                                </button>
                                                                           </div>

                                                                           <div className="space-y-1.5">
                                                                                <label className={labelClass}>Lesson Title</label>
                                                                                <input
                                                                                     value={lesson.lessonname || ""}
                                                                                     onChange={(e) => updateLessonField(chIdx, lIdx, "lessonname", e.target.value)}
                                                                                     placeholder="e.g. Figma Interface Tour"
                                                                                     className={inputClass}
                                                                                />
                                                                           </div>
                                                                      </div>
                                                                 ))}
                                                                 {(!chapter.lessons || chapter.lessons.length === 0) && (
                                                                      <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl bg-white">
                                                                           <p className="text-xs text-gray-400">No lessons added to this chapter. Add one above.</p>
                                                                      </div>
                                                                 )}
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}

                                             {chapters.length === 0 && (
                                                  <div className="text-center py-8 text-gray-300 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                                                       <p className="text-xs text-gray-400">No chapters added to curriculum. Add one above.</p>
                                                  </div>
                                             )}
                                        </div>
                                   </div>

                                   {/* FAQ Section */}
                                   <div className="space-y-4 border-t border-gray-100 pt-4">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Frequently Asked Questions (FAQs)</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>FAQ Section Title</label>
                                                  <input
                                                       value={faqTitle}
                                                       onChange={(e) => setFaqTitle(e.target.value)}
                                                       placeholder="e.g. FAQ"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>FAQ Start Heading</label>
                                                  <input
                                                       value={faqStartheading}
                                                       onChange={(e) => setFaqStartheading(e.target.value)}
                                                       placeholder="e.g. All You"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>FAQ Mid Heading</label>
                                                  <input
                                                       value={faqMidheading}
                                                       onChange={(e) => setFaqMidheading(e.target.value)}
                                                       placeholder="e.g. Need"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>FAQ End Heading</label>
                                                  <input
                                                       value={faqEndheading}
                                                       onChange={(e) => setFaqEndheading(e.target.value)}
                                                       placeholder="e.g. To Know"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1.5 sm:col-span-2">
                                                  <label className={labelClass}>FAQ Section Description</label>
                                                  <textarea
                                                       value={faqDescription}
                                                       onChange={(e) => setFaqDescription(e.target.value)}
                                                       placeholder="FAQ section description..."
                                                       rows={2}
                                                       className={inputClass}
                                                  />
                                             </div>
                                        </div>

                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1 mt-4">FAQ Q&A Items</p>
                                        <div className="space-y-4">
                                             {faqItems.map((item, index) => (
                                                  <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative space-y-3">
                                                       <button
                                                            type="button"
                                                            onClick={() => {
                                                                 setFaqItems(prev => prev.filter((_, i) => i !== index));
                                                            }}
                                                            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer"
                                                       >
                                                            <HiOutlineTrash className="text-sm" />
                                                       </button>
                                                       <div className="space-y-1.5 pr-8">
                                                            <label className={labelClass}>Question {index + 1}</label>
                                                            <input
                                                                 value={item.ques || ""}
                                                                 onChange={(e) => {
                                                                      const val = e.target.value;
                                                                      setFaqItems(prev => prev.map((f, i) => i === index ? { ...f, ques: val } : f));
                                                                 }}
                                                                 placeholder="e.g. What is the duration?"
                                                                 className={inputClass}
                                                                 required
                                                            />
                                                       </div>
                                                       <div className="space-y-1.5 pr-8">
                                                            <label className={labelClass}>Answer {index + 1}</label>
                                                            <textarea
                                                                 value={item.ans || ""}
                                                                 onChange={(e) => {
                                                                      const val = e.target.value;
                                                                      setFaqItems(prev => prev.map((f, i) => i === index ? { ...f, ans: val } : f));
                                                                 }}
                                                                 placeholder="Answer content..."
                                                                 rows={2}
                                                                 className={inputClass}
                                                                 required
                                                            />
                                                       </div>
                                                  </div>
                                             ))}

                                             <button
                                                  type="button"
                                                  onClick={() => {
                                                       setFaqItems(prev => [...prev, { ques: "", ans: "" }]);
                                                  }}
                                                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-orange-500 hover:border-orange-500 transition-all font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer bg-white"
                                             >
                                                  + Add FAQ Item
                                             </button>
                                        </div>
                                   </div>
                              </div>

                              {/* Modal Footer */}
                              <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-100 bg-white sticky bottom-0 rounded-b-2xl">
                                   <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        type="button"
                                        onClick={saveCourse}
                                        disabled={uploading || !title}
                                        className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 ${uploading || !title
                                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                                  : "bg-orange-500 hover:bg-orange-600 shadow-orange-200"
                                             }`}
                                   >
                                        {uploading ? (
                                             <>
                                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                  <span>Saving Course...</span>
                                             </>
                                        ) : (
                                             <span>{editItem ? "Save Changes" : "Publish Course"}</span>
                                        )}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

               {/* COURSE VIDEOS SUB-MODAL */}
               {showVideoModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto flex flex-col justify-between">
                              {/* Sub-modal Header */}
                              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                                   <div>
                                        <h3 className="text-base font-bold text-gray-900">
                                             Add & Edit Course Videos ({videos.length})
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                             Upload or link recording videos, title, alt text, and thumbnail images.
                                        </p>
                                   </div>
                                   <button
                                        type="button"
                                        onClick={() => setShowVideoModal(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                                   >
                                        ✕
                                   </button>
                              </div>

                              {/* Sub-modal Content */}
                              <div className="p-6 space-y-5">
                                   <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Video List</span>
                                        <button
                                             type="button"
                                             onClick={addVideoItem}
                                             className="px-3.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                                        >
                                             <HiOutlinePlus size={14} /> Add Video
                                        </button>
                                   </div>

                                   {videos.map((v, vIdx) => (
                                        <div key={vIdx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 relative text-left">
                                             <button
                                                  type="button"
                                                  onClick={() => removeVideoItem(vIdx)}
                                                  className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold transition-colors cursor-pointer"
                                             >
                                                  ✕
                                             </button>
                                             <div className="text-xs font-bold text-gray-700">Video #{vIdx + 1}</div>

                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                  <div className="space-y-1">
                                                       <label className="text-[11px] font-bold text-gray-500">Video Title</label>
                                                       <input
                                                            value={v.title || ""}
                                                            onChange={(e) => updateVideoItemField(vIdx, "title", e.target.value)}
                                                            placeholder="e.g. Session 1: Figma Wireframing"
                                                            className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                       />
                                                  </div>
                                                  <div className="space-y-1">
                                                       <label className="text-[11px] font-bold text-gray-500">Alt Text</label>
                                                       <input
                                                            value={v.alt || ""}
                                                            onChange={(e) => updateVideoItemField(vIdx, "alt", e.target.value)}
                                                            placeholder="e.g. Figma tutorial recording"
                                                            className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                       />
                                                  </div>
                                             </div>

                                             <div className="space-y-1">
                                                  <label className="text-[11px] font-bold text-gray-500">Video URL / Direct Link</label>
                                                  <input
                                                       value={typeof v.video === "string" ? v.video : ""}
                                                       onChange={(e) => updateVideoItemField(vIdx, "video", e.target.value)}
                                                       placeholder="e.g. https://res.cloudinary.com/.../video.mp4 or YouTube link"
                                                       className="w-full h-9 px-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                  />
                                                  <div className="pt-1">
                                                       <label className="text-[10px] font-semibold text-gray-400">Or Upload Video File:</label>
                                                       <input
                                                            type="file"
                                                            accept="video/*"
                                                            disabled={v.uploading}
                                                            onChange={(e) => {
                                                                 if (e.target.files && e.target.files[0]) {
                                                                      handleVideoFileUpload(vIdx, e.target.files[0]);
                                                                 }
                                                            }}
                                                            className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer disabled:opacity-50"
                                                       />
                                                       {v.uploading && (
                                                            <div className="mt-2 space-y-1.5 bg-orange-50/80 p-2.5 rounded-lg border border-orange-200">
                                                                 <div className="flex items-center justify-between text-[11px] font-bold text-orange-600">
                                                                      <span className="flex items-center gap-1.5">
                                                                           <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                                                           Uploading video...
                                                                      </span>
                                                                      <span>{v.progress || 0}%</span>
                                                                 </div>
                                                                 <div className="w-full bg-orange-200/60 rounded-full h-2 overflow-hidden">
                                                                      <div
                                                                           className="bg-orange-500 h-2 rounded-full transition-all duration-200"
                                                                           style={{ width: `${v.progress || 0}%` }}
                                                                      ></div>
                                                                 </div>
                                                            </div>
                                                       )}
                                                       {!v.uploading && v.video && typeof v.video === "string" && (
                                                            <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                                                                 <span>✓</span> Video Uploaded: <span className="font-mono text-gray-600 truncate max-w-xs">{v.video}</span>
                                                            </p>
                                                       )}
                                                       {v.uploadError && (
                                                            <p className="text-[10px] text-red-600 font-bold mt-1">
                                                                 ✕ {v.uploadError}
                                                            </p>
                                                       )}
                                                  </div>
                                             </div>

                                             <div className="space-y-1 pt-1">
                                                  <label className="text-[11px] font-bold text-gray-500">Thumbnail Image URL / Upload</label>
                                                  <input
                                                       value={typeof v.thumbnail === "string" ? v.thumbnail : ""}
                                                       onChange={(e) => updateVideoItemField(vIdx, "thumbnail", e.target.value)}
                                                       placeholder="e.g. https://res.cloudinary.com/.../thumb.jpg"
                                                       className="w-full h-9 px-3 mb-1 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-xs"
                                                  />
                                                  <ImageUploader
                                                       setImage={(imgFile) => updateVideoItemField(vIdx, "thumbnail", imgFile)}
                                                       initialImage={v.thumbnail}
                                                  />
                                             </div>
                                        </div>
                                   ))}

                                   {videos.length === 0 && (
                                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 space-y-2">
                                             <p className="text-xs text-gray-400">No videos added yet for this course.</p>
                                             <button
                                                  type="button"
                                                  onClick={addVideoItem}
                                                  className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg text-xs cursor-pointer hover:bg-orange-600 transition"
                                             >
                                                  + Add First Video
                                             </button>
                                        </div>
                                   )}
                              </div>

                              {/* Sub-modal Footer */}
                              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white sticky bottom-0 rounded-b-2xl">
                                   <button
                                        type="button"
                                        onClick={() => setShowVideoModal(false)}
                                        disabled={videos.some(v => v.uploading)}
                                        className={`px-5 py-2 text-xs font-bold rounded-xl transition shadow-sm ${
                                             videos.some(v => v.uploading)
                                                  ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                                                  : "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                                         }`}
                                   >
                                        {videos.some(v => v.uploading) ? (
                                             <span className="flex items-center gap-2">
                                                  <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                                  Uploading Video...
                                             </span>
                                        ) : (
                                             `Done (${videos.length} Video${videos.length !== 1 ? 's' : ''})`
                                        )}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

               {/* Toast Notification */}
               <div className={`fixed bottom-6 right-6 flex items-center gap-2.5 bg-gray-900 border border-gray-800 text-white px-5 py-3.5 rounded-xl shadow-2xl transform transition-all duration-300 z-50 ${toast.show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}>
                    <span className={`w-2 h-2 rounded-full ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"} animate-pulse`}></span>
                    <span className="font-semibold text-xs">{toast.message}</span>
               </div>
          </div>
     );
}