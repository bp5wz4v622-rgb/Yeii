import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  query 
} from 'firebase/firestore';
import { 
  PlusCircle,
  X,
  Newspaper,
  Camera,
  ShieldCheck,
  Instagram,
  Lock,
  Trash2,
  LogIn,
  UserPlus,
  Briefcase,
  LogOut,
  UserCog,
  Check
} from 'lucide-react';

// Configuración y URL
const API_URL = 'https://to-revuelto-api.torevueltopj.workers.dev';
const INSTAGRAM_URL = 'https://instagram.com/torevuelto';

const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'to-revuelto-v1';

// Admins fijos
const INITIAL_ADMINS = [
  { user: 'Euris Valdez', pass: 'URM_29-12M' },
  { user: 'Cielo Penson', pass: 'Sabrina_Jinx' },
  { user: 'Leanny Murray', pass: '982631Adm1n' },
  { user: 'Yeison Jiménez', pass: '117722668y' }
];

const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('noticias'); 
  const [news, setNews] = useState([]);
  const [extraAdmins, setExtraAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentStaff, setCurrentStaff] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  const [loginData, setLoginData] = useState({ user: '', pass: '' });
  const [newAdminData, setNewAdminData] = useState({ user: '', pass: '' });

  const [formData, setFormData] = useState({
    title: '', content: '', author: '', category: 'Actualidad', image_url: '' 
  });

  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInAnonymously(auth);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const newsCol = collection(db, 'artifacts', appId, 'public', 'data', 'noticias');
    const unsubscribeNews = onSnapshot(newsCol, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNews(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      setLoading(false);
    });

    const adminsCol = collection(db, 'artifacts', appId, 'public', 'data', 'admins_extra');
    const unsubscribeAdmins = onSnapshot(adminsCol, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExtraAdmins(data);
    });

    return () => {
      unsubscribeNews();
      unsubscribeAdmins();
    };
  }, [user]);

  const handleLogin = (e) => {
    e.preventDefault();
    const allAdmins = [...INITIAL_ADMINS, ...extraAdmins];
    const foundUser = allAdmins.find(u => u.user === loginData.user && u.pass === loginData.pass);
    
    if (foundUser) {
      setCurrentStaff(foundUser.user);
      setShowLoginModal(false);
      setActiveTab('admin');
      setLoginData({ user: '', pass: '' });
    } else {
      alert("Acceso denegado: Datos incorrectos.");
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (currentStaff !== 'Yeison Jiménez') return;
    try {
      const adminsCol = collection(db, 'artifacts', appId, 'public', 'data', 'admins_extra');
      await addDoc(adminsCol, {
        user: newAdminData.user,
        pass: newAdminData.pass,
        addedBy: currentStaff,
        createdAt: new Date().toISOString()
      });
      setNewAdminData({ user: '', pass: '' });
      alert("Nuevo administrador registrado.");
    } catch (err) { alert("Error al registrar."); }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      const newsCol = collection(db, 'artifacts', appId, 'public', 'data', 'noticias');
      await addDoc(newsCol, { ...formData, created_at: new Date().toISOString() });
      setShowPublishModal(false);
      setFormData({ title: '', content: '', author: '', category: 'Actualidad', image_url: '' });
    } catch (err) { alert("Error al publicar."); }
  };

  const deleteNews = async (id) => {
    if (!window.confirm("¿Confirmar eliminación?")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'noticias', id));
    } catch (err) { console.error(err); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image_url: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F3] text-black font-sans pb-20">
      {/* HEADER ESTILO INICIAL */}
      <header className="border-b-8 border-black bg-white p-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => setActiveTab('noticias')}>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none italic">To' Revuelto</h1>
            <p className="text-xs font-black uppercase mt-2 bg-yellow-400 inline-block px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Plataforma de Información Digital</p>
          </div>
          
          <div className="flex gap-4">
            <a href={INSTAGRAM_URL} target="_blank" className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
              <Instagram size={24} />
            </a>
            <button onClick={() => setShowPublishModal(true)} className="hidden md:flex bg-black text-white px-6 py-3 border-4 border-black font-black uppercase text-sm items-center gap-2 hover:bg-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
              <PlusCircle size={20} /> Publicar Noticia
            </button>
          </div>
        </div>
      </header>

      {/* NAV ESTILO INICIAL */}
      <nav className="max-w-6xl mx-auto flex border-x-8 border-b-8 border-black bg-white sticky top-[112px] md:top-[128px] z-30 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('noticias')} className={`flex-1 min-w-[140px] p-5 font-black uppercase text-xs flex items-center justify-center gap-2 border-r-4 border-black ${activeTab === 'noticias' ? 'bg-yellow-400' : 'hover:bg-gray-100'}`}><Newspaper size={18}/> Noticias</button>
        <button onClick={() => setShowJoinModal(true)} className="flex-1 min-w-[140px] p-5 font-black uppercase text-xs flex items-center justify-center gap-2 border-r-4 border-black hover:bg-green-100"><UserPlus size={18}/> Únete al Staff</button>
        <button onClick={() => currentStaff ? setActiveTab('admin') : setShowLoginModal(true)} className={`flex-1 min-w-[140px] p-5 font-black uppercase text-xs flex items-center justify-center gap-2 ${currentStaff ? 'bg-red-500 text-white' : 'hover:bg-gray-100'}`}>
          {currentStaff ? <ShieldCheck size={18}/> : <Lock size={18}/>} {currentStaff ? 'Panel Admin' : 'Acceso Staff'}
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {activeTab === 'noticias' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-8 space-y-16">
              {loading ? (
                <div className="p-20 text-center font-black uppercase text-3xl animate-bounce">Cargando Archivos...</div>
              ) : news.map(item => (
                <article key={item.id} className="bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group overflow-hidden">
                  {item.image_url && <img src={item.image_url} className="w-full border-b-8 border-black object-cover max-h-[500px] grayscale hover:grayscale-0 transition-all duration-500" alt="news" />}
                  <div className="p-10">
                    <div className="flex justify-between items-center mb-8">
                      <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase italic shadow-[3px_3px_0px_0px_rgba(255,255,0,1)]">{item.category}</span>
                      <span className="text-xs font-black opacity-40 uppercase tracking-tighter">{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-black uppercase italic mb-8 leading-none tracking-tighter group-hover:text-red-600 transition-colors">{item.title}</h2>
                    <p className="text-xl font-medium text-gray-900 mb-10 border-l-8 border-yellow-400 pl-6 leading-relaxed">{item.content}</p>
                    <div className="border-t-4 border-black pt-8 flex justify-between items-center text-xs font-black uppercase italic">
                      <span className="bg-yellow-400 px-2">✍️ Reportero: {item.author}</span>
                      <button className="underline decoration-black decoration-4 hover:bg-black hover:text-white px-2 transition-all">Leer crónica</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <aside className="md:col-span-4 space-y-8">
              <div className="bg-white border-8 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-[240px]">
                <h3 className="font-black text-3xl mb-6 uppercase italic leading-none border-b-4 border-black pb-2">Comunidad IG</h3>
                <p className="text-sm font-bold mb-8 italic opacity-80 leading-snug">Únete a nuestra plataforma visual para estar To' Revuelto con lo que pasa.</p>
                <a href={INSTAGRAM_URL} target="_blank" className="block text-center bg-black text-white p-5 font-black uppercase text-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">Seguir en Instagram</a>
              </div>
            </aside>
          </div>
        )}

        {activeTab === 'admin' && currentStaff && (
          <div className="space-y-12">
            <div className="bg-white border-8 border-black p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-8 border-black pb-8 gap-6">
                <div>
                  <h2 className="text-5xl font-black uppercase italic leading-none tracking-tighter">Archivo Editorial</h2>
                  <p className="text-sm font-black uppercase mt-2 bg-red-500 text-white px-3 inline-block">Staff: {currentStaff}</p>
                </div>
                <button onClick={() => {setCurrentStaff(null); setActiveTab('noticias')}} className="bg-black text-white px-8 py-4 text-xs font-black uppercase border-4 border-black flex items-center gap-2 hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(255,0,0,1)] transition-all">
                  <LogOut size={18}/> Salir del Sistema
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-100 border-b-4 border-black">
                      <th className="p-6 text-xs font-black uppercase italic">Titular de la Noticia</th>
                      <th className="p-6 text-xs font-black uppercase italic">Autoría</th>
                      <th className="p-6 text-center text-xs font-black uppercase italic">Gestión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map(n => (
                      <tr key={n.id} className="border-b-2 border-black/10 hover:bg-yellow-50 transition-colors">
                        <td className="p-6 text-sm font-black uppercase">{n.title}</td>
                        <td className="p-6 text-sm font-black uppercase">{n.author}</td>
                        <td className="p-6 text-center">
                          <button onClick={() => deleteNews(n.id)} className="bg-red-500 text-white p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                            <Trash2 size={20}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {currentStaff === 'Yeison Jiménez' && (
              <div className="bg-white border-8 border-black p-10 shadow-[10px_10px_0px_0px_rgba(59,130,246,1)]">
                <h3 className="text-4xl font-black uppercase italic mb-8 flex items-center gap-4 text-blue-600 underline decoration-8">
                  <UserCog size={40}/> Gestión de Admins
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <form onSubmit={handleAddAdmin} className="space-y-6">
                    <p className="text-xs font-black uppercase mb-4 italic opacity-60">Registrar credenciales para nuevo personal administrativo:</p>
                    <input required placeholder="NOMBRE DE USUARIO" className="w-full border-4 border-black p-4 font-black uppercase text-lg outline-none focus:bg-blue-50 focus:border-blue-600 transition-all" value={newAdminData.user} onChange={e => setNewAdminData({...newAdminData, user: e.target.value})} />
                    <input required placeholder="CONTRASEÑA DE ACCESO" className="w-full border-4 border-black p-4 font-black uppercase text-lg outline-none focus:bg-blue-50 focus:border-blue-600 transition-all" value={newAdminData.pass} onChange={e => setNewAdminData({...newAdminData, pass: e.target.value})} />
                    <button className="w-full bg-blue-600 text-white p-5 font-black uppercase text-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Autorizar Credencial</button>
                  </form>
                  <div className="bg-gray-50 border-4 border-black p-6">
                    <p className="text-xs font-black uppercase mb-4 italic underline">Base de Datos Staff Extra</p>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {extraAdmins.length === 0 ? <p className="text-center py-10 font-black uppercase opacity-20 italic">No hay registros</p> : extraAdmins.map(adm => (
                        <div key={adm.id} className="bg-white border-4 border-black p-4 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                          <div>
                            <p className="text-sm font-black uppercase">{adm.user}</p>
                            <p className="text-[10px] font-bold opacity-40 uppercase">Acceso: {adm.pass}</p>
                          </div>
                          <Check className="text-green-600 stroke-[4px]" size={24} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODALES CON DISEÑO ORIGINAL */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-8 border-black p-10 w-full max-w-sm shadow-[15px_15px_0px_0px_rgba(255,255,0,1)]">
            <h2 className="text-4xl font-black uppercase italic mb-8 border-b-8 border-black pb-4 flex items-center gap-4 tracking-tighter">Acceso Staff</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <input required placeholder="USUARIO" className="w-full border-4 border-black p-5 font-black uppercase outline-none focus:bg-yellow-50" value={loginData.user} onChange={e => setLoginData({...loginData, user: e.target.value})} />
              <input required type="password" placeholder="PASSWORD" className="w-full border-4 border-black p-5 font-black uppercase outline-none focus:bg-yellow-50" value={loginData.pass} onChange={e => setLoginData({...loginData, pass: e.target.value})} />
              <button className="w-full bg-black text-white p-5 font-black uppercase border-4 border-black flex items-center justify-center gap-2 text-xl shadow-[4px_4px_0px_0px_rgba(255,0,0,1)]">Entrar <LogIn size={24}/></button>
              <button type="button" onClick={() => setShowLoginModal(false)} className="w-full font-black uppercase text-xs underline mt-4">Cerrar Ventana</button>
            </form>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-white border-8 border-black p-10 w-full max-w-xl shadow-[15px_15px_0px_0px_rgba(34,197,94,1)] my-auto relative">
            <div className="flex justify-between items-start mb-8 border-b-8 border-black pb-4">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Forma parte <br/> de To' Revuelto</h2>
              <button onClick={() => setShowJoinModal(false)} className="bg-black text-white p-2 border-4 border-black hover:bg-red-600 transition-colors"><X size={32}/></button>
            </div>
            <form onSubmit={(e) => {e.preventDefault(); alert('Propuesta enviada al equipo.'); setShowJoinModal(false)}} className="space-y-6">
              <input required placeholder="TU NOMBRE" className="w-full border-4 border-black p-4 font-black uppercase outline-none" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select className="w-full border-4 border-black p-4 font-black uppercase outline-none bg-white">
                  <option>Redacción</option><option>Marketing</option><option>Diseño</option>
                </select>
                <input required type="email" placeholder="CORREO" className="w-full border-4 border-black p-4 font-black uppercase outline-none" />
              </div>
              <input placeholder="PORTAFOLIO (LINK)" className="w-full border-4 border-black p-4 font-black uppercase outline-none" />
              <textarea required placeholder="¿POR QUÉ DEBERÍAS ESTAR AQUÍ?" rows="4" className="w-full border-4 border-black p-4 font-black uppercase outline-none" />
              <button className="w-full bg-green-500 text-white p-6 font-black uppercase text-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-4">
                <Briefcase size={28}/> Postular ahora
              </button>
            </form>
          </div>
        </div>
      )}

      {showPublishModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white border-8 border-black p-10 w-full max-w-3xl shadow-[15px_15px_0px_0px_rgba(255,0,0,1)] my-auto relative">
            <div className="flex justify-between items-center mb-8 border-b-8 border-black pb-4">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter">Publicación</h2>
              <button onClick={() => setShowPublishModal(false)} className="bg-black text-white p-2 border-4 border-black hover:bg-red-600 transition-colors"><X size={32}/></button>
            </div>
            <form onSubmit={handlePublish} className="space-y-6">
              <input required placeholder="TITULAR DE IMPACTO" className="w-full border-4 border-black p-5 font-black uppercase text-2xl outline-none focus:bg-yellow-50" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="REPORTERO / FIRMA" className="w-full border-4 border-black p-4 font-black uppercase outline-none" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
                <select className="w-full border-4 border-black p-4 font-black uppercase outline-none bg-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Actualidad</option><option>Deportes</option><option>Cultura</option><option>Sucesos</option><option>Opinión</option>
                </select>
              </div>
              <div className="border-8 border-black p-10 bg-gray-50 flex flex-col items-center justify-center relative min-h-[200px] border-dashed hover:bg-yellow-50 transition-all group">
                {formData.image_url ? (
                  <div className="relative w-full">
                    <img src={formData.image_url} className="w-full h-64 object-cover border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" alt="preview" />
                    <button type="button" onClick={() => setFormData({...formData, image_url: ''})} className="absolute top-0 right-0 bg-red-600 text-white p-2 border-4 border-black"><X size={20}/></button>
                  </div>
                ) : (
                  <>
                    <Camera size={48} className="mb-4" />
                    <span className="font-black text-xs uppercase underline">Subir Imagen de Galería</span>
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                  </>
                )}
              </div>
              <textarea required placeholder="ESCRIBE LOS HECHOS AQUÍ..." rows="6" className="w-full border-4 border-black p-5 font-black text-lg outline-none focus:bg-yellow-50" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}></textarea>
              <button className="w-full bg-black text-white p-6 font-black text-3xl uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,0,1)] active:translate-y-2 active:shadow-none transition-all">Sincronizar y Publicar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
