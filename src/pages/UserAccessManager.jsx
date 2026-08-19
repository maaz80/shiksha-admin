import { useState, useEffect, useMemo } from "react";
import { getAdminHeader } from "../utils/auth";
import BreadCrumb from "../components/BreadCrumb";
import {
     HiOutlineLockClosed,
     HiOutlineLockOpen,
     HiOutlineSearch,
     HiOutlineUser,
     HiOutlineAcademicCap,
     HiOutlineCheckCircle,
     HiOutlineExclamation,
     HiOutlineRefresh,
     HiOutlineFilter,
     HiOutlineMail,
     HiOutlinePhone,
     HiOutlineCalendar,
     HiOutlineX,
     HiOutlineSparkles,
     HiOutlineTrash,
     HiOutlineShieldCheck
} from "react-icons/hi";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export default function UserAccessManager() {
     const [users, setUsers] = useState([]);
     const [courses, setCourses] = useState([]);
     const [loading, setLoading] = useState(true);
     const [refreshing, setRefreshing] = useState(false);
     const [searchTerm, setSearchTerm] = useState("");
     const [filterTab, setFilterTab] = useState("all"); // "all" | "unlocked" | "locked"
     const [selectedCourseForUser, setSelectedCourseForUser] = useState({});
     const [actionLoading, setActionLoading] = useState({});
     const [message, setMessage] = useState({ text: "", type: "" });
     const [confirmModal, setConfirmModal] = useState(null); // { userId, courseId, courseSlug, courseTitle, userName }

     const showToast = (text, type = "success") => {
          setMessage({ text, type });
          setTimeout(() => setMessage({ text: "", type: "" }), 4500);
     };

     const fetchData = async (isManualRefresh = false) => {
          if (isManualRefresh) setRefreshing(true);
          else setLoading(true);

          try {
               const [usersRes, coursesRes] = await Promise.all([
                    fetch(`${API_BASE}/admin/users`, { headers: getAdminHeader() }),
                    fetch(`${API_BASE}/courses`)
               ]);

               if (usersRes.ok) {
                    const uData = await usersRes.json();
                    setUsers(Array.isArray(uData.users) ? uData.users : []);
               }

               if (coursesRes.ok) {
                    const cData = await coursesRes.json();
                    setCourses(Array.isArray(cData) ? cData : []);
               }

               if (isManualRefresh) showToast("Student data refreshed successfully", "success");
          } catch (err) {
               console.error("Error fetching admin user access data:", err);
               showToast("Failed to load student access records", "error");
          } finally {
               setLoading(false);
               setRefreshing(false);
          }
     };

     useEffect(() => {
          fetchData();
     }, []);

     const handleUnlockCourse = async (userId) => {
          const courseId = selectedCourseForUser[userId];
          if (!courseId) {
               showToast("Please select a course to unlock", "error");
               return;
          }

          const targetCourse = courses.find(c => c._id === courseId || c.slug === courseId);
          const userObj = users.find(u => u._id === userId);

          setActionLoading(prev => ({ ...prev, [userId]: true }));
          try {
               const res = await fetch(`${API_BASE}/assign-course`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         ...getAdminHeader()
                    },
                    body: JSON.stringify({
                         userId,
                         courseId: targetCourse?._id || courseId,
                         courseSlug: targetCourse?.slug || courseId
                    })
               });

               const data = await res.json();
               if (res.ok) {
                    showToast(`Unlocked "${targetCourse?.title || 'Course'}" for ${userObj?.name || 'Student'}!`, "success");
                    setSelectedCourseForUser(prev => ({ ...prev, [userId]: "" }));
                    await fetchData();
               } else {
                    showToast(data.error || "Failed to unlock course", "error");
               }
          } catch (err) {
               console.error("Unlock error:", err);
               showToast("Server error while unlocking course", "error");
          } finally {
               setActionLoading(prev => ({ ...prev, [userId]: false }));
          }
     };

     const executeLockCourse = async () => {
          if (!confirmModal) return;
          const { userId, courseId, courseSlug, courseTitle, userName } = confirmModal;
          setConfirmModal(null);

          setActionLoading(prev => ({ ...prev, [userId]: true }));
          try {
               const res = await fetch(`${API_BASE}/revoke-course`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         ...getAdminHeader()
                    },
                    body: JSON.stringify({
                         userId,
                         courseId,
                         courseSlug
                    })
               });

               const data = await res.json();
               if (res.ok) {
                    showToast(`Revoked access for "${courseTitle}" from ${userName}`, "info");
                    await fetchData();
               } else {
                    showToast(data.error || "Failed to lock course", "error");
               }
          } catch (err) {
               console.error("Lock error:", err);
               showToast("Server error while locking course", "error");
          } finally {
               setActionLoading(prev => ({ ...prev, [userId]: false }));
          }
     };

     // Stats Summary
     const stats = useMemo(() => {
          const totalStudents = users.length;
          const unlockedStudents = users.filter(u => Array.isArray(u.enrolledCourses) && u.enrolledCourses.length > 0).length;
          const lockedStudents = totalStudents - unlockedStudents;
          const totalAccessGrants = users.reduce((sum, u) => sum + (Array.isArray(u.enrolledCourses) ? u.enrolledCourses.length : 0), 0);

          return { totalStudents, unlockedStudents, lockedStudents, totalAccessGrants };
     }, [users]);

     // Filtering Users
     const filteredUsers = useMemo(() => {
          return users.filter(u => {
               const q = searchTerm.toLowerCase().trim();
               const enrolledCount = Array.isArray(u.enrolledCourses) ? u.enrolledCourses.length : 0;

               // Tab filter
               if (filterTab === "unlocked" && enrolledCount === 0) return false;
               if (filterTab === "locked" && enrolledCount > 0) return false;

               // Search filter
               if (!q) return true;
               const matchName = (u.name || "").toLowerCase().includes(q);
               const matchEmail = (u.email || "").toLowerCase().includes(q);
               const matchPhone = (u.phone || "").toLowerCase().includes(q);
               const matchCourse = Array.isArray(u.enrolledCourses) && u.enrolledCourses.some(item => {
                    const cObj = typeof item.courseId === "object" ? item.courseId : null;
                    return (cObj?.title || item.courseSlug || "").toLowerCase().includes(q);
               });

               return matchName || matchEmail || matchPhone || matchCourse;
          });
     }, [users, searchTerm, filterTab]);

     return (
          <div className="p-6 md:p-8 space-y-8 max-w-[1500px] mx-auto poppins-regular text-gray-800">
               {/* BreadCrumb & Page Header */}
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
                    <div>
                         <BreadCrumb pageTitle="Student Access & Locking Portal" />
                         <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1 flex items-center gap-2.5">
                              <span>Student Course Access Manager</span>
                              <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20 inline-flex items-center gap-1">
                                   <HiOutlineShieldCheck className="w-4 h-4 text-primary" /> Live Control
                              </span>
                         </h1>
                    </div>

                    <button
                         onClick={() => fetchData(true)}
                         disabled={refreshing}
                         className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                         <HiOutlineRefresh className={`w-4 h-4 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
                         <span>{refreshing ? "Refreshing..." : "Refresh Records"}</span>
                    </button>
               </div>

               {/* Toast Notification Alert */}
               {message.text && (
                    <div className={`p-4 rounded-2xl text-sm font-semibold flex items-center justify-between gap-3 border shadow-md animate-in fade-in slide-in-from-top-2 duration-200 ${message.type === "error"
                              ? "bg-red-50 text-red-800 border-red-200"
                              : message.type === "info"
                                   ? "bg-blue-50 text-blue-800 border-blue-200"
                                   : "bg-emerald-50 text-emerald-800 border-emerald-200"
                         }`}>
                         <div className="flex items-center gap-3">
                              {message.type === "error" ? (
                                   <HiOutlineExclamation className="w-5 h-5 text-red-600 shrink-0" />
                              ) : (
                                   <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                              )}
                              <span>{message.text}</span>
                         </div>
                         <button onClick={() => setMessage({ text: "", type: "" })} className="text-gray-400 hover:text-gray-700 p-1">
                              <HiOutlineX className="w-4 h-4" />
                         </button>
                    </div>
               )}

               {/* KPI STAT CARDS (4 CARDS GRID) */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Stat Card 1: Total Students */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition flex items-center justify-between">
                         <div className="space-y-1">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered Students</p>
                              <p className="text-3xl font-extrabold text-gray-900">{stats.totalStudents}</p>
                              <p className="text-[11px] text-gray-400 font-medium">Verified user accounts</p>
                         </div>
                         <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                              <HiOutlineAcademicCap className="w-6 h-6" />
                         </div>
                    </div>

                    {/* Stat Card 2: Unlocked Access */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition flex items-center justify-between">
                         <div className="space-y-1">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Students Unlocked</p>
                              <p className="text-3xl font-extrabold text-emerald-600">{stats.unlockedStudents}</p>
                              <p className="text-[11px] text-emerald-600 font-medium font-semibold">Active access grants</p>
                         </div>
                         <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                              <HiOutlineLockOpen className="w-6 h-6" />
                         </div>
                    </div>

                    {/* Stat Card 3: Fully Locked */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition flex items-center justify-between">
                         <div className="space-y-1">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Locked Students</p>
                              <p className="text-3xl font-extrabold text-amber-600">{stats.lockedStudents}</p>
                              <p className="text-[11px] text-amber-600 font-medium">Pending enrollment</p>
                         </div>
                         <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
                              <HiOutlineLockClosed className="w-6 h-6" />
                         </div>
                    </div>

                    {/* Stat Card 4: Total Grants */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition flex items-center justify-between">
                         <div className="space-y-1">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Access Grants</p>
                              <p className="text-3xl font-extrabold text-indigo-600">{stats.totalAccessGrants}</p>
                              <p className="text-[11px] text-gray-400 font-medium">Courses assigned across users</p>
                         </div>
                         <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                              <HiOutlineSparkles className="w-6 h-6" />
                         </div>
                    </div>
               </div>

               {/* SEARCH & FILTER CONTROLS BAR */}
               <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                    {/* Left: Filter Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                         <button
                              onClick={() => setFilterTab("all")}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${filterTab === "all"
                                        ? "bg-gray-900 text-white shadow-xs"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                   }`}
                         >
                              All Students ({users.length})
                         </button>

                         <button
                              onClick={() => setFilterTab("unlocked")}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${filterTab === "unlocked"
                                        ? "bg-emerald-600 text-white shadow-xs"
                                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                   }`}
                         >
                              <HiOutlineLockOpen className="w-3.5 h-3.5" />
                              <span>Unlocked Access ({stats.unlockedStudents})</span>
                         </button>

                         <button
                              onClick={() => setFilterTab("locked")}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${filterTab === "locked"
                                        ? "bg-amber-600 text-white shadow-xs"
                                        : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                                   }`}
                         >
                              <HiOutlineLockClosed className="w-3.5 h-3.5" />
                              <span>Fully Locked ({stats.lockedStudents})</span>
                         </button>
                    </div>

                    {/* Right: Search Input */}
                    <div className="relative w-full lg:w-96">
                         <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                         <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search student name, email, phone or course..."
                              className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                         />
                         {searchTerm && (
                              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                   <HiOutlineX className="w-4 h-4" />
                              </button>
                         )}
                    </div>
               </div>

               {/* MAIN STUDENT TABLE */}
               {loading ? (
                    <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-xs">
                         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                         <p className="text-sm font-semibold text-gray-600 mt-4">Loading student records...</p>
                    </div>
               ) : filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 space-y-3 shadow-xs">
                         <HiOutlineUser className="w-14 h-14 text-gray-300 mx-auto" />
                         <h3 className="text-lg font-bold text-gray-800">No Student Records Found</h3>
                         <p className="text-xs text-gray-500 max-w-sm mx-auto">
                              No students match your selected filter or search query. Try clearing the search or switching filters.
                         </p>
                         {searchTerm && (
                              <button
                                   onClick={() => setSearchTerm("")}
                                   className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition"
                              >
                                   Clear Search
                              </button>
                         )}
                    </div>
               ) : (
                    <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-sm">
                         <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                   <thead>
                                        <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                             <th className="py-4 px-6">Student Information</th>
                                             <th className="py-4 px-6">Active Unlocked Courses</th>
                                             <th className="py-4 px-6">Assign & Unlock New Course</th>
                                        </tr>
                                   </thead>
                                   <tbody className="divide-y divide-gray-100 text-xs">
                                        {filteredUsers.map((user) => {
                                             const isBusy = actionLoading[user._id];
                                             const enrolled = Array.isArray(user.enrolledCourses) ? user.enrolledCourses : [];

                                             return (
                                                  <tr key={user._id} className="hover:bg-gray-50/70 transition-colors">
                                                       {/* Student Info */}
                                                       <td className="py-5 px-6 align-top">
                                                            <div className="flex items-start gap-3.5">
                                                                 <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm shrink-0 mt-0.5">
                                                                      {(user.name || "U")[0].toUpperCase()}
                                                                 </div>
                                                                 <div className="space-y-1">
                                                                      <p className="font-bold text-gray-900 text-sm">{user.name || "Unnamed Student"}</p>
                                                                      <div className="flex items-center gap-1.5 text-gray-600">
                                                                           <HiOutlineMail className="w-3.5 h-3.5 text-gray-400" />
                                                                           <span>{user.email}</span>
                                                                      </div>
                                                                      <div className="flex items-center gap-1.5 text-gray-500">
                                                                           <HiOutlinePhone className="w-3.5 h-3.5 text-gray-400" />
                                                                           <span>{user.phone || "No phone registered"}</span>
                                                                      </div>
                                                                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400 pt-0.5">
                                                                           <HiOutlineCalendar className="w-3 h-3 text-gray-300" />
                                                                           <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "--"}</span>
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                       </td>

                                                       {/* Currently Unlocked Courses Tags */}
                                                       <td className="py-5 px-6 align-top">
                                                            {enrolled.length === 0 ? (
                                                                 <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl text-xs font-semibold border border-amber-200/80">
                                                                      <HiOutlineLockClosed className="w-3.5 h-3.5 text-amber-600" />
                                                                      <span>All Courses Locked</span>
                                                                 </span>
                                                            ) : (
                                                                 <div className="flex flex-wrap gap-2.5">
                                                                      {enrolled.map((item, idx) => {
                                                                           const courseObj = typeof item.courseId === "object" ? item.courseId : null;
                                                                           const cId = courseObj?._id || item.courseId || item._id;
                                                                           const cSlug = item.courseSlug || courseObj?.slug;
                                                                           const title = courseObj?.title || item.courseSlug || "Course Access";

                                                                           return (
                                                                                <div
                                                                                     key={idx}
                                                                                     className="inline-flex items-center justify-between gap-2.5 bg-emerald-50 text-emerald-900 border border-emerald-200/90 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-2xs group"
                                                                                >
                                                                                     <div className="flex items-center gap-1.5">
                                                                                          <HiOutlineLockOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                                                          <span className="max-w-44 truncate">{title}</span>
                                                                                     </div>
                                                                                     <button
                                                                                          onClick={() => setConfirmModal({
                                                                                               userId: user._id,
                                                                                               courseId: cId,
                                                                                               courseSlug: cSlug,
                                                                                               courseTitle: title,
                                                                                               userName: user.name || user.email
                                                                                          })}
                                                                                          disabled={isBusy}
                                                                                          title="Lock / Revoke Access"
                                                                                          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-md transition cursor-pointer"
                                                                                     >
                                                                                          <HiOutlineTrash className="w-3.5 h-3.5" />
                                                                                     </button>
                                                                                </div>
                                                                           );
                                                                      })}
                                                                 </div>
                                                            )}
                                                       </td>

                                                       {/* Unlock New Course Dropdown */}
                                                       <td className="py-5 px-6 align-top">
                                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                                                                 <select
                                                                      value={selectedCourseForUser[user._id] || ""}
                                                                      onChange={(e) => setSelectedCourseForUser(prev => ({ ...prev, [user._id]: e.target.value }))}
                                                                      className="py-2.5 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 max-w-60 truncate cursor-pointer"
                                                                 >
                                                                      <option value="">Choose course to unlock...</option>
                                                                      {courses.map((c) => (
                                                                           <option key={c._id} value={c._id}>
                                                                                {c.title}
                                                                           </option>
                                                                      ))}
                                                                 </select>

                                                                 <button
                                                                      onClick={() => handleUnlockCourse(user._id)}
                                                                      disabled={isBusy || !selectedCourseForUser[user._id]}
                                                                      className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                                                                 >
                                                                      <HiOutlineLockOpen className="w-4 h-4" />
                                                                      <span>{isBusy ? "Unlocking..." : "Unlock Access 🔓"}</span>
                                                                 </button>
                                                            </div>
                                                       </td>
                                                  </tr>
                                             );
                                        })}
                                   </tbody>
                              </table>
                         </div>
                    </div>
               )}

               {/* CONFIRMATION REVOKE LOCK MODAL */}
               {confirmModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
                         <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-100 shadow-2xl space-y-5 text-center">
                              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-100">
                                   <HiOutlineLockClosed className="w-7 h-7" />
                              </div>

                              <div className="space-y-2">
                                   <h3 className="text-xl font-bold text-gray-900">Revoke Course Access? 🔒</h3>
                                   <p className="text-xs text-gray-600 leading-relaxed">
                                        Are you sure you want to lock and revoke access for <strong className="text-gray-900">"{confirmModal.courseTitle}"</strong> from student <strong className="text-gray-900">{confirmModal.userName}</strong>?
                                   </p>
                              </div>

                              <div className="flex items-center gap-3 pt-2">
                                   <button
                                        onClick={() => setConfirmModal(null)}
                                        className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-50 transition cursor-pointer"
                                   >
                                        Cancel
                                   </button>
                                   <button
                                        onClick={executeLockCourse}
                                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
                                   >
                                        Yes, Revoke Access
                                   </button>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}
