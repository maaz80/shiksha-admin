import { useEffect, useState, useRef } from "react";
import { getAdminToken } from "../utils/auth.js";
import Breadcrumb from "../components/BreadCrumb.jsx";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export default function Courses() {

     const [courses, setCourses] = useState([]);
     const [showModal, setShowModal] = useState(false);
     const [editItem, setEditItem] = useState(null);

     const [showReviewsModal, setShowReviewsModal] = useState(false);
     const [selectedCourseForReviews, setSelectedCourseForReviews] = useState(null);
     const [reviewName, setReviewName] = useState("");
     const [reviewRole, setReviewRole] = useState("");
     const [reviewRating, setReviewRating] = useState(5);
     const [reviewText, setReviewText] = useState("");
     const [reviewerImage, setReviewerImage] = useState(null);
     const [reviewSubmitting, setReviewSubmitting] = useState(false);
     const fileInputRef = useRef(null);

     const [title, setTitle] = useState("");
     const [category, setCategory] = useState("");
     const [name, setName] = useState("");
     const [courseLength, setCourseLength] = useState("");
     const [students, setStudents] = useState("");
     const [level, setLevel] = useState("");
     const [totalLessons, setTotalLessons] = useState("");
     const [overview, setOverview] = useState("");
     const [fees, setFees] = useState("");
     const [deadline, setDeadline] = useState("");
     const [alt, setAlt] = useState("");
     const [seoTitle, setSeoTitle] = useState("");
     const [seoDescription, setSeoDescription] = useState("");

     const [image, setImage] = useState(null);
     const [sections, setSections] = useState([]);

     const fetchCourses = async () => {
          const res = await fetch(`${API_URL}/courses`);
          const data = await res.json();
          setCourses(data);
     };

     useEffect(() => {
          fetchCourses();
     }, []);

     const resetForm = () => {
          setTitle("");
          setCategory("");
          setName("");
          setCourseLength("");
          setStudents("");
          setLevel("");
          setTotalLessons("");
          setOverview("");
          setFees("");
          setDeadline("");
          setAlt("");
          setSeoTitle("");
          setSeoDescription("");
          setSections([]);
          setImage(null);
     };

     const uploadLessonVideo = (file, sectionIndex, lessonIndex) => {
          if (!file) return;

          if (file.size > 50 * 1024 * 1024) {
               updateLesson(sectionIndex, lessonIndex, "uploadError", "File must be smaller than 50 MB.");
               return;
          }

          updateLesson(sectionIndex, lessonIndex, "uploading", true);
          updateLesson(sectionIndex, lessonIndex, "uploadProgress", 0);
          updateLesson(sectionIndex, lessonIndex, "uploadError", "");
          updateLesson(sectionIndex, lessonIndex, "videoName", file.name);

          const xhr = new XMLHttpRequest();
          xhr.open("POST", `${API_URL}/courses/video`);
          xhr.setRequestHeader("Authorization", `Bearer ${getAdminToken()}`);

          xhr.upload.onprogress = (event) => {
               if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    updateLesson(sectionIndex, lessonIndex, "uploadProgress", percent);
               }
          };

          xhr.onload = () => {
               if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    updateLesson(sectionIndex, lessonIndex, "videoUrl", response.url || "");
                    updateLesson(sectionIndex, lessonIndex, "uploading", false);
                    updateLesson(sectionIndex, lessonIndex, "uploadStatus", "done");
                    updateLesson(sectionIndex, lessonIndex, "uploadProgress", 100);
               } else {
                    const result = xhr.responseText ? JSON.parse(xhr.responseText) : {};
                    updateLesson(sectionIndex, lessonIndex, "uploading", false);
                    updateLesson(sectionIndex, lessonIndex, "uploadError", result.error || "Upload failed.");
                    updateLesson(sectionIndex, lessonIndex, "uploadStatus", "error");
               }
          };

          xhr.onerror = () => {
               updateLesson(sectionIndex, lessonIndex, "uploading", false);
               updateLesson(sectionIndex, lessonIndex, "uploadError", "Upload failed. Please try again.");
               updateLesson(sectionIndex, lessonIndex, "uploadStatus", "error");
          };

          const payload = new FormData();
          payload.append("video", file);
          xhr.send(payload);
     };

     const shouldDisableSave = () => {
          return sections.some(section =>
               section.lessons.some(lesson => lesson.uploading || (lesson.videoName && !lesson.videoUrl && lesson.uploadStatus !== "done"))
          );
     };

     const openUpload = () => {
          setEditItem(null);
          resetForm();
          setShowModal(true);
     };

     const openEdit = (course) => {
          setEditItem(course);
          setTitle(course.title);
          setCategory(course.category);
          setName(course.name);
          setCourseLength(course.courseLength);
          setStudents(course.students);
          setLevel(course.level);
          setTotalLessons(course.totalLessons);
          setOverview(course.overview || "");
          setFees(course.fees || "");
          setDeadline(course.deadline || "");
          setSections(course.sections || []);
          setAlt(course.alt || "");
          setSeoTitle(course.seoTitle || "");
          setSeoDescription(course.seoDescription || "");
          setShowModal(true);
     };

     const saveCourse = async () => {
          const formData = new FormData();
          formData.append("title", title);
          formData.append("category", category);
          formData.append("name", name);
          formData.append("courseLength", courseLength);
          formData.append("students", students);
          formData.append("level", level);
          formData.append("totalLessons", totalLessons);
          formData.append("overview", overview);
          formData.append("fees", fees);
          formData.append("deadline", deadline);
          formData.append("sections", JSON.stringify(sections));
          formData.append("alt", alt);
          formData.append("seoTitle", seoTitle);
          formData.append("seoDescription", seoDescription);
          if (image) formData.append("image", image);

          if (editItem) {
               await fetch(`${API_URL}/courses/${editItem._id}`, { method: "PUT", body: formData });
          } else {
               await fetch(`${API_URL}/courses`, { method: "POST", body: formData });
          }

          setShowModal(false);
          fetchCourses();
     };

     const deleteCourse = async (id) => {
          await fetch(`${API_URL}/courses/${id}`, { method: "DELETE" });
          fetchCourses();
     };

     const openReviewsModal = (course) => {
          setSelectedCourseForReviews(course);
          setReviewName("");
          setReviewRole("");
          setReviewRating(5);
          setReviewText("");
          setReviewerImage(null);
          if (fileInputRef.current) {
               fileInputRef.current.value = "";
          }
          setShowReviewsModal(true);
     };

     const handleAddReview = async (e) => {
          e.preventDefault();
          if (!reviewName || !reviewText) {
               alert("Please fill in all fields.");
               return;
          }

          setReviewSubmitting(true);
          try {
               const formData = new FormData();
               formData.append("name", reviewName);
               formData.append("role", reviewRole);
               formData.append("rating", String(reviewRating));
               formData.append("text", reviewText);
               if (reviewerImage) {
                    formData.append("image", reviewerImage);
               }

               const res = await fetch(`${API_URL}/courses/${selectedCourseForReviews._id}/reviews`, {
                    method: "POST",
                    body: formData
               });

               if (res.ok) {
                    const updatedCourse = await res.json();
                    setSelectedCourseForReviews(updatedCourse);
                    setReviewName("");
                    setReviewRole("");
                    setReviewRating(5);
                    setReviewText("");
                    setReviewerImage(null);
                    if (fileInputRef.current) {
                         fileInputRef.current.value = "";
                    }
                    fetchCourses();
               } else {
                    alert("Failed to add review.");
               }
          } catch (error) {
               console.error(error);
               alert("An error occurred.");
          } finally {
               setReviewSubmitting(false);
          }
     };

     const handleDeleteReview = async (reviewId) => {
          if (!window.confirm("Are you sure you want to delete this review?")) return;

          const res = await fetch(`${API_URL}/courses/${selectedCourseForReviews._id}/reviews/${reviewId}`, {
               method: "DELETE"
          });

          if (res.ok) {
               const updatedCourse = await res.json();
               setSelectedCourseForReviews(updatedCourse);
               fetchCourses();
          } else {
               alert("Failed to delete review.");
          }
     };

     const addSection = () => {
          setSections([...sections, { title: "", lessons: [] }]);
     };

     const updateSectionTitle = (index, value) => {
          const updated = [...sections];
          updated[index].title = value;
          setSections(updated);
     };

     const removeSection = (index) => {
          const updated = sections.filter((_, i) => i !== index);
          setSections(updated);
     };

     const addLesson = (sectionIndex) => {
          const updated = [...sections];
          updated[sectionIndex].lessons.push({
               title: "",
               duration: "",
               isPreview: false,
               isLocked: true,
               videoUrl: "",
               videoName: "",
               uploadProgress: 0,
               uploading: false,
               uploadStatus: "idle",
               uploadError: ""
          });
          setSections(updated);
     };

     const updateLesson = (sectionIndex, lessonIndex, key, value) => {
          const updated = [...sections];
          updated[sectionIndex].lessons[lessonIndex][key] = value;
          setSections(updated);
     };

     const removeLesson = (sectionIndex, lessonIndex) => {
          const updated = [...sections];
          updated[sectionIndex].lessons.splice(lessonIndex, 1);
          setSections(updated);
     };

     const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent focus:bg-white transition-all duration-200";

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
               <Breadcrumb />
               {/* Header */}
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-6 lg:px-10 max-w-7xl mx-auto">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Course Manager</h1>
                         <p className="text-sm text-gray-500 mt-1">{courses.length} course{courses.length !== 1 ? "s" : ""} available</p>
                    </div>

                    <button
                         onClick={openUpload}
                         className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0"
                    >
                         <svg xmlns="http://www.w3.org/2500/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                         </svg>
                         Add Course
                    </button>
               </div>

               {/* Course Grid */}
               {courses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-gray-300 px-6 lg:px-10 max-w-7xl mx-auto">
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                         </svg>
                         <p className="text-lg font-medium text-gray-700">No courses yet</p>
                         <p className="text-sm mt-1 text-gray-400">Click "Add Course" to get started</p>
                    </div>
               ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-6 lg:px-10 max-w-7xl mx-auto">
                         {courses.map(course => (
                              <div key={course._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">

                                   <div className="relative overflow-hidden">
                                        <img
                                             src={course.image}
                                             className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                                             alt={course.title}
                                        />
                                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-orange-500 text-xs font-semibold px-3 py-1 rounded-full border border-orange-100">
                                             {course.category}
                                        </span>
                                   </div>

                                   <div className="p-5">
                                        <h2 className="font-semibold text-gray-900 text-base leading-snug mb-1 line-clamp-2">{course.title}</h2>
                                        <p className="text-xs text-gray-400 mb-4">{course.name}</p>

                                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
                                             <span className="flex items-center gap-1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                  {course.courseLength}
                                             </span>
                                             <span className="flex items-center gap-1">
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                  {course.students}
                                             </span>
                                             <span className="ml-auto bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-medium">{course.level}</span>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                                             <button
                                                  onClick={() => openEdit(course)}
                                                  className="flex-1 flex items-center justify-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-semibold py-2 rounded-xl transition-colors duration-200"
                                             >
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                  Edit
                                             </button>
                                             <button
                                                  onClick={() => openReviewsModal(course)}
                                                  className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold py-2 rounded-xl transition-colors duration-200"
                                             >
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                                  Reviews
                                             </button>
                                             <button
                                                  onClick={() => deleteCourse(course._id)}
                                                  className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold py-2 rounded-xl transition-colors duration-200"
                                             >
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                  Delete
                                             </button>
                                        </div>
                                   </div>

                              </div>
                         ))}
                    </div>
               )}

               {/* MODAL */}
               {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">

                              {/* Modal Header */}
                              <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                             {editItem ? "Edit Course" : "Add New Course"}
                                        </h2>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                             {editItem ? "Update course details below" : "Fill in the details to create a course"}
                                        </p>
                                   </div>
                                   <button
                                        onClick={() => setShowModal(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                                   >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                   </button>
                              </div>

                              <div className="px-7 py-6 space-y-5">

                                   {/* Basic Info */}
                                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Basic Info</p>

                                   <input placeholder="Course Title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
                                   <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} />
                                   <input placeholder="Author Name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />

                                   <div className="grid grid-cols-3 gap-3">
                                        <input placeholder="Course Length" value={courseLength} onChange={(e) => setCourseLength(e.target.value)} className={inputClass} />
                                        <input placeholder="Students" value={students} onChange={(e) => setStudents(e.target.value)} className={inputClass} />
                                        <input placeholder="Level" value={level} onChange={(e) => setLevel(e.target.value)} className={inputClass} />
                                   </div>

                                   <input placeholder="Total Lessons" value={totalLessons} onChange={(e) => setTotalLessons(e.target.value)} className={inputClass} />

                                   <textarea
                                        placeholder="Overview"
                                        value={overview}
                                        onChange={(e) => setOverview(e.target.value)}
                                        className={`${inputClass} min-h-28 resize-none`}
                                   />

                                   <div className="grid grid-cols-2 gap-3">
                                        <input placeholder="Fees" value={fees} onChange={(e) => setFees(e.target.value)} className={inputClass} />
                                        <input placeholder="Deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={inputClass} />
                                   </div>

                                   {/* SEO Info */}
                                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest pt-2">SEO Settings</p>
                                   <input placeholder="SEO Title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} />
                                   <textarea
                                        placeholder="SEO Description"
                                        value={seoDescription}
                                        onChange={(e) => setSeoDescription(e.target.value)}
                                        className={`${inputClass} min-h-20 resize-none`}
                                   />

                                   {/* Image Upload */}
                                   <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Cover Image</p>
                                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-orange-50 hover:border-orange-300 cursor-pointer transition-colors duration-200 group mb-2">
                                             <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-gray-300 group-hover:text-orange-400 mb-2 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                             <span className="text-xs text-gray-400 group-hover:text-orange-500 transition-colors">
                                                  {image ? image.name : "Click to upload image"}
                                             </span>
                                             <input type="file" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
                                        </label>
                                        <input
                                             placeholder="Image Alt Tag"
                                             value={alt}
                                             onChange={(e) => setAlt(e.target.value)}
                                             className={inputClass}
                                        />
                                   </div>

                                   {/* Curriculum */}
                                   <div>
                                        <div className="flex items-center justify-between mb-3">
                                             <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Curriculum</p>
                                             <button
                                                  onClick={addSection}
                                                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                                             >
                                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                                  Add Section
                                             </button>
                                        </div>

                                        <div className="space-y-3">
                                             {sections.map((section, i) => (
                                                  <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">

                                                       {/* Section Header */}
                                                       <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-100">
                                                            <span className="w-6 h-6 flex items-center justify-center bg-orange-100 text-orange-600 text-xs font-bold rounded-md shrink-0">
                                                                 {i + 1}
                                                            </span>
                                                            <input
                                                                 placeholder="Section Title"
                                                                 value={section.title}
                                                                 onChange={(e) => updateSectionTitle(i, e.target.value)}
                                                                 className="flex-1 text-sm font-medium bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
                                                            />
                                                            <button
                                                                 onClick={() => removeSection(i)}
                                                                 className="w-6 h-6 flex items-center justify-center rounded-md bg-red-50 hover:bg-red-100 text-red-400 transition-colors shrink-0"
                                                            >
                                                                 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                                            </button>
                                                       </div>

                                                       {/* Lessons */}
                                                       <div className="p-3 space-y-2">
                                                            {section.lessons.map((lesson, j) => (
                                                                 <div key={j} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                                                                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                                           <div className="flex-1 min-w-0">
                                                                                <input
                                                                                     placeholder="Lesson Title"
                                                                                     value={lesson.title}
                                                                                     onChange={(e) => updateLesson(i, j, "title", e.target.value)}
                                                                                     className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-orange-300"
                                                                                />
                                                                           </div>

                                                                           <div className="flex items-center gap-2">
                                                                                <input
                                                                                     placeholder="0:00"
                                                                                     value={lesson.duration}
                                                                                     onChange={(e) => updateLesson(i, j, "duration", e.target.value)}
                                                                                     className="w-24 text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-700 text-center focus:outline-none focus:border-orange-300"
                                                                                />
                                                                                <button
                                                                                     onClick={() => removeLesson(i, j)}
                                                                                     className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                                                                                >
                                                                                     <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                                                </button>
                                                                           </div>
                                                                      </div>

                                                                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                                           <label className="flex flex-col text-sm text-gray-600 gap-2">
                                                                                Lesson video
                                                                                <input
                                                                                     type="file"
                                                                                     accept="video/mp4,video/webm,video/quicktime"
                                                                                     onChange={(e) => {
                                                                                          const file = e.target.files?.[0];
                                                                                          if (file) uploadLessonVideo(file, i, j);
                                                                                     }}
                                                                                     className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
                                                                                />
                                                                           </label>

                                                                           <div className="space-y-2">
                                                                                {lesson.videoName && (
                                                                                     <div className="text-sm text-gray-700">Selected: {lesson.videoName}</div>
                                                                                )}
                                                                                {lesson.uploading && (
                                                                                     <div className="rounded-full bg-gray-200 h-2 overflow-hidden">
                                                                                          <div className="h-2 bg-orange-500 transition-all" style={{ width: `${lesson.uploadProgress || 0}%` }} />
                                                                                     </div>
                                                                                )}
                                                                                {lesson.uploadStatus === "done" && !lesson.uploading && (
                                                                                     <div className="text-sm text-green-600">Video uploaded successfully.</div>
                                                                                )}
                                                                                {lesson.uploadError && (
                                                                                     <div className="text-sm text-red-600">{lesson.uploadError}</div>
                                                                                )}
                                                                           </div>
                                                                      </div>


                                                                 </div>
                                                            ))}

                                                            <button
                                                                 onClick={() => addLesson(i)}
                                                                 className="flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-blue-600 px-2 py-1.5 transition-colors"
                                                            >
                                                                 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                                                 Add Lesson
                                                            </button>
                                                       </div>

                                                  </div>
                                             ))}

                                             {sections.length === 0 && (
                                                  <div className="text-center py-8 text-gray-300">
                                                       <p className="text-sm">No sections yet. Add one above.</p>
                                                  </div>
                                             )}
                                        </div>
                                   </div>

                              </div>

                              {/* Modal Footer */}
                              <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
                                   <button
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200"
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        onClick={saveCourse}
                                        disabled={shouldDisableSave()}
                                        className="px-6 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 disabled:bg-orange-300 disabled:cursor-not-allowed"
                                   >
                                        {editItem ? "Save Changes" : "Create Course"}
                                   </button>
                              </div>

                         </div>
                    </div>
               )}

               {/* REVIEWS MODAL */}
               {showReviewsModal && selectedCourseForReviews && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                              
                              {/* Modal Header */}
                              <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                             Manage Reviews: {selectedCourseForReviews.title}
                                        </h2>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                             Add and view reviews for this course
                                        </p>
                                   </div>
                                   <button
                                        onClick={() => setShowReviewsModal(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                                   >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                   </button>
                              </div>

                              <div className="px-7 py-6 space-y-6">
                                   {/* Add Review Form */}
                                   <form onSubmit={handleAddReview} className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                                        <h3 className="text-sm font-semibold text-gray-800">Add New Review</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                             <div>
                                                  <label className="block text-xs font-medium text-gray-500 mb-1">Reviewer Name</label>
                                                  <input
                                                       type="text"
                                                       placeholder="John Doe"
                                                       value={reviewName}
                                                       onChange={(e) => setReviewName(e.target.value)}
                                                       className={inputClass}
                                                       required
                                                  />
                                             </div>
                                             <div>
                                                  <label className="block text-xs font-medium text-gray-500 mb-1">Reviewer Role</label>
                                                  <input
                                                       type="text"
                                                       placeholder="e.g. Web Developer"
                                                       value={reviewRole}
                                                       onChange={(e) => setReviewRole(e.target.value)}
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div>
                                                  <label className="block text-xs font-medium text-gray-500 mb-1">Rating (Stars)</label>
                                                  <select
                                                       value={reviewRating}
                                                       onChange={(e) => setReviewRating(e.target.value)}
                                                       className={inputClass}
                                                  >
                                                       <option value="5">5 Stars</option>
                                                       <option value="4">4 Stars</option>
                                                       <option value="3">3 Stars</option>
                                                       <option value="2">2 Stars</option>
                                                       <option value="1">1 Star</option>
                                                  </select>
                                             </div>
                                        </div>
                                        <div>
                                             <label className="block text-xs font-medium text-gray-500 mb-1">Reviewer Profile Image</label>
                                             <input
                                                  type="file"
                                                  accept="image/*"
                                                  ref={fileInputRef}
                                                  onChange={(e) => setReviewerImage(e.target.files[0])}
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div>
                                             <label className="block text-xs font-medium text-gray-500 mb-1">Review Description</label>
                                             <textarea
                                                  placeholder="Write your review here..."
                                                  value={reviewText}
                                                  onChange={(e) => setReviewText(e.target.value)}
                                                  className={`${inputClass} min-h-20 resize-none`}
                                                  required
                                             />
                                        </div>
                                        <div className="flex justify-end">
                                             <button
                                                  type="submit"
                                                  disabled={reviewSubmitting}
                                                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed flex items-center gap-1.5"
                                             >
                                                  {reviewSubmitting && (
                                                       <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                       </svg>
                                                  )}
                                                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                                             </button>
                                        </div>
                                   </form>

                                   {/* Reviews List */}
                                   <div className="space-y-3">
                                        <h3 className="text-sm font-semibold text-gray-800">Existing Reviews ({selectedCourseForReviews.reviews?.length || 0})</h3>
                                        {(!selectedCourseForReviews.reviews || selectedCourseForReviews.reviews.length === 0) ? (
                                             <p className="text-xs text-gray-400 text-center py-6">No reviews added for this course yet.</p>
                                        ) : (
                                             <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                                  {selectedCourseForReviews.reviews.map((rev, index) => (
                                                       <div key={rev._id} className="bg-white border border-gray-100 rounded-xl p-3 flex justify-between items-start gap-4">
                                                            <div className="flex items-start gap-3">
                                                                 <img
                                                                      src={rev.image || `https://i.pravatar.cc/40?img=${(index % 20) + 1}`}
                                                                      className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0"
                                                                      alt={rev.name}
                                                                 />
                                                                 <div className="space-y-1">
                                                                      <div className="flex flex-wrap items-center gap-2">
                                                                           <span className="font-semibold text-sm text-gray-800">{rev.name}</span>
                                                                           {rev.role && (
                                                                                <span className="text-[10px] font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
                                                                                     {rev.role}
                                                                                </span>
                                                                           )}
                                                                           <span className="flex items-center text-xs text-yellow-500">
                                                                                {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                                                                                     <svg key={i} xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                                                                ))}
                                                                           </span>
                                                                           <span className="text-[10px] text-gray-450">
                                                                                {new Date(rev.date).toLocaleDateString()}
                                                                           </span>
                                                                      </div>
                                                                      <p className="text-xs text-gray-650 leading-relaxed">{rev.text}</p>
                                                                 </div>
                                                            </div>
                                                            <button
                                                                 onClick={() => handleDeleteReview(rev._id)}
                                                                 className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors shrink-0"
                                                                 title="Delete Review"
                                                            >
                                                                 <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                       </div>
                                                  ))}
                                             </div>
                                        )}
                                   </div>
                              </div>

                              {/* Modal Footer */}
                              <div className="flex items-center justify-end px-7 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                                   <button
                                        onClick={() => setShowReviewsModal(false)}
                                        className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
                                   >
                                        Close
                                   </button>
                              </div>

                         </div>
                    </div>
               )}

          </div>
     );
}