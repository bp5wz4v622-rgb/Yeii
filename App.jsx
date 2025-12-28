import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { Menu, Instagram, X, MessageSquare, Users, PlusCircle, Lock, Camera, LogOut, ChevronRight } from 'lucide-react';

// --- CONFIGURACIÓN DE FIREBASE ---
// Yeison: Cuando tengas tus credenciales de la Firebase Console, pégalas aquí dentro.
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_DOMINIO",
  projectId: "TU_PROYECTO_ID",
  storageBucket: "TU_STORAGE_ID",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ADMINS = [
  { name: "Yeison Jimenez", pass: "117722668y" },
  { name: "Leanny Murray", pass: "982631Adm1n" },
  { name: "Cielo Penson", pass: "Sabrina_Jinx" },
  { name: "Euris Valdez", pass: "URM_29-12M" }
];

export default function App() {
  const [view, setView] = useState('public'); 
  const [adminUser, setAdminUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loginForm, setLoginForm] = useState({ name: '', pass: '' });

  // Carga de noticias desde Firebase
  useEffect(() => {
    if (!firebaseConfig.apiKey.includes("TU_")) {
      const unsub = onSnapshot(collection(db, 'articles'), (snap) => {
        setArticles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsub();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const found = ADMINS.find(a => a.name.toLowerCase() === loginForm.name.toLowerCase() && a.pass === loginForm.pass);
    if (found) {
      setAdminUser(found);
      setView('admin');
    } else {
      alert("Acceso denegado, Yeison.");
    }
  };

  return (
    <div className="min-h-screen">
      {/* HEADER CAÓTICO */}
      <nav className="fixed w-full z-50 bg-black text-white p-5 flex justify-between items-center border-b-8 border-fucsia">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter cursor-pointer" onClick={() => setView('public')}>
          To' <span className="text-cian">Revuelto</span>
        </h1>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setView(view === 'admin' ? 'public' : 'admin')}
            className="border-4 border-white px-4 py-1 font-black uppercase text-xs hover:bg-amarillo hover:text-black transition-colors"
          >
            {view === 'admin' ? 'Ver Web' : 'Staff'}
          </button>
          <Menu className="cursor-pointer hover:text-fucsia" onClick={() => setIsMenuOpen(true)} />
        </div>
      </nav>

      {/* VISTA PÚBLICA */}
      {view === 'public' && (
        <main className="pt-32 pb-20 px-4 container mx-auto">
          <header className="text-center mb-20">
            <div className="inline-block bg-black text-white p-6 -rotate-2 border-4 border-black shadow-[10px_10px_0px_0px_#FFEF00]">
              <h2 className="text-6xl md:text-8xl font-black italic uppercase">El Periódico de la Penya</h2>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.length > 0 ? articles.map(art => (
              <div key={art.id} className="bg-white border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                <div className="bg-cian border-4 border-black h-48 mb-4 overflow-hidden">
                  {art.image && <img src={art.image} alt="news" className="w-full h-full object-cover" />}
                </div>
                <h3 className="text-2xl font-black uppercase italic mb-2">{art.title}</h3>
                <p className="font-bold opacity-70 line-clamp-3">{art.content}</p>
              </div>
            )) : (
              <div className="col-span-full text-center p-20 border-8 border-dashed border-black/10">
                <p className="text-4xl font-black uppercase opacity-20 italic">No hay noticias frescas aún...</p>
              </div>
            )}
          </section>

          {/* FORMULARIO REPORTE */}
          <section className="mt-32 bg-amarillo border-8 border-black p-10 shadow-[20px_20px_0px_0px_#FF0090]">
            <h2 className="text-5xl font-black uppercase italic mb-8">Reporte Ciudadano</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <textarea placeholder="¿QUÉ PASÓ EN TU CALLE?..." className="w-full p-4 border-4 border-black font-black h-40 focus:bg-crema outline-none" />
              <div className="flex flex-col gap-4">
                <button className="bg-black text-white p-4 font-black text-2xl border-4 border-black hover:bg-fucsia transition-colors">SUBIR REPORTE</button>
                <div className="flex items-center gap-4 font-black uppercase italic">
                  <Camera size={40} /> <span>Acompaña con una foto</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* PANEL ADMIN (SOLO YEISON Y EQUIPO) */}
      {view === 'admin' && !adminUser && (
        <div className="pt-40 flex justify-center px-4">
          <form onSubmit={handleLogin} className="bg-white border-8 border-black p-10 max-w-md w-full shadow-[15px_15px_0px_0px_#00DBFF]">
            <h2 className="text-4xl font-black uppercase italic mb-6">Staff Access</h2>
            <div className="flex flex-col gap-4">
              <input 
                className="p-4 border-4 border-black font-black uppercase" 
                placeholder="Nombre" 
                onChange={e => setLoginForm({...loginForm, name: e.target.value})}
              />
              <input 
                type="password"
                className="p-4 border-4 border-black font-black uppercase" 
                placeholder="Contraseña" 
                onChange={e => setLoginForm({...loginForm, pass: e.target.value})}
              />
              <button className="bg-black text-white py-4 font-black uppercase text-xl hover:bg-fucsia">Entrar</button>
            </div>
          </form>
        </div>
      )}

      {view === 'admin' && adminUser && (
        <main className="pt-32 px-4 container mx-auto">
          <div className="bg-cian border-8 border-black p-8 mb-10 flex justify-between items-center">
            <h2 className="text-4xl font-black uppercase italic">Panel de {adminUser.name}</h2>
            <button onClick={() => setAdminUser(null)} className="bg-black text-white px-6 py-2 font-black uppercase">Salir</button>
          </div>
          
          <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_#000]">
            <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
              <PlusCircle /> Nueva Noticia
            </h3>
            <div className="space-y-4">
              <input className="w-full p-4 border-4 border-black font-black" placeholder="TÍTULO..." />
              <textarea className="w-full p-4 border-4 border-black font-black h-40" placeholder="CONTENIDO..." />
              <button className="bg-amarillo border-4 border-black px-10 py-3 font-black uppercase text-xl">Publicar en el Barrio</button>
            </div>
          </div>
        </main>
      )}

      {/* MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center text-white">
          <X className="absolute top-10 right-10 cursor-pointer text-fucsia" size={60} onClick={() => setIsMenuOpen(false)} />
          <div className="text-6xl md:text-9xl font-black italic uppercase flex flex-col gap-10 text-center">
            <span className="hover:text-amarillo cursor-pointer" onClick={() => {setView('public'); setIsMenuOpen(false)}}>Inicio</span>
            <a href="https://instagram.com/to_revuelto" target="_blank" className="hover:text-cian">Instagram</a>
            <span className="hover:text-fucsia cursor-pointer" onClick={() => {setView('admin'); setIsMenuOpen(false)}}>Staff</span>
          </div>
        </div>
      )}
    </div>
  );
}
