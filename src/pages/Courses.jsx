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

     // 14 Dynamic Course Details Sections States
     const [socialProof, setSocialProof] = useState([]);

     const [whyChooseUsTitle, setWhyChooseUsTitle] = useState("");
     const [whyChooseUsSubtitle, setWhyChooseUsSubtitle] = useState("");
     const [whyChooseUsItems, setWhyChooseUsItems] = useState([]);

     const [chooseLearningTitle, setChooseLearningTitle] = useState("");
     const [chooseLearningSubtitle, setChooseLearningSubtitle] = useState("");
     const [emiTitle, setEmiTitle] = useState("");
     const [emiSubtitle, setEmiSubtitle] = useState("");
     const [emiPoints, setEmiPoints] = useState([]);
     const [scholarshipTitle, setScholarshipTitle] = useState("");
     const [scholarshipSubtitle, setScholarshipSubtitle] = useState("");
     const [scholarshipPoints, setScholarshipPoints] = useState([]);
     const [batchesTitle, setBatchesTitle] = useState("");
     const [batchesSubtitle, setBatchesSubtitle] = useState("");
     const [batchItems, setBatchItems] = useState([]);

     const [benefitsTag, setBenefitsTag] = useState("");
     const [benefitsTitle, setBenefitsTitle] = useState("");
     const [benefitsSubtitle, setBenefitsSubtitle] = useState("");
     const [benefitsCards, setBenefitsCards] = useState([]);

     const [skillsYouWillLearnTitle, setSkillsYouWillLearnTitle] = useState("");
     const [skillsYouWillLearnItems, setSkillsYouWillLearnItems] = useState([]);

     const [whoShouldEnrollTitle, setWhoShouldEnrollTitle] = useState("");
     const [whoShouldEnrollSubtitle, setWhoShouldEnrollSubtitle] = useState("");
     const [whoShouldEnrollItems, setWhoShouldEnrollItems] = useState([]);

     const [jobRolesTag, setJobRolesTag] = useState("");
     const [jobRolesTitle, setJobRolesTitle] = useState("");
     const [jobRolesDescription, setJobRolesDescription] = useState("");
     const [jobRolesItems, setJobRolesItems] = useState([]);

     const [hiringPartnersTitle, setHiringPartnersTitle] = useState("");
     const [hiringPartnersSubtitle, setHiringPartnersSubtitle] = useState("");
     const [hiringPartnersItems, setHiringPartnersItems] = useState([]);

     const [trainersTitle, setTrainersTitle] = useState("");
     const [trainersSubtitle, setTrainersSubtitle] = useState("");
     const [trainersItems, setTrainersItems] = useState([]);

     const [certificationTitle, setCertificationTitle] = useState("");
     const [certificationSubtitle, setCertificationSubtitle] = useState("");
     const [certificationBullets, setCertificationBullets] = useState([]);
     const [certificationImage, setCertificationImage] = useState(null);

     const [readyToStartTitle, setReadyToStartTitle] = useState("");
     const [readyToStartSubtitle, setReadyToStartSubtitle] = useState("");
     const [readyToStartBtn1Text, setReadyToStartBtn1Text] = useState("");
     const [readyToStartBtn1Link, setReadyToStartBtn1Link] = useState("");
     const [readyToStartBtn2Text, setReadyToStartBtn2Text] = useState("");
     const [readyToStartBtn2Link, setReadyToStartBtn2Link] = useState("");

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

     // Zoom Meeting Modal & Dispatch States
     const [showMeetModal, setShowMeetModal] = useState(false);
     const [selectedCourseForMeet, setSelectedCourseForMeet] = useState(null);
     const [meetUrl, setMeetUrl] = useState("");
     const [zoomMeetingId, setZoomMeetingId] = useState("");
     const [zoomPasscode, setZoomPasscode] = useState("");
     const [meetTitle, setMeetTitle] = useState("");
     const [scheduledAt, setScheduledAt] = useState("Live Now");
     const [instructions, setInstructions] = useState("");
     const [generatingZoomApi, setGeneratingZoomApi] = useState(false);
     const [sendingMeetEmail, setSendingMeetEmail] = useState(false);
     const [endingMeetId, setEndingMeetId] = useState(null);

     const openMeetModal = (course = null) => {
          setSelectedCourseForMeet(course);
          if (course && course.liveClass) {
               setMeetUrl(course.liveClass.meetUrl || "");
               setZoomMeetingId(course.liveClass.zoomMeetingId || "");
               setZoomPasscode(course.liveClass.passcode || "");
               setMeetTitle(course.liveClass.title || `Live Session: ${course.title || "UI/UX Class"}`);
               setScheduledAt(course.liveClass.scheduledAt || "Live Now");
               setInstructions(course.liveClass.instructions || "");
          } else {
               setMeetUrl("");
               setZoomMeetingId("");
               setZoomPasscode("");
               setMeetTitle(course ? `Live Session: ${course.title}` : "Live Session for All Courses");
               setScheduledAt("Live Now");
               setInstructions("");
          }
          setShowMeetModal(true);
     };

     const handleMeetUrlChange = (val) => {
          setMeetUrl(val);
          if (val && val.includes("zoom.us")) {
               const idMatch = val.match(/\/(?:j|wc\/join)\/(\d+)/);
               const pwdMatch = val.match(/pwd=([^&]+)/);
               if (idMatch && idMatch[1]) setZoomMeetingId(idMatch[1]);
               if (pwdMatch && pwdMatch[1]) setZoomPasscode(pwdMatch[1]);
          }
     };

     const handleAutoGenerateZoomLink = async () => {
          setGeneratingZoomApi(true);
          try {
               const res = await fetch(`${API_URL}/admin/create-zoom-meeting`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: JSON.stringify({ topic: meetTitle || "Live Interactive Class" })
               });
               const data = await res.json();
               if (data.success && data.meetUrl) {
                    setMeetUrl(data.meetUrl);
                    if (data.zoomMeetingId) setZoomMeetingId(data.zoomMeetingId);
                    if (data.passcode) setZoomPasscode(data.passcode);
                    showToast("⚡ Real Zoom meeting generated via Zoom API!", "success");
               } else {
                    showToast(data.message || "Paste real Zoom link below.", "info");
               }
          } catch (err) {
               showToast("Failed to connect to Zoom API.", "error");
          } finally {
               setGeneratingZoomApi(false);
          }
     };

     const resetMeetForm = () => {
          setMeetUrl("");
          setZoomMeetingId("");
          setZoomPasscode("");
          setMeetTitle("");
          setScheduledAt("Live Now");
          setInstructions("");
          setSelectedCourseForMeet(null);
     };

     const handleSendMeetLink = async () => {
          if (!meetUrl) return showToast("Please enter or generate a valid Zoom meeting link.", "error");

          setSendingMeetEmail(true);
          try {
               const res = await fetch(`${API_URL}/admin/dispatch-live-meet`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: JSON.stringify({
                         courseId: selectedCourseForMeet?._id || "ALL",
                         courseSlug: selectedCourseForMeet?.slug || "",
                         courseTitle: selectedCourseForMeet?.title || "Selected Courses",
                         meetUrl,
                         zoomMeetingId,
                         passcode: zoomPasscode,
                         title: meetTitle,
                         scheduledAt,
                         instructions,
                         saveToCourse: true
                    })
               });
               const data = await res.json();
               if (res.ok && data.success) {
                    showToast(data.message || "Zoom link dispatched to students!", "success");
                    resetMeetForm();
                    setShowMeetModal(false);
                    fetchCourses();
               } else {
                    showToast(data.error || "Failed to dispatch Zoom link.", "error");
               }
          } catch (err) {
               showToast("Failed to send Zoom meeting emails.", "error");
          } finally {
               setSendingMeetEmail(false);
          }
     };

     const handleEndMeetLink = async (course = null) => {
          const cId = course?._id || "ALL";
          setEndingMeetId(cId);
          try {
               const res = await fetch(`${API_URL}/admin/end-live-meet`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: JSON.stringify({
                         courseId: cId,
                         courseSlug: course?.slug || ""
                    })
               });
               const data = await res.json();
               if (res.ok) {
                    showToast(data.message || "Live Zoom session ended.", "success");
                    fetchCourses();
               } else {
                    showToast(data.error || "Failed to end live session.", "error");
               }
          } catch (err) {
               showToast("Failed to connect to backend server.", "error");
          } finally {
               setEndingMeetId(null);
          }
     };

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

     // Handlers for Social Proof
     const addSocialProofItem = () => setSocialProof(prev => [...prev, { value: "", name: "" }]);
     const removeSocialProofItem = (idx) => setSocialProof(prev => prev.filter((_, i) => i !== idx));
     const updateSocialProofItemField = (idx, key, value) => setSocialProof(prev => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item));

     // Handlers for Why Choose Us
     const addWhyChooseUsItem = () => setWhyChooseUsItems(prev => [...prev, { title: "", description: "", iconName: "graduationCap" }]);
     const removeWhyChooseUsItem = (idx) => setWhyChooseUsItems(prev => prev.filter((_, i) => i !== idx));
     const updateWhyChooseUsItemField = (idx, key, value) => setWhyChooseUsItems(prev => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item));

     // Handlers for Choose Your Learning
     const addEmiPoint = () => setEmiPoints(prev => [...prev, ""]);
     const removeEmiPoint = (idx) => setEmiPoints(prev => prev.filter((_, i) => i !== idx));
     const updateEmiPoint = (idx, value) => setEmiPoints(prev => prev.map((pt, i) => i === idx ? value : pt));

     const addScholarshipPoint = () => setScholarshipPoints(prev => [...prev, ""]);
     const removeScholarshipPoint = (idx) => setScholarshipPoints(prev => prev.filter((_, i) => i !== idx));
     const updateScholarshipPoint = (idx, value) => setScholarshipPoints(prev => prev.map((pt, i) => i === idx ? value : pt));

     const addBatchItem = () => setBatchItems(prev => [...prev, { dayDate: "01", month: "JUN", title: "Weekend Batch", time: "Sat - Sun • 10:00 AM", status: "Upcoming" }]);
     const removeBatchItem = (idx) => setBatchItems(prev => prev.filter((_, i) => i !== idx));
     const updateBatchItemField = (idx, key, value) => setBatchItems(prev => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item));

     // Handlers for Course Benefits
     const addBenefitCard = () => setBenefitsCards(prev => [...prev, { title: "", description: "", iconName: "TrendingUp" }]);
     const removeBenefitCard = (idx) => setBenefitsCards(prev => prev.filter((_, i) => i !== idx));
     const updateBenefitCardField = (idx, key, value) => setBenefitsCards(prev => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item));

     // Handlers for Skills You Will Learn
     const addSkillItem = () => setSkillsYouWillLearnItems(prev => [...prev, ""]);
     const removeSkillItem = (idx) => setSkillsYouWillLearnItems(prev => prev.filter((_, i) => i !== idx));
     const updateSkillItemField = (idx, value) => setSkillsYouWillLearnItems(prev => prev.map((item, i) => i === idx ? value : item));

     // Handlers for Who Should Enroll
     const addWhoShouldEnrollItem = () => setWhoShouldEnrollItems(prev => [...prev, { title: "", description: "", iconName: "briefcase" }]);
     const removeWhoShouldEnrollItem = (idx) => setWhoShouldEnrollItems(prev => prev.filter((_, i) => i !== idx));
     const updateWhoShouldEnrollItemField = (idx, key, value) => setWhoShouldEnrollItems(prev => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item));

     // Handlers for Job Roles
     const addJobRoleItem = () => setJobRolesItems(prev => [...prev, { step: "01", title: "", description: "", keyFocusTitle: "KEY FOCUS AREAS", keyFocus: "", iconName: "briefcase" }]);
     const removeJobRoleItem = (idx) => setJobRolesItems(prev => prev.filter((_, i) => i !== idx));
     const updateJobRoleItemField = (idx, key, value) => setJobRolesItems(prev => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item));

     // Handlers for Hiring Partners
     const addHiringPartnerItem = () => setHiringPartnersItems(prev => [...prev, { name: "", image: "" }]);
     const removeHiringPartnerItem = (idx) => setHiringPartnersItems(prev => prev.filter((_, i) => i !== idx));
     const updateHiringPartnerItemField = (idx, key, value) => setHiringPartnersItems(prev => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item));

     // Handlers for Meet The Trainer
     const addTrainerItem = () => setTrainersItems(prev => [...prev, { name: "", role: "", bio: "", rating: "4.9/5", students: "400+ Students", image: "", linkedin: "" }]);
     const removeTrainerItem = (idx) => setTrainersItems(prev => prev.filter((_, i) => i !== idx));
     const updateTrainerItemField = (idx, key, value) => setTrainersItems(prev => prev.map((item, i) => i === idx ? { ...item, [key]: value } : item));

     // Handlers for Certification Bullets
     const addCertificationBullet = () => setCertificationBullets(prev => [...prev, ""]);
     const removeCertificationBullet = (idx) => setCertificationBullets(prev => prev.filter((_, i) => i !== idx));
     const updateCertificationBullet = (idx, value) => setCertificationBullets(prev => prev.map((item, i) => i === idx ? value : item));

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

          setSocialProof([]);
          setWhyChooseUsTitle("");
          setWhyChooseUsSubtitle("");
          setWhyChooseUsItems([]);
          setChooseLearningTitle("");
          setChooseLearningSubtitle("");
          setEmiTitle("");
          setEmiSubtitle("");
          setEmiPoints([]);
          setScholarshipTitle("");
          setScholarshipSubtitle("");
          setScholarshipPoints([]);
          setBatchesTitle("");
          setBatchesSubtitle("");
          setBatchItems([]);
          setBenefitsTag("");
          setBenefitsTitle("");
          setBenefitsSubtitle("");
          setBenefitsCards([]);
          setSkillsYouWillLearnTitle("");
          setSkillsYouWillLearnItems([]);
          setWhoShouldEnrollTitle("");
          setWhoShouldEnrollSubtitle("");
          setWhoShouldEnrollItems([]);
          setJobRolesTag("");
          setJobRolesTitle("");
          setJobRolesDescription("");
          setJobRolesItems([]);
          setHiringPartnersTitle("");
          setHiringPartnersSubtitle("");
          setHiringPartnersItems([]);
          setTrainersTitle("");
          setTrainersSubtitle("");
          setTrainersItems([]);
          setCertificationTitle("");
          setCertificationSubtitle("");
          setCertificationBullets([]);
          setCertificationImage(null);
          setReadyToStartTitle("");
          setReadyToStartSubtitle("");
          setReadyToStartBtn1Text("");
          setReadyToStartBtn1Link("");
          setReadyToStartBtn2Text("");
          setReadyToStartBtn2Link("");
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

          setSocialProof(Array.isArray(course.socialProof) ? course.socialProof : []);
          setWhyChooseUsTitle(course.whyChooseUs?.title || "");
          setWhyChooseUsSubtitle(course.whyChooseUs?.subtitle || "");
          setWhyChooseUsItems(Array.isArray(course.whyChooseUs?.items) ? course.whyChooseUs.items : []);

          setChooseLearningTitle(course.chooseLearning?.title || "");
          setChooseLearningSubtitle(course.chooseLearning?.subtitle || "");
          setEmiTitle(course.chooseLearning?.emi?.title || "");
          setEmiSubtitle(course.chooseLearning?.emi?.subtitle || "");
          setEmiPoints(Array.isArray(course.chooseLearning?.emi?.points) ? course.chooseLearning.emi.points : []);
          setScholarshipTitle(course.chooseLearning?.scholarship?.title || "");
          setScholarshipSubtitle(course.chooseLearning?.scholarship?.subtitle || "");
          setScholarshipPoints(Array.isArray(course.chooseLearning?.scholarship?.points) ? course.chooseLearning.scholarship.points : []);
          setBatchesTitle(course.chooseLearning?.batches?.title || "");
          setBatchesSubtitle(course.chooseLearning?.batches?.subtitle || "");
          setBatchItems(Array.isArray(course.chooseLearning?.batches?.items) ? course.chooseLearning.batches.items : []);

          setBenefitsTag(course.benefitsTag || "");
          setBenefitsTitle(course.benefitsTitle || "");
          setBenefitsSubtitle(course.benefitsSubtitle || "");
          setBenefitsCards(Array.isArray(course.benefitsCards) ? course.benefitsCards : []);

          setSkillsYouWillLearnTitle(course.skillsYouWillLearn?.title || "");
          setSkillsYouWillLearnItems(Array.isArray(course.skillsYouWillLearn?.skills) ? course.skillsYouWillLearn.skills : []);

          setWhoShouldEnrollTitle(course.whoShouldEnroll?.title || "");
          setWhoShouldEnrollSubtitle(course.whoShouldEnroll?.subtitle || "");
          setWhoShouldEnrollItems(Array.isArray(course.whoShouldEnroll?.items) ? course.whoShouldEnroll.items : []);

          setJobRolesTag(course.jobRoles?.tag || "");
          setJobRolesTitle(course.jobRoles?.title || "");
          setJobRolesDescription(course.jobRoles?.description || "");
          setJobRolesItems(Array.isArray(course.jobRoles?.items) ? course.jobRoles.items : []);

          setHiringPartnersTitle(course.hiringPartners?.title || "");
          setHiringPartnersSubtitle(course.hiringPartners?.subtitle || "");
          setHiringPartnersItems(Array.isArray(course.hiringPartners?.items) ? course.hiringPartners.items : []);

          setTrainersTitle(course.trainers?.title || "");
          setTrainersSubtitle(course.trainers?.subtitle || "");
          setTrainersItems(Array.isArray(course.trainers?.items) ? course.trainers.items : []);

          setCertificationTitle(course.certificationTitle || "");
          setCertificationSubtitle(course.certificationSubtitle || "");
          setCertificationBullets(Array.isArray(course.certificationBullets) ? course.certificationBullets : []);
          setCertificationImage(course.certificationImage || null);

          setReadyToStartTitle(course.readyToStartJourney?.title || "");
          setReadyToStartSubtitle(course.readyToStartJourney?.subtitle || "");
          setReadyToStartBtn1Text(course.readyToStartJourney?.button1Text || "");
          setReadyToStartBtn1Link(course.readyToStartJourney?.button1Link || "");
          setReadyToStartBtn2Text(course.readyToStartJourney?.button2Text || "");
          setReadyToStartBtn2Link(course.readyToStartJourney?.button2Link || "");

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

               // Append 14 Dynamic Course Details Sections
               formData.append("socialProof", JSON.stringify(socialProof));
               formData.append("whyChooseUs", JSON.stringify({
                    title: whyChooseUsTitle,
                    subtitle: whyChooseUsSubtitle,
                    items: whyChooseUsItems
               }));
               formData.append("chooseLearning", JSON.stringify({
                    title: chooseLearningTitle,
                    subtitle: chooseLearningSubtitle,
                    emi: { title: emiTitle, subtitle: emiSubtitle, points: emiPoints },
                    scholarship: { title: scholarshipTitle, subtitle: scholarshipSubtitle, points: scholarshipPoints },
                    batches: { title: batchesTitle, subtitle: batchesSubtitle, items: batchItems }
               }));
               formData.append("benefitsTag", benefitsTag);
               formData.append("benefitsTitle", benefitsTitle);
               formData.append("benefitsSubtitle", benefitsSubtitle);
               formData.append("benefitsCards", JSON.stringify(benefitsCards));

               formData.append("skillsYouWillLearn", JSON.stringify({
                    title: skillsYouWillLearnTitle,
                    skills: skillsYouWillLearnItems
               }));
               formData.append("whoShouldEnroll", JSON.stringify({
                    title: whoShouldEnrollTitle,
                    subtitle: whoShouldEnrollSubtitle,
                    items: whoShouldEnrollItems
               }));
               formData.append("jobRoles", JSON.stringify({
                    tag: jobRolesTag,
                    title: jobRolesTitle,
                    description: jobRolesDescription,
                    items: jobRolesItems
               }));

               const formattedHiringPartners = hiringPartnersItems.map(item => ({
                    name: item.name || "",
                    image: (item.image && item.image instanceof File) ? "" : (item.image || "")
               }));
               formData.append("hiringPartners", JSON.stringify({
                    title: hiringPartnersTitle,
                    subtitle: hiringPartnersSubtitle,
                    items: formattedHiringPartners
               }));
               hiringPartnersItems.forEach((item, idx) => {
                    if (item.image && item.image instanceof File) {
                         formData.append(`hiringPartner_${idx}`, item.image);
                    }
               });

               const formattedTrainers = trainersItems.map(item => ({
                    name: item.name || "",
                    role: item.role || "",
                    bio: item.bio || "",
                    rating: item.rating || "4.9/5",
                    students: item.students || "",
                    linkedin: item.linkedin || "",
                    image: (item.image && item.image instanceof File) ? "" : (item.image || "")
               }));
               formData.append("trainers", JSON.stringify({
                    title: trainersTitle,
                    subtitle: trainersSubtitle,
                    items: formattedTrainers
               }));
               trainersItems.forEach((item, idx) => {
                    if (item.image && item.image instanceof File) {
                         formData.append(`trainer_${idx}`, item.image);
                    }
               });

               formData.append("certificationTitle", certificationTitle);
               formData.append("certificationSubtitle", certificationSubtitle);
               formData.append("certificationBullets", JSON.stringify(certificationBullets));
               if (certificationImage && certificationImage instanceof File) {
                    formData.append("certificationImage", certificationImage);
               } else if (typeof certificationImage === "string") {
                    formData.append("certificationImage", certificationImage);
               }

               formData.append("readyToStartJourney", JSON.stringify({
                    title: readyToStartTitle,
                    subtitle: readyToStartSubtitle,
                    button1Text: readyToStartBtn1Text,
                    button1Link: readyToStartBtn1Link,
                    button2Text: readyToStartBtn2Text,
                    button2Link: readyToStartBtn2Link
               }));

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

                     <div className="flex items-center gap-3 shrink-0">
                          <button
                               type="button"
                               onClick={() => openMeetModal(null)}
                               className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                          >
                               Zoom Live Class
                          </button>
                          <button
                               onClick={openUpload}
                               className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                          >
                               <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                               </svg>
                               Add Course
                          </button>
                     </div>
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
                                                   {course.liveClass?.active && (
                                                        <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md animate-pulse flex items-center gap-1">
                                                             <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                                             Live Active
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

                                                   <div className="space-y-2 pt-2">
                                                        {course.liveClass?.active ? (
                                                             <div className="flex gap-2">
                                                                  <button
                                                                       type="button"
                                                                       onClick={() => handleEndMeetLink(course)}
                                                                       disabled={endingMeetId === course._id}
                                                                       className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                                                                  >
                                                                       {endingMeetId === course._id ? "Ending..." : "🔴 End Live Session"}
                                                                  </button>
                                                                  <button
                                                                       type="button"
                                                                       onClick={() => openMeetModal(course)}
                                                                       className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                                                                  >
                                                                       Link
                                                                  </button>
                                                             </div>
                                                        ) : (
                                                             <button
                                                                  type="button"
                                                                  onClick={() => openMeetModal(course)}
                                                                  className="w-full flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold py-2 rounded-xl transition-colors duration-200 cursor-pointer"
                                                             >
                                                                  Start Zoom Live Class
                                                             </button>
                                                        )}

                                                        <div className="flex gap-2.5">
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
                                   <div className="flex items-center justify-between border-b border-gray-100 pb-2 pt-2">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Promo & Brochure Fields</p>
                                        <CopySectionSelector
                                             sectionName="Promo & Brochure"
                                             courses={courses}
                                             currentCourseId={editItem?._id}
                                             showToast={showToast}
                                             onCopy={(c) => {
                                                  setPromoTitle(c.promoTitle || "");
                                                  setPromoDescription(c.promoDescription || "");
                                                  setPromoBenefits(c.promoBenefits || "");
                                                  setPromoSocialBottomContent(c.promoSocialBottomContent || "");
                                                  setBrochureTitle(c.brochureTitle || "");
                                                  setBrochureSubtext(c.brochureSubtext || "");
                                                  setBrochurePhones(c.brochurePhones || "");
                                             }}
                                        />
                                   </div>

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

                                   {/* 14 Dynamic Course Details Sections */}
                                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 pt-4">Course Page Dynamic Sections</p>

                                   {/* 1. Social Proof Bar */}
                                   <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                                             <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">1. Social Proof Bar Items ({socialProof.length})</p>
                                             <div className="flex items-center gap-2">
                                                  <CopySectionSelector
                                                       sectionName="Social Proof"
                                                       courses={courses}
                                                       currentCourseId={editItem?._id}
                                                       showToast={showToast}
                                                       onCopy={(c) => {
                                                            if (c.socialProof && Array.isArray(c.socialProof)) setSocialProof(JSON.parse(JSON.stringify(c.socialProof)));
                                                       }}
                                                  />
                                                  <button
                                                       type="button"
                                                       onClick={addSocialProofItem}
                                                       className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                  >
                                                       + Add Stat Item
                                                  </button>
                                             </div>
                                        </div>
                                        {socialProof.map((sp, idx) => (
                                             <div key={idx} className="flex gap-2 items-center bg-white p-3 rounded-lg border border-gray-200">
                                                  <input
                                                       value={sp.value || ""}
                                                       onChange={(e) => updateSocialProofItemField(idx, "value", e.target.value)}
                                                       placeholder="Value (e.g. 4.8★)"
                                                       className="w-1/3 h-9 px-3 border border-gray-300 rounded-lg text-xs"
                                                  />
                                                  <input
                                                       value={sp.name || ""}
                                                       onChange={(e) => updateSocialProofItemField(idx, "name", e.target.value)}
                                                       placeholder="Label (e.g. Rating on Google)"
                                                       className="flex-1 h-9 px-3 border border-gray-300 rounded-lg text-xs"
                                                  />
                                                  <button
                                                       type="button"
                                                       onClick={() => removeSocialProofItem(idx)}
                                                       className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                                                  >
                                                       ✕
                                                  </button>
                                             </div>
                                        ))}
                                   </div>

                                   {/* 2. Why Choose Us Section */}
                                   <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                                             <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">2. Why Choose Us Section</p>
                                             <CopySectionSelector
                                                  sectionName="Why Choose Us"
                                                  courses={courses}
                                                  currentCourseId={editItem?._id}
                                                  showToast={showToast}
                                                  onCopy={(c) => {
                                                       if (c.whyChooseUs) {
                                                            setWhyChooseUsTitle(c.whyChooseUs.title || "");
                                                            setWhyChooseUsSubtitle(c.whyChooseUs.subtitle || "");
                                                            setWhyChooseUsItems(c.whyChooseUs.items ? JSON.parse(JSON.stringify(c.whyChooseUs.items)) : []);
                                                       }
                                                  }}
                                             />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                             <div className="space-y-1">
                                                  <label className={labelClass}>Section Title</label>
                                                  <input
                                                       value={whyChooseUsTitle}
                                                       onChange={(e) => setWhyChooseUsTitle(e.target.value)}
                                                       placeholder="e.g. Why Choose Shiksha Tech"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1">
                                                  <label className={labelClass}>Section Subtitle</label>
                                                  <input
                                                       value={whyChooseUsSubtitle}
                                                       onChange={(e) => setWhyChooseUsSubtitle(e.target.value)}
                                                       placeholder="e.g. Practical, industry-led learning"
                                                       className={inputClass}
                                                  />
                                             </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                             <span className="text-[11px] font-bold text-gray-500 uppercase">Feature Cards ({whyChooseUsItems.length})</span>
                                             <button
                                                  type="button"
                                                  onClick={addWhyChooseUsItem}
                                                  className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-lg cursor-pointer"
                                             >
                                                  + Add Card
                                             </button>
                                        </div>
                                        {whyChooseUsItems.map((item, idx) => (
                                             <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 space-y-2 relative">
                                                  <button
                                                       type="button"
                                                       onClick={() => removeWhyChooseUsItem(idx)}
                                                       className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-600 font-bold cursor-pointer"
                                                  >
                                                       ✕
                                                  </button>
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                       <input
                                                            value={item.title || ""}
                                                            onChange={(e) => updateWhyChooseUsItemField(idx, "title", e.target.value)}
                                                            placeholder="Card Title"
                                                            className="h-9 px-3 border border-gray-300 rounded-lg text-xs"
                                                       />
                                                       <input
                                                            value={item.iconName || ""}
                                                            onChange={(e) => updateWhyChooseUsItemField(idx, "iconName", e.target.value)}
                                                            placeholder="Icon Name (e.g. graduationCap, bookOpen, award)"
                                                            className="h-9 px-3 border border-gray-300 rounded-lg text-xs"
                                                       />
                                                  </div>
                                                  <textarea
                                                       value={item.description || ""}
                                                       onChange={(e) => updateWhyChooseUsItemField(idx, "description", e.target.value)}
                                                       placeholder="Card Description"
                                                       rows={2}
                                                       className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                                                  />
                                             </div>
                                        ))}
                                   </div>

                                   {/* 3. Choose Your Learning Section */}
                                   <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 space-y-4">
                                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                                             <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">3. Choose Your Learning (EMI, Scholarship, Batches)</p>
                                             <CopySectionSelector
                                                  sectionName="Choose Your Learning"
                                                  courses={courses}
                                                  currentCourseId={editItem?._id}
                                                  showToast={showToast}
                                                  onCopy={(c) => {
                                                       if (c.chooseLearning) {
                                                            setChooseLearningTitle(c.chooseLearning.title || "");
                                                            setChooseLearningSubtitle(c.chooseLearning.subtitle || "");
                                                            setEmiTitle(c.chooseLearning.emi?.title || "");
                                                            setEmiSubtitle(c.chooseLearning.emi?.subtitle || "");
                                                            setEmiPoints(c.chooseLearning.emi?.points ? [...c.chooseLearning.emi.points] : []);
                                                            setScholarshipTitle(c.chooseLearning.scholarship?.title || "");
                                                            setScholarshipSubtitle(c.chooseLearning.scholarship?.subtitle || "");
                                                            setScholarshipPoints(c.chooseLearning.scholarship?.points ? [...c.chooseLearning.scholarship.points] : []);
                                                            setBatchesTitle(c.chooseLearning.batches?.title || "");
                                                            setBatchesSubtitle(c.chooseLearning.batches?.subtitle || "");
                                                            setBatchItems(c.chooseLearning.batches?.items ? JSON.parse(JSON.stringify(c.chooseLearning.batches.items)) : []);
                                                       }
                                                  }}
                                             />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                             <div className="space-y-1">
                                                  <label className={labelClass}>Main Title</label>
                                                  <input
                                                       value={chooseLearningTitle}
                                                       onChange={(e) => setChooseLearningTitle(e.target.value)}
                                                       placeholder="e.g. Choose Your Learning Plan"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1">
                                                  <label className={labelClass}>Main Subtitle</label>
                                                  <input
                                                       value={chooseLearningSubtitle}
                                                       onChange={(e) => setChooseLearningSubtitle(e.target.value)}
                                                       placeholder="e.g. Flexible payment options for all"
                                                       className={inputClass}
                                                  />
                                             </div>
                                        </div>

                                        {/* EMI Card */}
                                        <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2">
                                             <p className="text-xs font-bold text-orange-600 uppercase">No-Cost EMI Options</p>
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                  <input value={emiTitle} onChange={(e) => setEmiTitle(e.target.value)} placeholder="EMI Title" className="h-9 px-3 border border-gray-300 rounded-lg text-xs" />
                                                  <input value={emiSubtitle} onChange={(e) => setEmiSubtitle(e.target.value)} placeholder="EMI Subtitle" className="h-9 px-3 border border-gray-300 rounded-lg text-xs" />
                                             </div>
                                             <div className="space-y-1.5 pt-1">
                                                  <div className="flex items-center justify-between">
                                                       <span className="text-[11px] text-gray-500 font-semibold">EMI Bullet Points</span>
                                                       <button type="button" onClick={addEmiPoint} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Bullet</button>
                                                  </div>
                                                  {emiPoints.map((pt, idx) => (
                                                       <div key={idx} className="flex gap-2 items-center">
                                                            <input value={pt} onChange={(e) => updateEmiPoint(idx, e.target.value)} placeholder="Bullet point text" className="flex-1 h-8 px-2 border border-gray-300 rounded text-xs" />
                                                            <button type="button" onClick={() => removeEmiPoint(idx)} className="text-red-500 text-xs">✕</button>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>

                                        {/* Scholarship Card */}
                                        <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2">
                                             <p className="text-xs font-bold text-emerald-600 uppercase">Scholarship Program</p>
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                  <input value={scholarshipTitle} onChange={(e) => setScholarshipTitle(e.target.value)} placeholder="Scholarship Title" className="h-9 px-3 border border-gray-300 rounded-lg text-xs" />
                                                  <input value={scholarshipSubtitle} onChange={(e) => setScholarshipSubtitle(e.target.value)} placeholder="Scholarship Subtitle" className="h-9 px-3 border border-gray-300 rounded-lg text-xs" />
                                             </div>
                                             <div className="space-y-1.5 pt-1">
                                                  <div className="flex items-center justify-between">
                                                       <span className="text-[11px] text-gray-500 font-semibold">Scholarship Bullet Points</span>
                                                       <button type="button" onClick={addScholarshipPoint} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Bullet</button>
                                                  </div>
                                                  {scholarshipPoints.map((pt, idx) => (
                                                       <div key={idx} className="flex gap-2 items-center">
                                                            <input value={pt} onChange={(e) => updateScholarshipPoint(idx, e.target.value)} placeholder="Bullet point text" className="flex-1 h-8 px-2 border border-gray-300 rounded text-xs" />
                                                            <button type="button" onClick={() => removeScholarshipPoint(idx)} className="text-red-500 text-xs">✕</button>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>

                                        {/* Upcoming Batches */}
                                        <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-3">
                                             <p className="text-xs font-bold text-blue-600 uppercase">Upcoming Batches</p>
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                  <input value={batchesTitle} onChange={(e) => setBatchesTitle(e.target.value)} placeholder="Batches Section Title" className="h-9 px-3 border border-gray-300 rounded-lg text-xs" />
                                                  <input value={batchesSubtitle} onChange={(e) => setBatchesSubtitle(e.target.value)} placeholder="Batches Subtitle" className="h-9 px-3 border border-gray-300 rounded-lg text-xs" />
                                             </div>
                                             <div className="flex items-center justify-between pt-1">
                                                  <span className="text-[11px] text-gray-500 font-semibold">Batch Schedules ({batchItems.length})</span>
                                                  <button type="button" onClick={addBatchItem} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Batch</button>
                                             </div>
                                             {batchItems.map((b, idx) => (
                                                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2 relative">
                                                       <button type="button" onClick={() => removeBatchItem(idx)} className="absolute top-2 right-2 text-xs text-red-500 font-bold">✕</button>
                                                       <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                                            <input value={b.dayDate || ""} onChange={(e) => updateBatchItemField(idx, "dayDate", e.target.value)} placeholder="Date (01)" className="h-8 px-2 border border-gray-300 rounded text-xs" />
                                                            <input value={b.month || ""} onChange={(e) => updateBatchItemField(idx, "month", e.target.value)} placeholder="Month (JUN)" className="h-8 px-2 border border-gray-300 rounded text-xs" />
                                                            <input value={b.title || ""} onChange={(e) => updateBatchItemField(idx, "title", e.target.value)} placeholder="Title (Weekend)" className="h-8 px-2 border border-gray-300 rounded text-xs" />
                                                            <input value={b.time || ""} onChange={(e) => updateBatchItemField(idx, "time", e.target.value)} placeholder="Time (10:00 AM)" className="h-8 px-2 border border-gray-300 rounded text-xs" />
                                                            <input value={b.status || ""} onChange={(e) => updateBatchItemField(idx, "status", e.target.value)} placeholder="Status (Upcoming)" className="h-8 px-2 border border-gray-300 rounded text-xs" />
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   {/* 4. Course Benefits Cards */}
                                   <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                                             <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">4. Course Benefits Cards</p>
                                             <CopySectionSelector
                                                  sectionName="Course Benefits"
                                                  courses={courses}
                                                  currentCourseId={editItem?._id}
                                                  showToast={showToast}
                                                  onCopy={(c) => {
                                                       setBenefitsTag(c.benefitsTag || "");
                                                       setBenefitsTitle(c.benefitsTitle || "");
                                                       setBenefitsSubtitle(c.benefitsSubtitle || "");
                                                       if (c.benefitsCards) setBenefitsCards(JSON.parse(JSON.stringify(c.benefitsCards)));
                                                  }}
                                             />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                             <input value={benefitsTag} onChange={(e) => setBenefitsTag(e.target.value)} placeholder="Tag (e.g. WHY THIS COURSE)" className={inputClass} />
                                             <input value={benefitsTitle} onChange={(e) => setBenefitsTitle(e.target.value)} placeholder="Section Title" className={inputClass} />
                                             <input value={benefitsSubtitle} onChange={(e) => setBenefitsSubtitle(e.target.value)} placeholder="Section Subtitle" className={inputClass} />
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                             <span className="text-[11px] font-bold text-gray-500 uppercase">Benefit Cards ({benefitsCards.length})</span>
                                             <button type="button" onClick={addBenefitCard} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Benefit Card</button>
                                        </div>
                                        {benefitsCards.map((card, idx) => (
                                             <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 space-y-2 relative">
                                                  <button type="button" onClick={() => removeBenefitCard(idx)} className="absolute top-2 right-2 text-xs text-red-500 font-bold">✕</button>
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                       <input value={card.title || ""} onChange={(e) => updateBenefitCardField(idx, "title", e.target.value)} placeholder="Title" className="h-9 px-3 border border-gray-300 rounded-lg text-xs" />
                                                       <input value={card.iconName || ""} onChange={(e) => updateBenefitCardField(idx, "iconName", e.target.value)} placeholder="Icon Name (e.g. TrendingUp, ShieldCheck)" className="h-9 px-3 border border-gray-300 rounded-lg text-xs" />
                                                  </div>
                                                  <textarea value={card.description || ""} onChange={(e) => updateBenefitCardField(idx, "description", e.target.value)} placeholder="Description" rows={2} className="w-full p-2 border border-gray-300 rounded-lg text-xs" />
                                             </div>
                                        ))}
                                   </div>

                                   {/* 5. Skills You Will Learn */}
                                   <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                                             <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">5. Skills You Will Learn</p>
                                             <CopySectionSelector
                                                  sectionName="Skills You Will Learn"
                                                  courses={courses}
                                                  currentCourseId={editItem?._id}
                                                  showToast={showToast}
                                                  onCopy={(c) => {
                                                       if (c.skillsYouWillLearn) {
                                                            setSkillsYouWillLearnTitle(c.skillsYouWillLearn.title || "");
                                                            setSkillsYouWillLearnItems(c.skillsYouWillLearn.skills ? [...c.skillsYouWillLearn.skills] : []);
                                                       }
                                                  }}
                                             />
                                        </div>
                                        <input value={skillsYouWillLearnTitle} onChange={(e) => setSkillsYouWillLearnTitle(e.target.value)} placeholder="Section Title (e.g. Skills You Will Learn)" className={inputClass} />
                                        <div className="space-y-2 pt-1">
                                             <div className="flex items-center justify-between">
                                                  <span className="text-[11px] font-bold text-gray-500 uppercase">Skill Badges ({skillsYouWillLearnItems.length})</span>
                                                  <button type="button" onClick={addSkillItem} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Skill</button>
                                             </div>
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                  {skillsYouWillLearnItems.map((sk, idx) => (
                                                       <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-gray-200">
                                                            <input value={sk} onChange={(e) => updateSkillItemField(idx, e.target.value)} placeholder="Skill name (e.g. Wireframing)" className="flex-1 h-8 px-2 border border-gray-300 rounded text-xs" />
                                                            <button type="button" onClick={() => removeSkillItem(idx)} className="text-red-500 text-xs font-bold">✕</button>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>
                                   </div>

                                   {/* 6. Who Should Enroll */}
                                   <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                                             <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">6. Who Should Enroll</p>
                                             <CopySectionSelector
                                                  sectionName="Who Should Enroll"
                                                  courses={courses}
                                                  currentCourseId={editItem?._id}
                                                  showToast={showToast}
                                                  onCopy={(c) => {
                                                       if (c.whoShouldEnroll) {
                                                            setWhoShouldEnrollTitle(c.whoShouldEnroll.title || "");
                                                            setWhoShouldEnrollSubtitle(c.whoShouldEnroll.subtitle || "");
                                                            setWhoShouldEnrollItems(c.whoShouldEnroll.items ? JSON.parse(JSON.stringify(c.whoShouldEnroll.items)) : []);
                                                       }
                                                  }}
                                             />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                             <input value={whoShouldEnrollTitle} onChange={(e) => setWhoShouldEnrollTitle(e.target.value)} placeholder="Title (e.g. Who Should Join)" className={inputClass} />
                                             <input value={whoShouldEnrollSubtitle} onChange={(e) => setWhoShouldEnrollSubtitle(e.target.value)} placeholder="Subtitle" className={inputClass} />
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                             <span className="text-[11px] font-bold text-gray-500 uppercase">Audience Cards ({whoShouldEnrollItems.length})</span>
                                             <button type="button" onClick={addWhoShouldEnrollItem} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Audience Card</button>
                                        </div>
                                        {whoShouldEnrollItems.map((item, idx) => (
                                             <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 space-y-2 relative">
                                                  <button type="button" onClick={() => removeWhoShouldEnrollItem(idx)} className="absolute top-2 right-2 text-xs text-red-500 font-bold">✕</button>
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                       <input value={item.title || ""} onChange={(e) => updateWhoShouldEnrollItemField(idx, "title", e.target.value)} placeholder="Title (e.g. Freshers & Beginners)" className="h-9 px-3 border border-gray-300 rounded-lg text-xs" />
                                                       <input value={item.iconName || ""} onChange={(e) => updateWhoShouldEnrollItemField(idx, "iconName", e.target.value)} placeholder="Icon Name (e.g. user, briefcase)" className="h-9 px-3 border border-gray-300 rounded-lg text-xs" />
                                                  </div>
                                                  <textarea value={item.description || ""} onChange={(e) => updateWhoShouldEnrollItemField(idx, "description", e.target.value)} placeholder="Description" rows={2} className="w-full p-2 border border-gray-300 rounded-lg text-xs" />
                                             </div>
                                        ))}
                                   </div>

                                   {/* 7. Job Roles */}
                                   <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                                             <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">7. Career Pathways / Job Roles</p>
                                             <CopySectionSelector
                                                  sectionName="Job Roles"
                                                  courses={courses}
                                                  currentCourseId={editItem?._id}
                                                  showToast={showToast}
                                                  onCopy={(c) => {
                                                       if (c.jobRoles) {
                                                            setJobRolesTag(c.jobRoles.tag || "");
                                                            setJobRolesTitle(c.jobRoles.title || "");
                                                            setJobRolesDescription(c.jobRoles.description || "");
                                                            setJobRolesItems(c.jobRoles.items ? JSON.parse(JSON.stringify(c.jobRoles.items)) : []);
                                                       }
                                                  }}
                                             />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                             <input value={jobRolesTag} onChange={(e) => setJobRolesTag(e.target.value)} placeholder="Tag (e.g. CAREER OUTCOMES)" className={inputClass} />
                                             <input value={jobRolesTitle} onChange={(e) => setJobRolesTitle(e.target.value)} placeholder="Title" className={inputClass} />
                                             <input value={jobRolesDescription} onChange={(e) => setJobRolesDescription(e.target.value)} placeholder="Description" className={inputClass} />
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                             <span className="text-[11px] font-bold text-gray-500 uppercase">Role Steps ({jobRolesItems.length})</span>
                                             <button type="button" onClick={addJobRoleItem} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Job Role</button>
                                        </div>
                                        {jobRolesItems.map((item, idx) => (
                                             <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 space-y-2 relative">
                                                  <button type="button" onClick={() => removeJobRoleItem(idx)} className="absolute top-2 right-2 text-xs text-red-500 font-bold">✕</button>
                                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                       <input value={item.step || ""} onChange={(e) => updateJobRoleItemField(idx, "step", e.target.value)} placeholder="Step (01)" className="h-9 px-3 border border-gray-300 rounded-lg text-xs" />
                                                       <input value={item.title || ""} onChange={(e) => updateJobRoleItemField(idx, "title", e.target.value)} placeholder="Role Title (e.g. UI Designer)" className="h-9 px-3 border border-gray-300 rounded-lg text-xs" />
                                                       <input value={item.iconName || ""} onChange={(e) => updateJobRoleItemField(idx, "iconName", e.target.value)} placeholder="Icon Name" className="h-9 px-3 border border-gray-300 rounded-lg text-xs" />
                                                  </div>
                                                  <textarea value={item.description || ""} onChange={(e) => updateJobRoleItemField(idx, "description", e.target.value)} placeholder="Role Description" rows={2} className="w-full p-2 border border-gray-300 rounded-lg text-xs" />
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                       <input value={item.keyFocusTitle || ""} onChange={(e) => updateJobRoleItemField(idx, "keyFocusTitle", e.target.value)} placeholder="Key Focus Header (KEY FOCUS AREAS)" className="h-8 px-2 border border-gray-300 rounded text-xs" />
                                                       <input value={item.keyFocus || ""} onChange={(e) => updateJobRoleItemField(idx, "keyFocus", e.target.value)} placeholder="Key Focus Content" className="h-8 px-2 border border-gray-300 rounded text-xs" />
                                                  </div>
                                             </div>
                                        ))}
                                   </div>

                                   {/* 8. Hiring Partners */}
                                   <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                                             <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">8. Hiring Partners / Companies</p>
                                             <CopySectionSelector
                                                  sectionName="Hiring Partners"
                                                  courses={courses}
                                                  currentCourseId={editItem?._id}
                                                  showToast={showToast}
                                                  onCopy={(c) => {
                                                       if (c.hiringPartners) {
                                                            setHiringPartnersTitle(c.hiringPartners.title || "");
                                                            setHiringPartnersSubtitle(c.hiringPartners.subtitle || "");
                                                            setHiringPartnersItems(c.hiringPartners.items ? JSON.parse(JSON.stringify(c.hiringPartners.items)) : []);
                                                       }
                                                  }}
                                             />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                             <input value={hiringPartnersTitle} onChange={(e) => setHiringPartnersTitle(e.target.value)} placeholder="Title (e.g. Our Hiring Partners)" className={inputClass} />
                                             <input value={hiringPartnersSubtitle} onChange={(e) => setHiringPartnersSubtitle(e.target.value)} placeholder="Subtitle" className={inputClass} />
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                             <span className="text-[11px] font-bold text-gray-500 uppercase">Partner Logos ({hiringPartnersItems.length})</span>
                                             <button type="button" onClick={addHiringPartnerItem} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Hiring Partner</button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                             {hiringPartnersItems.map((item, idx) => (
                                                  <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 space-y-2 relative">
                                                       <button type="button" onClick={() => removeHiringPartnerItem(idx)} className="absolute top-2 right-2 text-xs text-red-500 font-bold">✕</button>
                                                       <input value={item.name || ""} onChange={(e) => updateHiringPartnerItemField(idx, "name", e.target.value)} placeholder="Partner Company Name" className="w-full h-8 px-2 border border-gray-300 rounded text-xs" />
                                                       <ImageUploader setImage={(file) => updateHiringPartnerItemField(idx, "image", file)} initialImage={item.image} />
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   {/* 9. Meet The Trainers */}
                                   <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                                             <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">9. Meet The Trainers / Mentors</p>
                                             <CopySectionSelector
                                                  sectionName="Trainers"
                                                  courses={courses}
                                                  currentCourseId={editItem?._id}
                                                  showToast={showToast}
                                                  onCopy={(c) => {
                                                       if (c.trainers) {
                                                            setTrainersTitle(c.trainers.title || "");
                                                            setTrainersSubtitle(c.trainers.subtitle || "");
                                                            setTrainersItems(c.trainers.items ? JSON.parse(JSON.stringify(c.trainers.items)) : []);
                                                       }
                                                  }}
                                             />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                             <input value={trainersTitle} onChange={(e) => setTrainersTitle(e.target.value)} placeholder="Title (e.g. Meet Your Instructors)" className={inputClass} />
                                             <input value={trainersSubtitle} onChange={(e) => setTrainersSubtitle(e.target.value)} placeholder="Subtitle" className={inputClass} />
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                             <span className="text-[11px] font-bold text-gray-500 uppercase">Trainer Profiles ({trainersItems.length})</span>
                                             <button type="button" onClick={addTrainerItem} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Trainer</button>
                                        </div>
                                        {trainersItems.map((item, idx) => (
                                             <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 space-y-2 relative">
                                                  <button type="button" onClick={() => removeTrainerItem(idx)} className="absolute top-2 right-2 text-xs text-red-500 font-bold">✕</button>
                                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                       <input value={item.name || ""} onChange={(e) => updateTrainerItemField(idx, "name", e.target.value)} placeholder="Trainer Name" className="h-8 px-2 border border-gray-300 rounded text-xs" />
                                                       <input value={item.role || ""} onChange={(e) => updateTrainerItemField(idx, "role", e.target.value)} placeholder="Role / Designation" className="h-8 px-2 border border-gray-300 rounded text-xs" />
                                                       <input value={item.rating || ""} onChange={(e) => updateTrainerItemField(idx, "rating", e.target.value)} placeholder="Rating (4.9/5)" className="h-8 px-2 border border-gray-300 rounded text-xs" />
                                                  </div>
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                       <input value={item.students || ""} onChange={(e) => updateTrainerItemField(idx, "students", e.target.value)} placeholder="Students Trained (400+)" className="h-8 px-2 border border-gray-300 rounded text-xs" />
                                                       <input value={item.linkedin || ""} onChange={(e) => updateTrainerItemField(idx, "linkedin", e.target.value)} placeholder="LinkedIn Profile URL" className="h-8 px-2 border border-gray-300 rounded text-xs" />
                                                  </div>
                                                  <textarea value={item.bio || ""} onChange={(e) => updateTrainerItemField(idx, "bio", e.target.value)} placeholder="Trainer Bio / Experience" rows={2} className="w-full p-2 border border-gray-300 rounded-lg text-xs" />
                                                  <ImageUploader setImage={(file) => updateTrainerItemField(idx, "image", file)} initialImage={item.image} />
                                             </div>
                                        ))}
                                   </div>

                                   {/* 10. Certification Section */}
                                   <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                                             <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">10. Industry Certification</p>
                                             <CopySectionSelector
                                                  sectionName="Certification"
                                                  courses={courses}
                                                  currentCourseId={editItem?._id}
                                                  showToast={showToast}
                                                  onCopy={(c) => {
                                                       setCertificationTitle(c.certificationTitle || "");
                                                       setCertificationSubtitle(c.certificationSubtitle || "");
                                                       setCertificationBullets(c.certificationBullets ? [...c.certificationBullets] : []);
                                                       if (c.certificationImage) setCertificationImage(c.certificationImage);
                                                  }}
                                             />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                             <input value={certificationTitle} onChange={(e) => setCertificationTitle(e.target.value)} placeholder="Certification Heading" className={inputClass} />
                                             <input value={certificationSubtitle} onChange={(e) => setCertificationSubtitle(e.target.value)} placeholder="Certification Subtitle" className={inputClass} />
                                        </div>
                                        <div className="space-y-1.5 pt-1">
                                             <div className="flex items-center justify-between">
                                                  <span className="text-[11px] font-bold text-gray-500 uppercase">Certification Features/Bullets ({certificationBullets.length})</span>
                                                  <button type="button" onClick={addCertificationBullet} className="text-xs text-orange-600 font-bold cursor-pointer">+ Add Bullet</button>
                                             </div>
                                             {certificationBullets.map((b, idx) => (
                                                  <div key={idx} className="flex gap-2 items-center">
                                                       <input value={b} onChange={(e) => updateCertificationBullet(idx, e.target.value)} placeholder="Feature bullet point" className="flex-1 h-8 px-2 border border-gray-300 rounded text-xs" />
                                                       <button type="button" onClick={() => removeCertificationBullet(idx)} className="text-red-500 text-xs font-bold">✕</button>
                                                  </div>
                                             ))}
                                        </div>
                                        <div className="space-y-1 pt-1">
                                             <label className={labelClass}>Certificate Sample Image Upload</label>
                                             <ImageUploader setImage={setCertificationImage} initialImage={certificationImage} />
                                        </div>
                                   </div>

                                   {/* 11. Ready To Start Journey Banner */}
                                   <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-200 space-y-3">
                                        <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                                             <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">11. Ready To Start Journey CTA Banner</p>
                                             <CopySectionSelector
                                                  sectionName="Ready To Start"
                                                  courses={courses}
                                                  currentCourseId={editItem?._id}
                                                  showToast={showToast}
                                                  onCopy={(c) => {
                                                       if (c.readyToStartJourney) {
                                                            setReadyToStartTitle(c.readyToStartJourney.title || "");
                                                            setReadyToStartSubtitle(c.readyToStartJourney.subtitle || "");
                                                            setReadyToStartBtn1Text(c.readyToStartJourney.button1Text || "");
                                                            setReadyToStartBtn1Link(c.readyToStartJourney.button1Link || "");
                                                            setReadyToStartBtn2Text(c.readyToStartJourney.button2Text || "");
                                                            setReadyToStartBtn2Link(c.readyToStartJourney.button2Link || "");
                                                       }
                                                  }}
                                             />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                             <input value={readyToStartTitle} onChange={(e) => setReadyToStartTitle(e.target.value)} placeholder="Banner Heading (Ready to start...)" className={inputClass} />
                                             <input value={readyToStartSubtitle} onChange={(e) => setReadyToStartSubtitle(e.target.value)} placeholder="Banner Subtitle" className={inputClass} />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                             <div className="space-y-1">
                                                  <input value={readyToStartBtn1Text} onChange={(e) => setReadyToStartBtn1Text(e.target.value)} placeholder="Button 1 Label (e.g. Enroll Now)" className="w-full h-8 px-2 border border-gray-300 rounded text-xs" />
                                                  <input value={readyToStartBtn1Link} onChange={(e) => setReadyToStartBtn1Link(e.target.value)} placeholder="Button 1 Link (#)" className="w-full h-8 px-2 border border-gray-300 rounded text-xs" />
                                             </div>
                                             <div className="space-y-1">
                                                  <input value={readyToStartBtn2Text} onChange={(e) => setReadyToStartBtn2Text(e.target.value)} placeholder="Button 2 Label (e.g. Download Syllabus)" className="w-full h-8 px-2 border border-gray-300 rounded text-xs" />
                                                  <input value={readyToStartBtn2Link} onChange={(e) => setReadyToStartBtn2Link(e.target.value)} placeholder="Button 2 Link (#)" className="w-full h-8 px-2 border border-gray-300 rounded text-xs" />
                                             </div>
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
                                             <CopySectionSelector
                                                  sectionName="Short-Term Courses"
                                                  courses={courses}
                                                  currentCourseId={editItem?._id}
                                                  showToast={showToast}
                                                  onCopy={(c) => {
                                                       if (c.shortTerm) {
                                                            setShortTermTitle(c.shortTerm.title || "");
                                                            setShortTermDescription(c.shortTerm.description || "");
                                                            setShortTermItems(c.shortTerm.items ? JSON.parse(JSON.stringify(c.shortTerm.items)) : []);
                                                       }
                                                  }}
                                             />
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
                                             <div className="flex items-center gap-2">
                                                  <CopySectionSelector
                                                       sectionName="Curriculum / Chapters"
                                                       courses={courses}
                                                       currentCourseId={editItem?._id}
                                                       showToast={showToast}
                                                       onCopy={(c) => {
                                                            const sourceChapters = c.chapter || c.sections || [];
                                                            if (sourceChapters && Array.isArray(sourceChapters)) setChapters(JSON.parse(JSON.stringify(sourceChapters)));
                                                       }}
                                                  />
                                                  <button
                                                       type="button"
                                                       onClick={addChapter}
                                                       className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                                  >
                                                       + Add Chapter
                                                  </button>
                                             </div>
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
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Frequently Asked Questions (FAQs)</p>
                                             <CopySectionSelector
                                                  sectionName="FAQs"
                                                  courses={courses}
                                                  currentCourseId={editItem?._id}
                                                  showToast={showToast}
                                                  onCopy={(c) => {
                                                       setFaqTitle(c.faqTitle || "");
                                                       setFaqStartheading(c.faqStartheading || "");
                                                       setFaqMidheading(c.faqMidheading || "");
                                                       setFaqEndheading(c.faqEndheading || "");
                                                       setFaqDescription(c.faqDescription || "");
                                                       if (c.faq && Array.isArray(c.faq)) setFaqItems(JSON.parse(JSON.stringify(c.faq)));
                                                  }}
                                             />
                                        </div>

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

               {/* ZOOM MEETING DISPATCH MODAL */}
               {showMeetModal && (
                    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 text-white space-y-4 shadow-2xl relative">
                              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                   <div>
                                        <h3 className="font-bold text-lg text-blue-400 flex items-center gap-2">
                                             Dispatch Zoom Live Meeting
                                        </h3>
                                        <p className="text-xs text-zinc-400 mt-0.5">
                                             {selectedCourseForMeet
                                                  ? `Target Course: ${selectedCourseForMeet.title}`
                                                  : "Select a specific course or dispatch to all enrolled students"}
                                        </p>
                                   </div>
                                   <button
                                        type="button"
                                        onClick={() => setShowMeetModal(false)}
                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition"
                                   >
                                        ✕
                                   </button>
                              </div>

                              {/* Target Course Select Dropdown */}
                              <div className="space-y-1">
                                   <label className="text-xs font-bold text-zinc-300">Target Course (Enrolled Access Filter) *</label>
                                   <select
                                        value={selectedCourseForMeet?._id || "ALL"}
                                        onChange={(e) => {
                                             const val = e.target.value;
                                             if (val === "ALL") {
                                                  setSelectedCourseForMeet(null);
                                             } else {
                                                  const found = courses.find((c) => String(c._id) === String(val));
                                                  setSelectedCourseForMeet(found || null);
                                                  if (found && !meetTitle) {
                                                       setMeetTitle(`Live Session: ${found.title}`);
                                                  }
                                             }
                                        }}
                                        className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
                                   >
                                        <option value="ALL">All Enrolled Students (Across All Courses)</option>
                                        {courses.map((c) => (
                                             <option key={c._id} value={c._id}>
                                                  {c.title} {c.category ? `(${c.category})` : ""}
                                             </option>
                                        ))}
                                   </select>
                                   <p className="text-[11px] text-zinc-400 pt-0.5">
                                        {selectedCourseForMeet
                                             ? `Strictly sends Zoom link to students enrolled in "${selectedCourseForMeet.title}"`
                                             : "Sends Zoom link to all registered students"}
                                   </p>
                              </div>

                              {/* Topic / Session Title */}
                              <div className="space-y-1">
                                   <label className="text-xs font-bold text-zinc-300">Session Topic / Title</label>
                                   <input
                                        type="text"
                                        value={meetTitle}
                                        onChange={(e) => setMeetTitle(e.target.value)}
                                        placeholder="e.g. Interactive UI/UX Live Design Review"
                                        className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                                   />
                              </div>

                              {/* Auto Generate Button & Zoom Link */}
                              <div className="space-y-1.5">
                                   <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-zinc-300">Zoom Meeting Link *</label>
                                        <button
                                             type="button"
                                             onClick={handleAutoGenerateZoomLink}
                                             disabled={generatingZoomApi}
                                             className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                        >
                                             {generatingZoomApi ? "Creating Zoom API Meeting..." : "Auto-Generate Real Link"}
                                        </button>
                                   </div>

                                   <input
                                        type="url"
                                        value={meetUrl}
                                        onChange={(e) => handleMeetUrlChange(e.target.value)}
                                        placeholder="https://us04web.zoom.us/j/81234567890?pwd=xxxx"
                                        className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                                   />
                              </div>

                              {/* Meeting ID & Passcode */}
                              <div className="grid grid-cols-2 gap-3">
                                   <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-zinc-400">Meeting ID</label>
                                        <input
                                             type="text"
                                             value={zoomMeetingId}
                                             onChange={(e) => setZoomMeetingId(e.target.value)}
                                             placeholder="812 3456 7890"
                                             className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                                        />
                                   </div>
                                   <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-zinc-400">Passcode</label>
                                        <input
                                             type="text"
                                             value={zoomPasscode}
                                             onChange={(e) => setZoomPasscode(e.target.value)}
                                             placeholder="Passcode"
                                             className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                                        />
                                   </div>
                              </div>

                              {/* Scheduled Time */}
                              <div className="space-y-1">
                                   <label className="text-[11px] font-bold text-zinc-400">Scheduled Time / Status</label>
                                   <input
                                        type="text"
                                        value={scheduledAt}
                                        onChange={(e) => setScheduledAt(e.target.value)}
                                        placeholder="e.g. Today at 7:00 PM"
                                        className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                                   />
                              </div>

                              {/* Instructions (Full Width & Multi-line Textarea) */}
                              <div className="space-y-1">
                                   <label className="text-[11px] font-bold text-zinc-400">Instructions / Notes (Optional)</label>
                                   <textarea
                                        rows={3}
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        placeholder="e.g. Please keep Figma open before joining the meeting. Ensure stable internet connection."
                                        className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                                   />
                              </div>

                              {/* Submit Button */}
                              <div className="pt-2">
                                   <button
                                        type="button"
                                        onClick={handleSendMeetLink}
                                        disabled={sendingMeetEmail || !meetUrl}
                                        className={`w-full py-3 text-black font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                                             sendingMeetEmail || !meetUrl
                                                  ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                                                  : "bg-primary hover:bg-primary-hover text-white"
                                        }`}
                                   >
                                        {sendingMeetEmail ? (
                                             <>
                                                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                                  <span>Dispatching Invites & Saving...</span>
                                             </>
                                        ) : (
                                             <span>Dispatch Live Meeting & Notify Enrolled Students</span>
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

function CopySectionSelector({ sectionName, courses, currentCourseId, onCopy, showToast }) {
     if (!courses || courses.length === 0) return null;

     return (
          <div className="flex items-center gap-1">
               <select
                    defaultValue=""
                    onChange={(e) => {
                         const sourceId = e.target.value;
                         if (!sourceId) return;
                         const selectedCourse = courses.find((c) => String(c._id) === String(sourceId));
                         if (selectedCourse) {
                              onCopy(selectedCourse);
                              if (showToast) {
                                   showToast(`Copied ${sectionName} data from "${selectedCourse.title || selectedCourse.coursename || "Selected Course"}"!`);
                              }
                         }
                         e.target.value = "";
                    }}
                    className="h-7 px-2 bg-orange-50/80 hover:bg-orange-100 border border-orange-200 focus:border-orange-500 text-orange-700 text-[11px] font-bold rounded-lg shadow-2xs transition-all cursor-pointer outline-none max-w-52"
               >
                    <option value="" disabled>
                         📋 Copy {sectionName} from...
                    </option>
                    {courses.map((c) => (
                         <option key={c._id} value={c._id} disabled={String(c._id) === String(currentCourseId)}>
                              {c.title || c.coursename || c.slug} {String(c._id) === String(currentCourseId) ? " (Current)" : ""}
                         </option>
                    ))}
               </select>
          </div>
     );
}