import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
     HiOutlineAcademicCap,
     HiOutlineBookOpen,
     HiOutlineLocationMarker,
     HiOutlineBriefcase,
     HiOutlineQuestionMarkCircle,
     HiOutlineGlobeAlt,
     HiOutlineLink,
     HiOutlineDatabase,
     HiOutlineArrowSmRight,
     HiOutlineClock,
     HiOutlineMenu
} from "react-icons/hi";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export default function Home() {
     const [stats, setStats] = useState({
          courses: 0,
          blogs: 0,
          locations: 0,
          partners: 0
     });
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const fetchStats = async () => {
               try {
                    setLoading(true);
                    const [resCourses, resBlogs, resLocations, resPartners] = await Promise.all([
                         fetch(`${API_URL}/courses`).then(r => r.json()).catch(() => []),
                         fetch(`${API_URL}/blogs`).then(r => r.json()).catch(() => []),
                         fetch(`${API_URL}/locations`).then(r => r.json()).catch(() => []),
                         fetch(`${API_URL}/images`).then(r => r.json()).catch(() => [])
                    ]);

                    setStats({
                         courses: Array.isArray(resCourses) ? resCourses.length : 0,
                         blogs: Array.isArray(resBlogs) ? resBlogs.length : 0,
                         locations: Array.isArray(resLocations) ? resLocations.length : 0,
                         partners: Array.isArray(resPartners) ? resPartners.length : 0
                    });
               } catch (err) {
                    console.error("Failed to load statistics:", err);
               } finally {
                    setLoading(false);
               }
          };

          fetchStats();
     }, []);

     const dateString = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
     });

     const statCards = [
          {
               name: "Total Courses",
               value: stats.courses,
               icon: HiOutlineAcademicCap,
               color: "text-orange-600 bg-orange-50 border-orange-100",
               path: "/courses",
               desc: "Manage classes, lessons, and pricing structures."
          },
          {
               name: "Total Blogs",
               value: stats.blogs,
               icon: HiOutlineBookOpen,
               color: "text-blue-600 bg-blue-50 border-blue-100",
               path: "/blogs",
               desc: "Create and publish educational content."
          },
          {
               name: "Total Locations",
               value: stats.locations,
               icon: HiOutlineLocationMarker,
               color: "text-emerald-600 bg-emerald-50 border-emerald-100",
               path: "/location",
               desc: "Edit branch details and regional FAQ pages."
          },
          {
               name: "Companies Worked With",
               value: stats.partners,
               icon: HiOutlineBriefcase,
               color: "text-purple-600 bg-purple-50 border-purple-100",
               path: "/companies-worked",
               desc: "Manage partner logos displayed on the site."
          }
     ];

     const quickActions = [
          {
               name: "SEO Settings",
               icon: HiOutlineGlobeAlt,
               path: "/site-meta",
               desc: "Optimize meta tags, keywords, and search visibility."
          },
          {
               name: "FAQ Manager",
               icon: HiOutlineQuestionMarkCircle,
               path: "/faq",
               desc: "Maintain page-wise global FAQs."
          },
          {
               name: "Footer Manager",
               icon: HiOutlineLink,
               path: "/footer",
               desc: "Structure footer link lists and columns."
          },
          {
               name: "Home Page Content",
               icon: HiOutlineDatabase,
               path: "/home-data",
               desc: "Change highlights, community points and hero sections."
          },
          {
               name: "About Page Content",
               icon: HiOutlineDatabase,
               path: "/about-data",
               desc: "Customize the mission statement and core company values."
          },
          {
               name: "Navbar Settings",
               icon: HiOutlineMenu,
               path: "/navbar-settings",
               desc: "Configure navigation links, logo branding, and search text."
          }
     ];

     return (
          <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 font-sans">
               {/* Welcome Banner */}
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-200/80 p-6 rounded-2xl shadow-sm">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                              Dashboard Overview
                         </h1>
                         <p className="text-gray-500 text-sm mt-1">
                              System stats and site configuration portal.
                         </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-100 px-3.5 py-2 rounded-xl">
                         <HiOutlineClock className="w-4 h-4 text-gray-400" />
                         <span>{dateString}</span>
                    </div>
               </div>

               {/* Stats Grid */}
               <div>
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                         Platform Insights
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                         {statCards.map((card) => {
                              const Icon = card.icon;
                              return (
                                   <div
                                        key={card.name}
                                        className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                                   >
                                        <div>
                                             <div className="flex items-center justify-between mb-4">
                                                  <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                                       {card.name}
                                                  </span>
                                                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${card.color}`}>
                                                       <Icon className="w-5 h-5" />
                                                  </div>
                                             </div>
                                             {loading ? (
                                                  <div className="h-9 w-16 bg-gray-100 animate-pulse rounded-md mb-2"></div>
                                             ) : (
                                                  <div className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                                                       {card.value}
                                                  </div>
                                             )}
                                             <p className="text-gray-400 text-xs leading-normal mb-4">
                                                  {card.desc}
                                             </p>
                                        </div>
                                        <Link
                                             to={card.path}
                                             className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
                                        >
                                             <span>Manage</span>
                                             <HiOutlineArrowSmRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                   </div>
                              );
                         })}
                    </div>
               </div>

               {/* Quick Actions / Configuration Modules */}
               <div>
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                         Configuration Modules
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {quickActions.map((action) => {
                              const Icon = action.icon;
                              return (
                                   <Link
                                        key={action.name}
                                        to={action.path}
                                        className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group flex gap-4 items-start"
                                    >
                                        <div className="p-3 bg-gray-50 text-gray-500 rounded-xl border border-gray-100 group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-100 transition-all shrink-0">
                                             <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-1">
                                             <div className="flex items-center gap-1">
                                                  <h3 className="font-bold text-gray-900 text-sm group-hover:text-orange-500 transition-colors">
                                                       {action.name}
                                                  </h3>
                                                  <HiOutlineArrowSmRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                             </div>
                                             <p className="text-gray-400 text-xs leading-relaxed">
                                                  {action.desc}
                                             </p>
                                        </div>
                                   </Link>
                              );
                         })}
                    </div>
               </div>
          </div>
     );
}
