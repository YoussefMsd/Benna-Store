"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Plus, Trash2, Edit3, ShoppingBag, 
  Utensils, Megaphone, ShieldAlert, LogOut, X, Check, Clock 
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dishes" | "orders" | "settings">("dishes");

  // بيانات الأطباق والطلبات
  const [dishes, setDishes] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  // تتبع الطلبات اللي كاتمسح باش تخدم الـ Animation
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  
  // نموذج إضافة طبق جديد
  const [newDish, setNewDish] = useState({
    title: "",
    description: "",
    price: "",
    category: "Tajine",
    stock: 10,
    image_url: ""
  });

  const [editingDish, setEditingDish] = useState<any | null>(null);

  // إعدادات الإعلان
  const [announcementText, setAnnouncementText] = useState("🔥 التوصيل مجاني للطلبات فوق 150 درهم!");

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const ADMIN_EMAIL = "e.youssef.code@gmail.com"; // <-- استبدله بإيميلك الحقيقي

    if (!session || session.user.email !== ADMIN_EMAIL) {
      alert("Access Denied! Admin only.");
      router.push("/");
    } else {
      setIsAdmin(true);
      fetchDishes();
      fetchOrders();
      fetchAnnouncement();
    }
    setLoading(false);
  };

  const fetchDishes = async () => {
    const { data } = await supabase.from("dishes").select("*").order("created_at", { ascending: false });
    if (data) setDishes(data);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
    if (error) console.error("Error fetching orders:", error);
  };

  // تعديل حالة الطلب (Status)
  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      setOrders(orders.map((order) => (order.id === id ? { ...order, status: newStatus } : order)));
    }
  };

  // حذف الطلب من قاعدة البيانات مع Animation Smooth
  const handleDeleteOrder = async (id: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      // 1. تفعيل الـ Animation ديال الاختفاء
      setDeletingOrderId(id);

      // 2. الحذف من Supabase
      const { error, count } = await supabase.from("orders").delete({ count: 'exact' }).eq("id", id);
      
      console.log("Supabase Delete Result - Error:", error, "Count:", count);

      if (error) {
        alert("Error deleting order from database: " + error.message);
        setDeletingOrderId(null); // إلغاء الـ Animation إلا وقع خطأ
      } else {
        // الانتظار حتى تكمن الـ Animation عاد يتحيد من الـ State (300ms)
        setTimeout(() => {
          setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
          setDeletingOrderId(null);
        }, 300);
      }
    }
  };

  const fetchAnnouncement = async () => {
    const { data } = await supabase.from("settings").select("*").eq("key", "announcement").maybeSingle();
    if (data) setAnnouncementText(data.value);
  };

  const handleUpdateAnnouncement = async () => {
    const { error } = await supabase
      .from("settings")
      .upsert({ key: "announcement", value: announcementText }, { onConflict: "key" });

    if (!error) {
      alert("Announcement updated and saved successfully!");
    } else {
      alert("Error updating announcement: " + error.message);
    }
  };

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("dishes").insert([
      {
        title: newDish.title,
        description: newDish.description,
        price: parseFloat(newDish.price),
        category: newDish.category,
        stock: Number(newDish.stock),
        image_url: newDish.image_url || "https://images.unsplash.com/photo-1541518763669-27fef04b14e8"
      }
    ]);

    if (!error) {
      alert("Dish added successfully!");
      setNewDish({ title: "", description: "", price: "", category: "Tajine", stock: 10, image_url: "" });
      fetchDishes();
    } else {
      alert("Error adding dish: " + error.message);
    }
  };

  const handleUpdateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;

    const { error } = await supabase
      .from("dishes")
      .update({
        title: editingDish.title,
        description: editingDish.description,
        price: parseFloat(editingDish.price),
        category: editingDish.category,
        stock: Number(editingDish.stock),
        image_url: editingDish.image_url
      })
      .eq("id", editingDish.id);

    if (!error) {
      alert("Dish updated successfully!");
      setEditingDish(null);
      fetchDishes();
    } else {
      alert("Error updating dish: " + error.message);
    }
  };

  const handleDeleteDish = async (id: string) => {
    if (confirm("Are you sure you want to delete this dish?")) {
      const { error } = await supabase.from("dishes").delete().eq("id", id);
      if (!error) fetchDishes();
      else alert(error.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Verifying Admin Permissions...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <ShieldAlert className="w-8 h-8 text-[#2EC4B6]" />
            <h1 className="text-xl font-black tracking-wider text-white">BENNA ADMIN</h1>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dishes")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === "dishes" ? "bg-[#2EC4B6] text-white" : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <Utensils className="w-5 h-5" />
              Dishes (Menu)
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === "orders" ? "bg-[#2EC4B6] text-white" : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Orders (Live)
              {orders.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full transition-all">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === "settings" ? "bg-[#2EC4B6] text-white" : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <Megaphone className="w-5 h-5" />
              Announcement Bar
            </button>
          </nav>
        </div>

        <button 
          onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 font-bold text-sm mt-8"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10">
        {/* TAB 1: DISHES MANAGEMENT */}
        {activeTab === "dishes" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900">Manage Dishes</h2>
              <span className="bg-[#2EC4B6]/10 text-[#2EC4B6] px-4 py-1.5 rounded-full text-xs font-bold">
                Total: {dishes.length} Items
              </span>
            </div>

            {editingDish ? (
              <form onSubmit={handleUpdateDish} className="bg-amber-50/60 border-2 border-amber-200 p-6 rounded-2xl shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-amber-900 flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-amber-600" /> Edit Dish: {editingDish.title}
                  </h3>
                  <button type="button" onClick={() => setEditingDish(null)} className="text-gray-400 hover:text-gray-700 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Dish Title"
                    required
                    value={editingDish.title}
                    onChange={(e) => setEditingDish({ ...editingDish, title: e.target.value })}
                    className="p-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
                  />
                  <input
                    type="number"
                    placeholder="Price (MAD)"
                    required
                    value={editingDish.price}
                    onChange={(e) => setEditingDish({ ...editingDish, price: e.target.value })}
                    className="p-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
                  />
                  <select
                    value={editingDish.category || "Others"}
                    onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
                    className="p-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
                  >
                    <option value="Tajine">Tajine</option>
                    <option value="Grills">Grills</option>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Others">Others</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Stock quantity"
                    required
                    value={editingDish.stock}
                    onChange={(e) => setEditingDish({ ...editingDish, stock: Number(e.target.value) })}
                    className="p-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={editingDish.image_url}
                    onChange={(e) => setEditingDish({ ...editingDish, image_url: e.target.value })}
                    className="p-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6] md:col-span-2"
                  />
                </div>
                <textarea
                  placeholder="Dish description..."
                  value={editingDish.description}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  className="w-full p-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
                />
                <div className="flex gap-3">
                  <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                    <Check className="w-4 h-4" /> Update Dish
                  </button>
                  <button type="button" onClick={() => setEditingDish(null)} className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold text-sm transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAddDish} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#2EC4B6]" /> Add New Dish
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Dish Title"
                    required
                    value={newDish.title}
                    onChange={(e) => setNewDish({ ...newDish, title: e.target.value })}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
                  />
                  <input
                    type="number"
                    placeholder="Price (MAD)"
                    required
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
                  />
                  <select
                    value={newDish.category}
                    onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
                  >
                    <option value="Tajine">Tajine</option>
                    <option value="Grills">Grills</option>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Others">Others</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Stock quantity"
                    required
                    value={newDish.stock}
                    onChange={(e) => setNewDish({ ...newDish, stock: Number(e.target.value) })}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={newDish.image_url}
                    onChange={(e) => setNewDish({ ...newDish, image_url: e.target.value })}
                    className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6] md:col-span-2"
                  />
                </div>
                <textarea
                  placeholder="Dish description..."
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
                />
                <button type="submit" className="bg-[#2EC4B6] hover:bg-[#25a397] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all">
                  Save Dish
                </button>
              </form>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-bold">
                  <tr>
                    <th className="p-4">Dish</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {dishes.map((dish) => (
                    <tr key={dish.id} className="hover:bg-gray-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img src={dish.image_url} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-gray-900">{dish.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{dish.description}</p>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-gray-600">{dish.category || "Others"}</td>
                      <td className="p-4 font-bold text-[#FF9F1C]">{dish.price} MAD</td>
                      <td className="p-4 font-bold text-gray-700">{dish.stock}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditingDish(dish)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit Dish">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteDish(dish.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete Dish">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900">Live Customer Orders</h2>
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-gray-100 text-gray-400 font-semibold shadow-sm">
                No orders received yet.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isDeleting = deletingOrderId === order.id;
                  return (
                    <div 
                      key={order.id} 
                      className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 transform ${
                        isDeleting ? "opacity-0 scale-95 -translate-y-2 pointer-events-none" : "opacity-100 scale-100 translate-y-0"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-gray-900 text-lg">{order.customer_name}</span>
                          <span className="bg-emerald-50 text-emerald-600 px-3 py-0.5 rounded-full text-xs font-bold">{order.customer_phone}</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-2">📍 {order.customer_address}</p>
                        
                        {/* قائمة الأطباق المطلوبة */}
                        <div className="text-xs text-gray-500 mb-2 space-x-1">
                          {order.items?.map((item: any, idx: number) => (
                            <span key={idx} className="inline-block bg-gray-100 px-2 py-1 rounded font-medium mr-1">
                              {item.title} (x{item.quantity})
                            </span>
                          ))}
                        </div>

                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {new Date(order.created_at).toLocaleString()}
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-3 w-full md:w-auto">
                        <span className="text-xl font-black text-[#FF9F1C]">{order.total_price} MAD</span>
                        
                        <div className="flex items-center gap-2">
                          {/* قائمة منسدلة لتعديل الحالة */}
                          <select
                            value={order.status || "Pending"}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-2 rounded-xl outline-none cursor-pointer border ${
                              order.status === "Confirmed"
                                ? "bg-blue-50 border-blue-200 text-blue-600"
                                : order.status === "Delivered"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                : order.status === "Cancelled"
                                ? "bg-red-50 border-red-200 text-red-600"
                                : "bg-amber-50 border-amber-200 text-amber-600"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          {/* زر X يظهر فقط إذا كانت الحالة Delivered أو Cancelled */}
                          {(order.status === "Delivered" || order.status === "Cancelled") && (
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 p-2 rounded-xl transition-all duration-200 active:scale-90"
                              title="Remove Order"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ANNOUNCEMENT SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-2xl font-black text-gray-900">Announcement Bar Header</h2>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
              <label className="block text-sm font-bold text-gray-700">Top Header Banner Text</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#2EC4B6]"
              />
              <button 
                onClick={handleUpdateAnnouncement}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all"
              >
                Save & Update Banner
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}