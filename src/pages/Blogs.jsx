import { useEffect, useState } from "react";
import Editor from "../components/Editor";
import ImageUploader from "../components/ImageUploader";
import Breadcrumb from "../components/BreadCrumb";
import { HiOutlinePlus, HiOutlineTrash, HiOutlineBookOpen, HiOutlineCalendar, HiOutlineUser } from "react-icons/hi";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export default function Blogs() {
     const [blogs, setBlogs] = useState([]);
     const [showModal, setShowModal] = useState(false);
     const [editItem, setEditItem] = useState(null);
     const [uploading, setUploading] = useState(false);
     const [title, setTitle] = useState("");
     const [alt, setAlt] = useState("");
     const [category, setCategory] = useState("");
     const [date, setDate] = useState("");
     const [author, setAuthor] = useState("");
     const [content, setContent] = useState("");
     const [image, setImage] = useState(null);
     const [seoTitle, setSeoTitle] = useState("");
     const [seoDescription, setSeoDescription] = useState("");
     const [seoKeywords, setSeoKeywords] = useState("");
     const [slug, setSlug] = useState("");
     const [description, setDescription] = useState("");

     const fetchBlogs = async () => {
          const res = await fetch(`${API_URL}/blogs`);
          const data = await res.json();
          setBlogs(data);
     };

     useEffect(() => {
          fetchBlogs();
     }, []);

     const openUpload = () => {
          setEditItem(null);
          setTitle("");
          setAlt("");
          setCategory("");
          setDate("");
          setAuthor("");
          setContent("");
          setImage(null);
          setSeoTitle("");
          setSeoKeywords("");
          setDescription("");
          setSeoDescription("");
          setSeoKeywords("");
          setSlug("");
          setShowModal(true);
     };

     const openEdit = (blog) => {
          setEditItem(blog);
          setTitle(blog.title);
          setDescription(blog.description);
          setAlt(blog.alt);
          setCategory(blog.category);
          setDate(blog.date);
          setAuthor(blog.author);
          setContent(blog.content);
          setImage(null);
          setSeoTitle(blog.seoTitle || "");
          setSeoDescription(blog.seoDescription || "");
          setSeoKeywords(blog.seoKeywords || "");
          setSlug(blog.slug || "");
          setShowModal(true);
     };

     const saveBlog = async () => {
          setUploading(true);
          const formData = new FormData();

          formData.append("title", title);
          formData.append("alt", alt);
          formData.append("category", category);
          formData.append("date", date);
          formData.append("author", author);
          formData.append("content", content);
          formData.append("seoTitle", seoTitle);
          formData.append("seoKeywords", seoKeywords);
          formData.append("slug", slug);
          formData.append("description", description);
          formData.append("seoDescription", seoDescription);
          if (image) formData.append("image", image);

          if (editItem) {
               await fetch(`${API_URL}/blogs/${editItem._id}`, {
                    method: "PUT",
                    body: formData
               });
          } else {
               await fetch(`${API_URL}/blogs`, {
                    method: "POST",
                    body: formData
               });
          }
          setUploading(false);
          setShowModal(false);
          fetchBlogs();
     };

     const deleteBlog = async (id) => {
          if (!window.confirm("Are you sure you want to delete this blog?")) return;
          await fetch(`${API_URL}/blogs/${id}`, {
               method: "DELETE"
          });
          fetchBlogs();
     };

     const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all duration-200";
     const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5";

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
               <Breadcrumb />

               <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                         <div>
                              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                                   Blog Manager
                              </h1>
                              <p className="text-gray-500 text-sm mt-1">
                                   Publish and edit educational blogs and news items.
                              </p>
                         </div>

                         <button
                              onClick={openUpload}
                              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0"
                         >
                              <HiOutlinePlus className="w-4 h-4 text-white" />
                              <span>Upload Blog</span>
                         </button>
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
                                             <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-orange-100 uppercase tracking-wider shadow-sm">
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
                                                       className="flex-1 flex items-center justify-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-bold py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
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
               </div>

               {/* Add / Edit Modal */}
               {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                         <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col justify-between">
                              {/* Modal Header */}
                              <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                             {editItem ? "Edit Blog Post" : "Upload Blog Post"}
                                        </h2>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                             Fill in metadata, upload a cover photo, and write the article content.
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
                              <div className="px-7 py-6 space-y-5">
                                   {/* Basic Info */}
                                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Basic Info</p>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Blog Title</label>
                                             <input
                                                  value={title}
                                                  onChange={(e) => setTitle(e.target.value)}
                                                  placeholder="e.g. Master UX Design in 30 Days"
                                                  className={inputClass}
                                                  required
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Category</label>
                                             <input
                                                  value={category}
                                                  onChange={(e) => setCategory(e.target.value)}
                                                  placeholder="e.g. UI/UX Design"
                                                  className={inputClass}
                                                  required
                                             />
                                        </div>
                                   </div>

                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Short Description</label>
                                        <textarea
                                             value={description}
                                             onChange={(e) => setDescription(e.target.value)}
                                             placeholder="Brief summary of the article (150-160 characters)..."
                                             rows={2}
                                             className={inputClass}
                                             required
                                        />
                                   </div>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Publish Date</label>
                                             <input
                                                  type="date"
                                                  value={date}
                                                  onChange={(e) => setDate(e.target.value)}
                                                  className={inputClass}
                                                  required
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>Author Name</label>
                                             <input
                                                  type="text"
                                                  value={author}
                                                  placeholder="e.g. John Doe"
                                                  onChange={(e) => setAuthor(e.target.value)}
                                                  className={inputClass}
                                                  required
                                             />
                                        </div>
                                   </div>

                                   {/* Cover Image */}
                                   <div className="space-y-1.5">
                                        <label className={labelClass}>Cover Image</label>
                                        <ImageUploader setImage={setImage} initialImage={editItem?.image} />
                                        <div className="mt-2">
                                             <label className={labelClass}>Image Alt Text</label>
                                             <input
                                                  value={alt}
                                                  onChange={(e) => setAlt(e.target.value)}
                                                  placeholder="e.g. Person studying interface design mockup"
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   {/* SEO Settings */}
                                   <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 pt-2">SEO Configurations</p>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>SEO Title</label>
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
                                             <label className={labelClass}>SEO Keywords</label>
                                             <input
                                                  value={seoKeywords}
                                                  onChange={(e) => setSeoKeywords(e.target.value)}
                                                  placeholder="e.g. ui, ux, design tutorials, learning"
                                                  className={inputClass}
                                             />
                                        </div>
                                        <div className="space-y-1.5">
                                             <label className={labelClass}>SEO Description</label>
                                             <textarea
                                                  value={seoDescription}
                                                  onChange={(e) => setSeoDescription(e.target.value)}
                                                  placeholder="Optimize SEO description for search results snippet..."
                                                  rows={2}
                                                  className={inputClass}
                                             />
                                        </div>
                                   </div>

                                   {/* WYSIWYG Editor */}
                                   <div className="space-y-2 border-t border-gray-100 pt-4">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                                             Article Content
                                        </label>
                                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                             <Editor value={content} onChange={setContent} />
                                        </div>
                                   </div>
                              </div>

                              {/* Modal Footer */}
                              <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-gray-100 bg-white sticky bottom-0 rounded-b-2xl">
                                   <button
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        onClick={saveBlog}
                                        disabled={uploading || !title || !category}
                                        className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 ${
                                             uploading || !title || !category
                                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                                  : "bg-orange-500 hover:bg-orange-600 shadow-orange-200"
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
          </div>
     );
}