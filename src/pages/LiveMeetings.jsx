import { useState, useEffect } from "react";
import { getAdminToken } from "../utils/auth.js";
import Breadcrumb from "../components/BreadCrumb.jsx";
import {
     HiOutlineVideoCamera,
     HiOutlineClock,
     HiOutlineExternalLink,
     HiOutlineTrash,
     HiOutlineRefresh,
     HiOutlinePlus,
     HiOutlineClipboardCopy,
     HiOutlineShieldCheck,
     HiOutlineCloudDownload
} from "react-icons/hi";

const API_URL = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api").trim().replace(/\/$/, "");

export default function LiveMeetings() {
     const [toast, setToast] = useState({ show: false, message: "", type: "success" });
     const showToast = (message, type = "success") => {
          setToast({ show: true, message, type });
          setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
     };

     const [courses, setCourses] = useState([]);
     const [loading, setLoading] = useState(true);
     const [syncingRecordings, setSyncingRecordings] = useState(false);

     const [showMeetModal, setShowMeetModal] = useState(false);
     const [selectedCourseForMeet, setSelectedCourseForMeet] = useState("ALL");
     const [meetUrl, setMeetUrl] = useState("");
     const [startUrl, setStartUrl] = useState("");
     const [zoomMeetingId, setZoomMeetingId] = useState("");
     const [zoomPasscode, setZoomPasscode] = useState("");
     const [meetTitle, setMeetTitle] = useState("Live Interactive Class");
     const [meetScheduledAt, setMeetScheduledAt] = useState("Live Now");
     const [meetInstructions, setMeetInstructions] = useState("");
     const [sendingMeetEmail, setSendingMeetEmail] = useState(false);
     const [generatingZoomApi, setGeneratingZoomApi] = useState(false);
     const [endingCourseId, setEndingCourseId] = useState(null);

     const fetchCourses = async () => {
          setLoading(true);
          try {
               const res = await fetch(`${API_URL}/courses`);
               if (res.ok) {
                    const data = await res.json();
                    setCourses(Array.isArray(data) ? data : (data?.course || []));
               }
          } catch (err) {
               showToast("Failed to load courses.", "error");
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchCourses();
     }, []);

     const activeLiveClasses = courses.filter(c => c?.liveClass?.active && c?.liveClass?.meetUrl);

     const handleMeetUrlChange = (url) => {
          setMeetUrl(url);
          if (url && url.includes("zoom.us")) {
               const idMatch = url.match(/\/(?:j|wc\/join)\/(\d+)/);
               if (idMatch && idMatch[1]) setZoomMeetingId(idMatch[1]);
               const pwdMatch = url.match(/[?&]pwd=([^&]+)/);
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
                    body: JSON.stringify({ topic: meetTitle })
               });
               const data = await res.json();
               if (data.success && data.meetUrl) {
                    setMeetUrl(data.meetUrl);
                    if (data.startUrl) setStartUrl(data.startUrl);
                    setZoomMeetingId(data.zoomMeetingId || "");
                    setZoomPasscode(data.passcode || "");
                    showToast("⚡ Real Zoom meeting generated via Zoom API!", "success");
               } else {
                    showToast(data.message || "Failed to generate Zoom meeting.", "error");
               }
          } catch (err) {
               showToast("Failed to connect to Zoom API.", "error");
          } finally {
               setGeneratingZoomApi(false);
          }
     };

     const resetMeetForm = () => {
          setMeetUrl("");
          setStartUrl("");
          setZoomMeetingId("");
          setZoomPasscode("");
          setMeetTitle("Live Interactive Class");
          setMeetScheduledAt("Live Now");
          setMeetInstructions("");
          setSelectedCourseForMeet("ALL");
     };

     const handleSendMeetLink = async (e) => {
          e.preventDefault();
          if (!meetUrl) return showToast("Please enter a valid Zoom meeting link.", "error");

          setSendingMeetEmail(true);
          try {
               const targetCourseObj = courses.find(c => String(c._id) === String(selectedCourseForMeet) || c.slug === selectedCourseForMeet);
               const res = await fetch(`${API_URL}/admin/dispatch-live-meet`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: JSON.stringify({
                         courseId: selectedCourseForMeet,
                         courseSlug: targetCourseObj?.slug || "",
                         courseTitle: selectedCourseForMeet === "ALL" ? "All Courses" : (targetCourseObj?.title || "Course Program"),
                         meetUrl,
                         startUrl,
                         zoomMeetingId,
                         passcode: zoomPasscode,
                         title: meetTitle,
                         scheduledAt: meetScheduledAt,
                         instructions: meetInstructions,
                         saveToCourse: true
                    })
               });

               const data = await res.json();
               if (res.ok && data.success) {
                    showToast(data.message || "Zoom link successfully sent to enrolled students!", "success");
                    resetMeetForm();
                    setShowMeetModal(false);
                    fetchCourses();
               } else {
                    showToast(data.error || "Failed to send Zoom meeting.", "error");
               }
          } catch (err) {
               showToast("Error connecting to server.", "error");
          } finally {
               setSendingMeetEmail(false);
          }
     };

     const handleEndLiveSession = async (courseId, courseSlug) => {
          if (!window.confirm("Are you sure you want to end this Zoom live session?")) return;

          setEndingCourseId(courseId || "ALL");
          try {
               const res = await fetch(`${API_URL}/admin/end-live-meet`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                         "Authorization": `Bearer ${getAdminToken()}`
                    },
                    body: JSON.stringify({ courseId, courseSlug })
               });
               const data = await res.json();
               if (res.ok) {
                    showToast(data.message || "Live Zoom session ended.", "success");
                    fetchCourses();
               } else {
                    showToast(data.error || "Failed to end live session.", "error");
               }
          } catch (err) {
               showToast("Server error.", "error");
          } finally {
               setEndingCourseId(null);
          }
     };

     const handleSyncRecordings = async () => {
          setSyncingRecordings(true);
          try {
               const res = await fetch(`${API_URL}/admin/sync-zoom-recordings`, {
                    method: "POST",
                    headers: {
                         "Authorization": `Bearer ${getAdminToken()}`
                    }
               });
               const data = await res.json();
               if (res.ok && data.success) {
                    showToast(data.message || "Cloud recordings synced successfully!", "success");
                    fetchCourses();
               } else {
                    showToast(data.message || "No new cloud recordings found.", "info");
               }
          } catch (err) {
               showToast("Error connecting to Zoom API.", "error");
          } finally {
               setSyncingRecordings(false);
          }
     };

     return (
          <div className="min-h-screen bg-gray-50/50 pb-12 font-sans">
               <Breadcrumb />

               <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-6">
                    {/* Top Hero Card */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-zinc-800">
                         <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                   <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                                   <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                                        Zoom Live Management Center
                                   </span>
                              </div>
                              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                   Live Classes & Scheduled Sessions
                              </h1>
                              <p className="text-xs sm:text-sm text-zinc-400">
                                   Create, host, dispatch and end active Zoom meetings for enrolled course students.
                              </p>
                         </div>

                         <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto shrink-0">
                              <button
                                   onClick={fetchCourses}
                                   className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition cursor-pointer"
                                   title="Refresh Status"
                              >
                                   <HiOutlineRefresh className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                              </button>

                              <button
                                   onClick={handleSyncRecordings}
                                   disabled={syncingRecordings}
                                   className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-amber-400 border border-amber-400/30 font-bold text-xs rounded-xl flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
                              >
                                   <HiOutlineCloudDownload className="w-5 h-5" />
                                   <span>{syncingRecordings ? "Syncing..." : "Sync Recordings"}</span>
                              </button>

                              <button
                                   onClick={() => setShowMeetModal(true)}
                                   className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition shadow-md cursor-pointer"
                              >
                                   <HiOutlinePlus className="w-5 h-5" />
                                   <span>Schedule New Live Session</span>
                              </button>
                         </div>
                    </div>

                    {/* Active Live Sessions Section */}
                    <div className="space-y-4 pt-2">
                         <div className="flex items-center justify-between">
                              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                   <HiOutlineVideoCamera className="text-red-500 w-5 h-5" />
                                   Active Live Sessions ({activeLiveClasses.length})
                              </h2>
                              {activeLiveClasses.length > 0 && (
                                   <button
                                        onClick={() => handleEndLiveSession("ALL", "")}
                                        className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition cursor-pointer"
                                   >
                                   End All Active Sessions
                                   </button>
                              )}
                         </div>

                         {activeLiveClasses.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                   {activeLiveClasses.map((course) => {
                                        const lc = course.liveClass || {};
                                        return (
                                             <div key={course._id || course.slug} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                                                  <div className="space-y-3">
                                                       <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                                                            <div>
                                                                 <span className="text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-orange-600 px-2.5 py-0.5 rounded-md border border-orange-100">
                                                                      {course.title}
                                                                 </span>
                                                                 <h3 className="text-base font-bold text-gray-900 mt-1 line-clamp-1">
                                                                      {lc.title || "Live Zoom Session"}
                                                                 </h3>
                                                            </div>
                                                            <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse shrink-0">
                                                                 <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                                                 Live
                                                            </span>
                                                       </div>

                                                       <div className="bg-gray-50 p-3.5 rounded-2xl text-xs space-y-2 border border-gray-100">
                                                            <div className="flex justify-between items-center text-gray-600">
                                                                 <span>Scheduled Time:</span>
                                                                 <span className="font-bold text-gray-800">{lc.scheduledAt || "Live Now"}</span>
                                                            </div>
                                                            {lc.zoomMeetingId && (
                                                                 <div className="flex justify-between items-center text-gray-600">
                                                                      <span>Meeting ID:</span>
                                                                      <span className="font-mono font-bold text-gray-800">{lc.zoomMeetingId}</span>
                                                                 </div>
                                                            )}
                                                            {lc.passcode && (
                                                                 <div className="flex justify-between items-center text-gray-600">
                                                                      <span>Passcode:</span>
                                                                      <span className="font-mono font-bold text-primary">{lc.passcode}</span>
                                                                 </div>
                                                            )}
                                                       </div>

                                                       {lc.instructions && (
                                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60">
                                                                 <strong className="text-blue-700">Notes:</strong> {lc.instructions}
                                                            </p>
                                                       )}
                                                  </div>

                                                  <div className="space-y-2 pt-2 border-t border-gray-100">
                                                       <a
                                                            href={lc.startUrl || lc.meetUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                                                       >
                                                            <HiOutlineExternalLink size={16} />
                                                            <span>Start as Host (Zoom App)</span>
                                                       </a>

                                                       <button
                                                            onClick={() => handleEndLiveSession(course._id, course.slug)}
                                                            disabled={endingCourseId === course._id}
                                                            className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                                                       >
                                                            <HiOutlineTrash size={14} />
                                                            <span>{endingCourseId === course._id ? "Ending Session..." : "End Live Session"}</span>
                                                       </button>
                                                  </div>
                                             </div>
                                        );
                                   })}
                              </div>
                         ) : (
                              <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-3">
                                   <HiOutlineVideoCamera className="w-12 h-12 text-gray-300 mx-auto" />
                                   <h3 className="text-base font-bold text-gray-800">No Active Live Sessions</h3>
                                   <p className="text-xs text-gray-400 max-w-sm mx-auto">
                                        Click "Schedule New Live Session" above to start or schedule a Zoom class for enrolled students.
                                   </p>
                              </div>
                         )}
                    </div>
               </div>

               {/* SCHEDULE / DISPATCH ZOOM LIVE CLASS MODAL */}
               {showMeetModal && (
                    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 text-white space-y-4 shadow-2xl relative">
                              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                   <div>
                                        <h3 className="font-bold text-lg text-blue-400 flex items-center gap-2">
                                          Schedule / Dispatch Zoom Live Session
                                        </h3>
                                        <p className="text-xs text-zinc-400 mt-0.5">
                                             Select target course to strictly notify enrolled students via email.
                                        </p>
                                   </div>
                                   <button
                                        type="button"
                                        onClick={() => setShowMeetModal(false)}
                                        className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition cursor-pointer"
                                   >
                                        ✕
                                   </button>
                              </div>

                              <form onSubmit={handleSendMeetLink} className="space-y-4">
                                   {/* Target Course Select */}
                                   <div className="space-y-1">
                                        <label className="text-xs font-bold text-zinc-300">Target Course Filter *</label>
                                        <select
                                             value={selectedCourseForMeet}
                                             onChange={(e) => setSelectedCourseForMeet(e.target.value)}
                                             className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                                        >
                                             <option value="ALL">All Enrolled Students (Across All Courses)</option>
                                             {courses.map((c) => (
                                                  <option key={c._id} value={c._id}>
                                                       {c.title} {c.category ? `(${c.category})` : ""}
                                                  </option>
                                             ))}
                                        </select>
                                   </div>

                                   {/* Session Topic */}
                                   <div className="space-y-1">
                                        <label className="text-xs font-bold text-zinc-300">Session Topic / Title</label>
                                        <input
                                             type="text"
                                             value={meetTitle}
                                             onChange={(e) => setMeetTitle(e.target.value)}
                                             placeholder="e.g. Live Interactive UI/UX Design Workshop"
                                             className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                                        />
                                   </div>

                                   {/* Auto-Generate Button & URL */}
                                   <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                             <label className="text-xs font-bold text-zinc-300">Zoom Meeting URL *</label>
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
                                        <label className="text-[11px] font-bold text-zinc-400">Scheduled Time</label>
                                        <input
                                             type="text"
                                             value={meetScheduledAt}
                                             onChange={(e) => setMeetScheduledAt(e.target.value)}
                                             placeholder="e.g. Today at 7:00 PM"
                                             className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                                        />
                                   </div>

                                   {/* Instructions */}
                                   <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-zinc-400">Instructions (Optional)</label>
                                        <textarea
                                             rows={3}
                                             value={meetInstructions}
                                             onChange={(e) => setMeetInstructions(e.target.value)}
                                             placeholder="Have Figma / VS Code ready before joining..."
                                             className="w-full bg-zinc-800 border border-zinc-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                                        />
                                   </div>

                                   <button
                                        type="submit"
                                        disabled={sendingMeetEmail || !meetUrl}
                                        className={`w-full py-3 text-black font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                                             sendingMeetEmail || !meetUrl
                                                  ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                                                  : "bg-primary hover:bg-primary-hover text-white"
                                        }`}
                                   >
                                        {sendingMeetEmail ? (
                                             <span>Dispatching Zoom Invites...</span>
                                        ) : (
                                             <span>Dispatch Zoom Class & Notify Enrolled Students</span>
                                        )}
                                   </button>
                              </form>
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
