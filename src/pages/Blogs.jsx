import { useEffect, useState } from "react";
import Editor from "../components/Editor";
import ImageUploader from "../components/ImageUploader";
import Breadcrumb from "../components/BreadCrumb";
import { HiOutlinePlus, HiOutlineTrash, HiOutlineBookOpen, HiOutlineCalendar, HiOutlineUser, HiOutlineSparkles, HiOutlinePencilAlt } from "react-icons/hi";
import { getAdminToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function Blogs() {
     const [blogs, setBlogs] = useState([]);
     const [showModal, setShowModal] = useState(false);
     const [editItem, setEditItem] = useState(null);
     const [uploading, setUploading] = useState(false);
     
     // Blog Author States
     const [title, setTitle] = useState("");
     const [alt, setAlt] = useState("");
     const [category, setCategory] = useState("");
     const [date, setDate] = useState("");
     const [author, setAuthor] = useState("");
     const [authorDesignation, setAuthorDesignation] = useState("");
     const [authorImage, setAuthorImage] = useState("");
     const [authorImageFile, setAuthorImageFile] = useState(null);
     const [authorBio, setAuthorBio] = useState("");
     const [authorTwitter, setAuthorTwitter] = useState("");
     
     const [content, setContent] = useState("");
     const [image, setImage] = useState(null);
     const [seoTitle, setSeoTitle] = useState("");
     const [seoDescription, setSeoDescription] = useState("");
     const [schemas, setSchemas] = useState([]);
     const [slug, setSlug] = useState("");
     const [description, setDescription] = useState("");
     const [faq, setFaq] = useState([]);
     const [toast, setToast] = useState({ show: false, message: "" });

     // Author Template States
     const [activeTab, setActiveTab] = useState("blogs"); // "blogs" | "templates"
     const [authorTemplates, setAuthorTemplates] = useState([]);
     const [showTemplateModal, setShowTemplateModal] = useState(false);
     const [editTemplateItem, setEditTemplateItem] = useState(null);
     const [tplName, setTplName] = useState("");
     const [tplDesignation, setTplDesignation] = useState("");
     const [tplImage, setTplImage] = useState("");
     const [tplImageFile, setTplImageFile] = useState(null);
     const [tplBio, setTplBio] = useState("");
     const [tplTwitter, setTplTwitter] = useState("");
     const [tplSaving, setTplSaving] = useState(false);

     const displayToast = (message) => {
          setToast({ show: true, message });
          setTimeout(() => setToast({ show: false, message: "" }), 3000);
     };

     // Blog Page Titles States
     const [blogstitle, setBlogstitle] = useState("Our Blogs");
     const [featuredblogstitle, setFeaturedblogstitle] = useState("Featured Blogs");
     const [savingTitles, setSavingTitles] = useState(false);

     const fetchBlogs = async () => {
          try {
               const res = await fetch(`${API_URL}/blogs`);
               const data = await res.json();
               if (Array.isArray(data)) setBlogs(data);
          } catch (err) {
               console.error("Error fetching blogs:", err);
          }
     };

     const fetchAuthorTemplates = async () => {
          try {
               const res = await fetch(`${API_URL}/author-templates`);
               if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) setAuthorTemplates(data);
               }
          } catch (err) {
               console.error("Error fetching author templates:", err);
          }
     };

     const fetchBlogPageData = async () => {
          try {
               const res = await fetch(`${API_URL}/blogpage-data`);
               if (res.ok) {
                    const data = await res.json();
                    if (data) {
                         setBlogstitle(data.blogstitle || "Our Blogs");
                         setFeaturedblogstitle(data.featuredblogstitle || "Featured Blogs");
                    }
               }
          } catch (err) {
               console.error("Error fetching blog page titles:", err);
          }
     };

     useEffect(() => {
          fetchBlogs();
          fetchAuthorTemplates();
          fetchBlogPageData();
     }, []);

     const saveBlogPageTitles = async () => {
          try {
               setSavingTitles(true);
               const res = await fetch(`${API_URL}/blogpage-data`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json",
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: JSON.stringify({
                         blogstitle,
                         featuredblogstitle
                    })
               });
               if (res.ok) {
                    alert("Blog Page Titles saved successfully!");
               } else {
                    alert("Failed to save blog page titles.");
               }
          } catch (err) {
               console.error("Error saving blog page titles:", err);
               alert("Server error occurred.");
          } finally {
               setSavingTitles(false);
          }
     };

     // Open Modal for Blog Upload
     const openUpload = () => {
          setEditItem(null);
          setTitle("");
          setAlt("");
          setCategory("");
          setDate("");
          setAuthor("");
          setAuthorDesignation("");
          setAuthorImage("");
          setAuthorImageFile(null);
          setAuthorBio("");
          setAuthorTwitter("");
          setContent("");
          setImage(null);
          setSeoTitle("");
          setSchemas([]);
          setDescription("");
          setSeoDescription("");
          setSlug("");
          setFaq([]);
          setShowModal(true);
     };

     // Open Modal for Blog Edit
     const openEdit = (blog) => {
          setEditItem(blog);
          setTitle(blog.title);
          setDescription(blog.description);
          setAlt(blog.alt);
          setCategory(blog.category);
          setDate(blog.date);
          setAuthor(blog.author || "");
          setAuthorDesignation(blog.authorDesignation || "");
          setAuthorImage(blog.authorImage || "");
          setAuthorImageFile(null);
          setAuthorBio(blog.authorBio || "");
          setAuthorTwitter(blog.authorSocial?.twitter || (typeof blog.authorSocial === "string" ? blog.authorSocial : ""));
          setContent(blog.content);
          setImage(null);
          setSeoTitle(blog.seoTitle || "");
          setSeoDescription(blog.seoDescription || "");
          setSchemas(blog.schemas || []);
          setSlug(blog.slug || "");
          setFaq(blog.faq || []);
          setShowModal(true);
     };

     // Handle Author Template Autofill
     const applyAuthorTemplate = (templateId) => {
          if (!templateId) return;
          const found = authorTemplates.find(t => t._id === templateId);
          if (found) {
               setAuthor(found.name || "");
               setAuthorDesignation(found.designation || "");
               setAuthorImage(found.image || "");
               setAuthorImageFile(null);
               setAuthorBio(found.bio || "");
               setAuthorTwitter(found.twitter || "");
               displayToast(`Applied template: ${found.name}`);
          }
     };

     // Save Blog
     const saveBlog = async () => {
          setUploading(true);
          try {
               const formData = new FormData();

               formData.append("title", title);
               formData.append("alt", alt);
               formData.append("category", category);
               formData.append("date", date);
               formData.append("author", author);
               formData.append("authorDesignation", authorDesignation);
               formData.append("authorImage", authorImage);
               if (authorImageFile) formData.append("authorImageFile", authorImageFile);
               formData.append("authorBio", authorBio);
               formData.append("authorTwitter", authorTwitter);
               formData.append("authorSocial", JSON.stringify({ twitter: authorTwitter }));
               formData.append("content", content);
               formData.append("seoTitle", seoTitle);
               formData.append("schemas", JSON.stringify(schemas));
               formData.append("slug", slug);
               formData.append("description", description);
               formData.append("seoDescription", seoDescription);
               formData.append("faq", JSON.stringify(faq));
               if (image) formData.append("image", image);

               if (editItem) {
                    const res = await fetch(`${API_URL}/blogs/${editItem._id}`, {
                         method: "PUT",
                         body: formData
                    });
                    if (res.ok) {
                         displayToast("Blog post updated successfully!");
                    } else {
                         displayToast("Failed to update blog post.");
                    }
               } else {
                    const res = await fetch(`${API_URL}/blogs`, {
                         method: "POST",
                         body: formData
                    });
                    if (res.ok) {
                         displayToast("Blog post created successfully!");
                    } else {
                         displayToast("Failed to create blog post.");
                    }
               }
               setShowModal(false);
               fetchBlogs();
          } catch (err) {
               console.error("Save Blog Error:", err);
               displayToast("Error saving blog post.");
          } finally {
               setUploading(false);
          }
     };

     const deleteBlog = async (id) => {
          if (!window.confirm("Are you sure you want to delete this blog?")) return;
          const res = await fetch(`${API_URL}/blogs/${id}`, {
               method: "DELETE"
          });
          if (res.ok) {
               displayToast("Blog post deleted successfully!");
          } else {
               displayToast("Failed to delete blog post.");
          }
          fetchBlogs();
     };

     // Author Template CRUD Actions
     const openCreateTemplateModal = () => {
          setEditTemplateItem(null);
          setTplName("");
          setTplDesignation("");
          setTplImage("");
          setTplImageFile(null);
          setTplBio("");
          setTplTwitter("");
          setShowTemplateModal(true);
     };

     const openEditTemplateModal = (tpl) => {
          setEditTemplateItem(tpl);
          setTplName(tpl.name || "");
          setTplDesignation(tpl.designation || "");
          setTplImage(tpl.image || "");
          setTplImageFile(null);
          setTplBio(tpl.bio || "");
          setTplTwitter(tpl.twitter || "");
          setShowTemplateModal(true);
     };

     const saveAuthorTemplate = async () => {
          if (!tplName) {
               alert("Author Name is required!");
               return;
          }
          setTplSaving(true);
          try {
               const formData = new FormData();
               formData.append("name", tplName);
               formData.append("designation", tplDesignation);
               formData.append("bio", tplBio);
               formData.append("twitter", tplTwitter);
               formData.append("image", tplImage);
               if (tplImageFile) formData.append("image", tplImageFile);

               if (editTemplateItem) {
                    const res = await fetch(`${API_URL}/author-templates/${editTemplateItem._id}`, {
                         method: "PUT",
                         body: formData
                    });
                    if (res.ok) {
                         displayToast("Author template updated successfully!");
                    } else {
                         displayToast("Failed to update author template.");
                    }
               } else {
                    const res = await fetch(`${API_URL}/author-templates`, {
                         method: "POST",
                         body: formData
                    });
                    if (res.ok) {
                         displayToast("Author template created successfully!");
                    } else {
                         displayToast("Failed to create author template.");
                    }
               }
               setShowTemplateModal(false);
               fetchAuthorTemplates();
          } catch (err) {
               console.error("Save Template Error:", err);
               displayToast("Error saving author template.");
          } finally {
               setTplSaving(false);
          }
     };

     const deleteAuthorTemplate = async (id) => {
          if (!window.confirm("Are you sure you want to delete this author template?")) return;
          try {
               const res = await fetch(`${API_URL}/author-templates/${id}`, {
                    method: "DELETE"
               });
               if (res.ok) {
                    displayToast("Author template deleted!");
                    fetchAuthorTemplates();
               } else {
                    displayToast("Failed to delete template.");
               }
          } catch (err) {
               console.error("Delete Template Error:", err);
          }
     };

     const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200";
     const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
               <Breadcrumb />

               <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {/* Toast Notification */}
                    {toast.show && (
                         <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg z-50 animate-bounce">
                              {toast.message}
                         </div>
                    )}

                    {/* Header & Tabs */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                         <div>
                              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                   Blog & Author Manager
                              </h1>
                              <p className="text-gray-500 text-sm mt-1">
                                   Manage blog articles and global reusable Author Templates.
                              </p>
                         </div>

                         <div className="flex items-center gap-3">
                              {activeTab === "blogs" ? (
                                   <button
                                        onClick={openUpload}
                                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0"
                                   >
                                        <HiOutlinePlus className="w-4 h-4 text-white" />
                                        <span>Upload Blog</span>
                                   </button>
                              ) : (
                                   <button
                                        onClick={openCreateTemplateModal}
                                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0"
                                   >
                                        <HiOutlinePlus className="w-4 h-4 text-white" />
                                        <span>+ New Author Template</span>
                                   </button>
                              )}
                         </div>
                    </div>

                    {/* View Switcher Toggle Bar */}
                    <div className="flex items-center gap-2 p-1.5 bg-gray-200/60 rounded-2xl max-w-md mb-8">
                         <button
                              onClick={() => setActiveTab("blogs")}
                              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                   activeTab === "blogs"
                                        ? "bg-white text-primary shadow-xs"
                                        : "text-gray-500 hover:text-gray-900"
                              }`}
                         >
                              <HiOutlineBookOpen className="w-4 h-4" />
                              <span>Blogs Articles ({blogs.length})</span>
                         </button>
                         <button
                              onClick={() => setActiveTab("templates")}
                              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                                   activeTab === "templates"
                                        ? "bg-white text-primary shadow-xs"
                                        : "text-gray-500 hover:text-gray-900"
                              }`}
                         >
                              <HiOutlineUser className="w-4 h-4" />
                              <span>Author Templates ({authorTemplates.length})</span>
                         </button>
                    </div>

                    {/* TAB 1: BLOGS MANAGER VIEW */}
                    {activeTab === "blogs" && (
                         <>
                              {/* Blog Page Titles Settings Card */}
                              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm mb-8">
                                   <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Blog Page Configuration</h2>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Blogs Main Title</label>
                                             <input
                                                  value={blogstitle}
                                                  onChange={(e) => setBlogstitle(e.target.value)}
                                                  placeholder="e.g. Our Blogs"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Featured Blogs Title</label>
                                             <input
                                                  value={featuredblogstitle}
                                                  onChange={(e) => setFeaturedblogstitle(e.target.value)}
                                                  placeholder="e.g. Featured Blogs"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>
                                   <div className="mt-4 flex justify-end">
                                        <button
                                             onClick={saveBlogPageTitles}
                                             disabled={savingTitles}
                                             className="bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                                        >
                                             {savingTitles ? "Saving..." : "Save Titles"}
                                        </button>
                                   </div>
                              </div>

                              {/* Blog Card Grid */}
                              {blogs.length === 0 ? (
                                   <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200/80 rounded-2xl p-6 text-center">
                                        <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                                             <HiOutlineBookOpen className="w-6 h-6" />
                                        </div>
                                        <p className="text-gray-900 text-base font-semibold">No blogs found</p>
                                        <p className="text-gray-400 text-xs mt-1">Click "Upload Blog" to add your first article</p>
                                   </div>
                              ) : (
                                   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {blogs.map(blog => (
                                             <div
                                                  key={blog._id}
                                                  className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                                             >
                                                  <div className="relative overflow-hidden aspect-[16/10]">
                                                       <img
                                                            src={blog.image}
                                                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                                                            alt={blog.title}
                                                       />
                                                       <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary/20 uppercase tracking-wider shadow-sm">
                                                            {blog.category}
                                                       </span>
                                                  </div>

                                                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                                       <div className="space-y-2">
                                                            <h2 className="font-bold text-gray-900 text-base leading-snug line-clamp-2" title={blog.title}>
                                                                 {blog.title}
                                                            </h2>
                                                            <p className="text-xs text-gray-400 line-clamp-3 leading-normal">
                                                                 {blog.description}
                                                            </p>
                                                       </div>

                                                       <div className="flex items-center justify-between text-[11px] text-gray-400 border-y border-gray-100 py-3 mt-auto">
                                                            <span className="flex items-center gap-1">
                                                                 <HiOutlineUser className="w-3.5 h-3.5 text-gray-300" />
                                                                 <span className="font-semibold text-gray-500">{blog.author}</span>
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                 <HiOutlineCalendar className="w-3.5 h-3.5 text-gray-300" />
                                                                 <span>{blog.date}</span>
                                                            </span>
                                                       </div>

                                                       <div className="flex gap-2.5 pt-2">
                                                            <button
                                                                 onClick={() => openEdit(blog)}
                                                                 className="flex-1 flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                                            >
                                                                 Edit
                                                            </button>
                                                            <button
                                                                 onClick={() => deleteBlog(blog._id)}
                                                                 className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                                                            >
                                                                 Delete
                                                            </button>
                                                       </div>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              )}
                         </>
                    )}

                    {/* TAB 2: AUTHOR TEMPLATES MANAGER VIEW */}
                    {activeTab === "templates" && (
                         <div>
                              <div className="flex items-center justify-between mb-6 border-b border-gray-200/80 pb-4">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">Reusable Author Templates</h2>
                                        <p className="text-xs text-gray-400 mt-0.5">Create templates once and select them anytime while posting blogs.</p>
                                   </div>
                                   <button
                                        onClick={openCreateTemplateModal}
                                        className="bg-primary hover:bg-primary/90 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                                   >
                                        + Add Author Template
                                   </button>
                              </div>

                              {authorTemplates.length === 0 ? (
                                   <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200/80 rounded-2xl p-6 text-center">
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-3">
                                             <HiOutlineUser className="w-6 h-6" />
                                        </div>
                                        <p className="text-gray-900 font-bold text-base">No Author Templates Created</p>
                                        <p className="text-gray-400 text-xs mt-1">Create your first template to easily autofill author data in blog posts.</p>
                                   </div>
                              ) : (
                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {authorTemplates.map((tpl) => (
                                             <div key={tpl._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
                                                  <div className="space-y-4">
                                                       <div className="flex items-center gap-4">
                                                            <img
                                                                 src={tpl.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"}
                                                                 alt={tpl.name}
                                                                 className="w-14 h-14 rounded-full object-cover border border-slate-200 shrink-0"
                                                            />
                                                            <div className="min-w-0">
                                                                 <h3 className="font-bold text-slate-900 text-base truncate">{tpl.name}</h3>
                                                                 <p className="text-xs text-primary font-medium truncate">{tpl.designation || "Content Author"}</p>
                                                            </div>
                                                       </div>
                                                       {tpl.bio && (
                                                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                                                                 {tpl.bio}
                                                            </p>
                                                       )}
                                                       {tpl.twitter && (
                                                            <div className="text-[11px] text-slate-400 font-medium truncate">
                                                                 Twitter: <span className="text-slate-700">{tpl.twitter}</span>
                                                            </div>
                                                       )}
                                                  </div>
                                                  <div className="flex gap-2 pt-4 mt-4 border-t border-slate-100">
                                                       <button
                                                            onClick={() => openEditTemplateModal(tpl)}
                                                            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                                                       >
                                                            Edit
                                                       </button>
                                                       <button
                                                            onClick={() => deleteAuthorTemplate(tpl._id)}
                                                            className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                                                       >
                                                            Delete
                                                       </button>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              )}
                         </div>
                    )}
               </div>

               {/* ================= MODAL 1: BLOG POST UPLOAD/EDIT MODAL ================= */}
               {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
                         <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-100">
                              {/* Modal Header */}
                              <div className="flex items-center justify-between px-7 py-4.5 border-b border-gray-100 bg-white shrink-0">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                                             {editItem ? "Edit Blog Post" : "Upload Blog Post"}
                                        </h2>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                             Fill in post details, author metadata, cover image, and article content.
                                        </p>
                                   </div>
                                   <button
                                        onClick={() => setShowModal(false)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                                   >
                                        ✕
                                   </button>
                              </div>

                              {/* Modal Content Scrollable Area */}
                              <div className="px-7 py-6 space-y-6 overflow-y-auto flex-1 text-slate-700">
                                   
                                   {/* ================= 1. BASIC INFO ================= */}
                                   <div className="space-y-4">
                                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                             <span className="w-2 h-2 rounded-full bg-primary"></span>
                                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                  1. Basic Information
                                             </h3>
                                        </div>

                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Blog Title *</label>
                                             <input
                                                  value={title}
                                                  onChange={(e) => setTitle(e.target.value)}
                                                  placeholder="e.g. Master UX Design in 30 Days"
                                                  className={inputClass}
                                                  required
                                             />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Category *</label>
                                                  <input
                                                       value={category}
                                                       onChange={(e) => setCategory(e.target.value)}
                                                       placeholder="e.g. UI/UX Design"
                                                       className={inputClass}
                                                       required
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Publish Date *</label>
                                                  <input
                                                       type="date"
                                                       value={date}
                                                       onChange={(e) => setDate(e.target.value)}
                                                       className={inputClass}
                                                       required
                                                  />
                                             </div>
                                        </div>

                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Short Summary / Description *</label>
                                             <textarea
                                                  value={description}
                                                  onChange={(e) => setDescription(e.target.value)}
                                                  placeholder="Brief summary of the article (displayed on blog cards)..."
                                                  rows={2}
                                                  className={inputClass}
                                                  required
                                             />
                                        </div>
                                   </div>

                                   {/* ================= 2. AUTHOR INFORMATION ================= */}
                                   <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                                             <div className="flex items-center gap-2">
                                                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                                                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                                       2. Author Information
                                                  </h3>
                                             </div>
                                             <span className="text-[11px] font-medium text-slate-400">Appears on Blog Details</span>
                                        </div>

                                        {/* ⭐ DROPDOWN: SELECT SAVED AUTHOR TEMPLATE */}
                                        {authorTemplates.length > 0 && (
                                             <div className="bg-primary/5 border border-primary/20 rounded-xl p-3.5 space-y-1.5">
                                                  <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                                                       ⚡ Select Saved Author Template (Autofill Data)
                                                  </label>
                                                  <select
                                                       onChange={(e) => applyAuthorTemplate(e.target.value)}
                                                       className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-primary/30 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                                  >
                                                       <option value="">-- Choose Template to Autofill Author Details --</option>
                                                       {authorTemplates.map((tpl) => (
                                                            <option key={tpl._id} value={tpl._id}>
                                                                 {tpl.name} {tpl.designation ? `(${tpl.designation})` : ""}
                                                            </option>
                                                       ))}
                                                  </select>
                                             </div>
                                        )}

                                        {/* Field 1 & Field 2 */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>1. Author Name *</label>
                                                  <input
                                                       type="text"
                                                       value={author}
                                                       placeholder="e.g. John Doe"
                                                       onChange={(e) => setAuthor(e.target.value)}
                                                       className={inputClass}
                                                       required
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>2. Author Designation</label>
                                                  <input
                                                       type="text"
                                                       value={authorDesignation}
                                                       placeholder="e.g. Senior Content Strategist"
                                                       onChange={(e) => setAuthorDesignation(e.target.value)}
                                                       className={inputClass}
                                                  />
                                             </div>
                                        </div>

                                        {/* Field 3: Author Image Upload */}
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>3. Author Profile Image (Upload File)</label>
                                             <ImageUploader setImage={setAuthorImageFile} initialImage={authorImage || editItem?.authorImage} />
                                        </div>

                                        {/* Field 4: Bio */}
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>4. Author Bio / Description</label>
                                             <textarea
                                                  value={authorBio}
                                                  onChange={(e) => setAuthorBio(e.target.value)}
                                                  placeholder="Write a brief author bio to display on blog details page..."
                                                  rows={2}
                                                  className={inputClass}
                                             />
                                        </div>

                                        {/* Field 5: Social Link (Twitter) */}
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>5. Author Social Link (Twitter / X URL)</label>
                                             <input
                                                  type="url"
                                                  placeholder="https://twitter.com/username"
                                                  value={authorTwitter}
                                                  onChange={(e) => setAuthorTwitter(e.target.value)}
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   {/* ================= 3. COVER IMAGE ================= */}
                                   <div className="space-y-4">
                                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                             <span className="w-2 h-2 rounded-full bg-primary"></span>
                                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                  3. Cover Image & Media
                                             </h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Upload Main Cover Image</label>
                                                  <ImageUploader setImage={setImage} initialImage={editItem?.image} />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>Image Alt Text</label>
                                                  <input
                                                       value={alt}
                                                       onChange={(e) => setAlt(e.target.value)}
                                                       placeholder="e.g. Person studying interface design mockup"
                                                       className={inputClass}
                                                  />
                                             </div>
                                        </div>
                                   </div>

                                   {/* ================= 4. ARTICLE CONTENT ================= */}
                                   <div className="space-y-3 pt-2">
                                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                             <span className="w-2 h-2 rounded-full bg-primary"></span>
                                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                  4. Article Content
                                             </h3>
                                        </div>
                                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                                             <Editor value={content} onChange={setContent} />
                                        </div>
                                   </div>

                                   {/* ================= 5. SEO CONFIGURATIONS ================= */}
                                   <div className="space-y-4 pt-2">
                                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                             <span className="w-2 h-2 rounded-full bg-primary"></span>
                                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                  5. SEO Configurations
                                             </h3>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>SEO Page Title</label>
                                                  <input
                                                       value={seoTitle}
                                                       onChange={(e) => setSeoTitle(e.target.value)}
                                                       placeholder="SEO Optimized Page Title"
                                                       className={inputClass}
                                                  />
                                             </div>
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>URL Slug / Path</label>
                                                  <input
                                                       value={slug}
                                                       onChange={(e) => setSlug(e.target.value)}
                                                       placeholder="e.g. master-ux-design"
                                                       className={inputClass}
                                                  />
                                             </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                             <div className="space-y-1.5">
                                                  <label className={labelClass}>SEO Meta Description</label>
                                                  <textarea
                                                       value={seoDescription}
                                                       onChange={(e) => setSeoDescription(e.target.value)}
                                                       placeholder="Optimize SEO description snippet for search engine results..."
                                                       rows={2}
                                                       className={inputClass}
                                                  />
                                             </div>
                                        </div>

                                        {/* JSON-LD Schema Scripts Section */}
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
                                                                 placeholder='e.g. {"@context": "https://schema.org", "@type": "BlogPosting", ...}'
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
                                   </div>

                                   {/* ================= 6. BLOG FAQS ================= */}
                                   <div className="space-y-3 pt-2">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                             <div className="flex items-center gap-2">
                                                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                                                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                       6. Blog-Specific FAQs
                                                  </h3>
                                             </div>
                                             <button
                                                  onClick={() => setFaq([...faq, { ques: "", ans: "" }])}
                                                  className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                             >
                                                  + Add FAQ
                                             </button>
                                        </div>

                                        <div className="space-y-3">
                                             {faq.map((item, index) => (
                                                  <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50/70 space-y-2 relative">
                                                       <button
                                                            onClick={() => setFaq(faq.filter((_, i) => i !== index))}
                                                            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-md bg-red-50 hover:bg-red-100 text-red-500 transition-colors cursor-pointer"
                                                       >
                                                            ✕
                                                       </button>
                                                       <input
                                                            placeholder="Question"
                                                            value={item.ques}
                                                            onChange={(e) => {
                                                                 const updated = [...faq];
                                                                 updated[index].ques = e.target.value;
                                                                 setFaq(updated);
                                                            }}
                                                            className="w-[90%] text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-700 bg-white focus:outline-none focus:border-primary"
                                                       />
                                                       <textarea
                                                            placeholder="Answer"
                                                            value={item.ans}
                                                            onChange={(e) => {
                                                                 const updated = [...faq];
                                                                 updated[index].ans = e.target.value;
                                                                 setFaq(updated);
                                                            }}
                                                            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-700 bg-white focus:outline-none focus:border-primary min-h-16 resize-none"
                                                       />
                                                  </div>
                                             ))}

                                             {faq.length === 0 && (
                                                  <div className="text-center py-4 text-gray-400">
                                                       <p className="text-xs">No blog-specific FAQs added yet.</p>
                                                  </div>
                                             )}
                                        </div>
                                   </div>

                              </div>

                              {/* Modal Footer */}
                              <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-gray-100 bg-white shrink-0">
                                   <button
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        onClick={saveBlog}
                                        disabled={uploading || !title || !category}
                                        className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 ${
                                             uploading || !title || !category
                                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                                  : "bg-primary hover:bg-primary/90 shadow-primary/20"
                                        }`}
                                   >
                                        {uploading ? (
                                             <>
                                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                  <span>Saving...</span>
                                             </>
                                        ) : (
                                             <span>{editItem ? "Save Changes" : "Publish Blog"}</span>
                                        )}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

               {/* ================= MODAL 2: AUTHOR TEMPLATE CREATE/EDIT MODAL ================= */}
               {showTemplateModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
                         <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
                              {/* Header */}
                              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                                   <div>
                                        <h3 className="text-base font-bold text-gray-900">
                                             {editTemplateItem ? "Edit Author Template" : "Create Author Template"}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">Save reusable author information for blog posts.</p>
                                   </div>
                                   <button
                                        onClick={() => setShowTemplateModal(false)}
                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
                                   >
                                        ✕
                                   </button>
                              </div>

                              {/* Form Body */}
                              <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Author Name *</label>
                                        <input
                                             type="text"
                                             value={tplName}
                                             onChange={(e) => setTplName(e.target.value)}
                                             placeholder="e.g. John Doe"
                                             className={inputClass}
                                             required
                                        />
                                   </div>

                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Author Designation</label>
                                        <input
                                             type="text"
                                             value={tplDesignation}
                                             onChange={(e) => setTplDesignation(e.target.value)}
                                             placeholder="e.g. Senior Educator & Content Writer"
                                             className={inputClass}
                                        />
                                   </div>

                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Author Profile Image (Upload File)</label>
                                        <ImageUploader setImage={setTplImageFile} initialImage={editTemplateItem?.image} />
                                   </div>

                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Author Bio / Description</label>
                                        <textarea
                                             value={tplBio}
                                             onChange={(e) => setTplBio(e.target.value)}
                                             placeholder="Brief biography of the author..."
                                             rows={3}
                                             className={inputClass}
                                        />
                                   </div>

                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Twitter (X) Profile Link</label>
                                        <input
                                             type="url"
                                             value={tplTwitter}
                                             onChange={(e) => setTplTwitter(e.target.value)}
                                             placeholder="https://twitter.com/username"
                                             className={inputClass}
                                        />
                                   </div>
                              </div>

                              {/* Footer */}
                              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
                                   <button
                                        onClick={() => setShowTemplateModal(false)}
                                        className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        onClick={saveAuthorTemplate}
                                        disabled={tplSaving || !tplName}
                                        className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 disabled:bg-gray-300 rounded-xl transition-all cursor-pointer shadow-xs"
                                   >
                                        {tplSaving ? "Saving..." : editTemplateItem ? "Update Template" : "Save Template"}
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}