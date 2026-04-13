import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut
} from 'firebase/auth';
import { 
  getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot 
} from 'firebase/firestore';
import { 
  Bot, Users, Plus, Trash2, Edit3, Code, Copy, CheckCircle, Send, X, 
  AlertCircle, PlayCircle, UploadCloud, Loader, LogOut, Lock, Mail, ChevronRight
} from 'lucide-react';

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Configuración del Widget del Cliente
const USER_FIREBASE_CONFIG = `{
  apiKey: "AIzaSyA9HXjjB67QPFRdikkkWALy4w3tDh24qdQ",
  authDomain: "chatbotequalsby.firebaseapp.com",
  projectId: "chatbotequalsby",
  storageBucket: "chatbotequalsby.firebasestorage.app",
  messagingSenderId: "1033372010908",
  appId: "1:1033372010908:web:ae7289aa4cfd1ca7cda059"
}`;

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Autenticación inicial del sistema (Regla estricta)
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Error de inicialización de auth:", error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-indigo-200 font-medium tracking-wide animate-pulse">Iniciando BotAdmin Pro...</p>
        </div>
      </div>
    );
  }

  // Si el usuario es anónimo, mostramos la pantalla de Login (diseño premium)
  if (!user || user.isAnonymous) {
    return <AuthScreen />;
  }

  // Si está autenticado con correo, mostramos el Dashboard
  return <Dashboard user={user} />;
}

// --- PANTALLA DE AUTENTICACIÓN (LOGIN / REGISTRO PREMIUM) ---
function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err?.message?.includes('auth/') ? 'Credenciales incorrectas o usuario ya existe.' : 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-xl shadow-indigo-500/30 mb-6">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">BotAdmin <span className="text-indigo-400">Pro</span></h1>
          <p className="text-indigo-200/60 mt-2 font-medium">Plataforma SaaS de Asistentes IA</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            {isLogin ? 'Iniciar Sesión' : 'Crear una cuenta'}
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-indigo-100/70 mb-2">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-300">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white transition-all"
                  placeholder="admin@empresa.com" required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-indigo-100/70 mb-2">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-300">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white transition-all"
                  placeholder="••••••••" required
                />
              </div>
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
            >
              {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : (isLogin ? 'Acceder al Panel' : 'Registrarse')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-indigo-200/60">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD PRINCIPAL PREMIUM ---
function Dashboard({ user }) {
  const [clients, setClients] = useState([]);
  const [currentView, setCurrentView] = useState('clients'); 
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (!user) return;
    const clientsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'chatbot_clients');
    const unsubscribe = onSnapshot(clientsRef, (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClients(clientsData);
    });
    return () => unsubscribe();
  }, [user]);

  const saveClient = async (clientData) => {
    const clientId = clientData.id || crypto.randomUUID();
    const clientRef = doc(db, 'artifacts', appId, 'users', user.uid, 'chatbot_clients', clientId);
    await setDoc(clientRef, { ...clientData, id: clientId, updatedAt: new Date().toISOString() });
    setCurrentView('clients');
  };

  const deleteClient = async (clientId) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente permanentemente?')) return;
    const clientRef = doc(db, 'artifacts', appId, 'users', user.uid, 'chatbot_clients', clientId);
    await deleteDoc(clientRef);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="min-h-screen flex bg-[#F3F4F6] font-sans text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar Premium */}
      <aside className="w-[280px] bg-[#0B1120] text-slate-300 flex flex-col border-r border-slate-800/50 shadow-2xl z-20 relative">
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">BotAdmin Pro</h1>
            <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold mt-0.5">SaaS Platform</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Menú Principal</p>
          <SidebarBtn 
            icon={<Users className="w-5 h-5" />} label="Gestión de Clientes" 
            active={currentView === 'clients' || currentView === 'editor'} 
            onClick={() => setCurrentView('clients')} 
          />
          <SidebarBtn 
            icon={<PlayCircle className="w-5 h-5" />} label="Simulador IA" 
            active={currentView === 'simulator'} 
            onClick={() => setCurrentView('simulator')} 
          />
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold uppercase">
              {(user?.email || 'A').charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.email || 'Administrador'}</p>
              <p className="text-xs text-slate-500">Administrador</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none"></div>
        
        {currentView === 'clients' && (
          <ClientList 
            clients={clients} 
            onEdit={(c) => { setSelectedClient(c); setCurrentView('editor'); }} 
            onDelete={deleteClient}
            onNew={() => { setSelectedClient(null); setCurrentView('editor'); }}
          />
        )}
        {currentView === 'editor' && (
          <ClientEditor 
            client={selectedClient} onSave={saveClient} 
            onCancel={() => setCurrentView('clients')} userUid={user.uid}
          />
        )}
        {currentView === 'simulator' && (
          <Simulator clients={clients} />
        )}
      </main>
    </div>
  );
}

function SidebarBtn({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${active ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </div>
      {active && <ChevronRight className="w-4 h-4 opacity-70" />}
    </button>
  );
}

function ClientList({ clients, onEdit, onDelete, onNew }) {
  return (
    <div className="flex-1 overflow-auto p-10 z-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Clientes</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Administra y configura los chatbots de tus empresas.</p>
        </div>
        <button onClick={onNew} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5">
          <Plus className="w-5 h-5" /> Nuevo Cliente
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-16 text-center shadow-xl shadow-slate-200/20">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Users className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Aún no hay clientes</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Comienza agregando tu primera empresa para crearle una base de conocimiento y su propio chatbot inteligente.</p>
          <button onClick={onNew} className="bg-white border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-6 py-3 rounded-xl font-bold transition-all shadow-sm">
            Crear Primer Cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clients.map(client => (
            <div key={client.id} className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -z-10 opacity-50"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gradient-to-tr from-indigo-100 to-purple-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm border border-white">
                  {(client.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(client)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl bg-slate-50 border border-slate-100 shadow-sm transition-all">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(client.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl bg-slate-50 border border-slate-100 shadow-sm transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-1 tracking-tight">{client.name}</h3>
              <p className="text-sm text-slate-500 mb-6 flex items-center gap-1">
                {client.domain ? <span className="truncate">{client.domain}</span> : 'Sin dominio configurado'}
              </p>
              
              <div className="bg-slate-50/80 rounded-xl p-3.5 text-xs text-slate-600 border border-slate-100 flex items-center gap-3 mb-6 font-medium">
                <div className="p-1.5 bg-white rounded-lg shadow-sm text-indigo-500"><Bot className="w-4 h-4" /></div>
                <span>BD: {client.knowledgeBase?.length || 0} caracteres</span>
              </div>
              
              <button onClick={() => onEdit(client)} className="w-full py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-md">
                Configurar Bot
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ClientEditor({ client, onSave, onCancel, userUid }) {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    greeting: '¡Hola! Soy el asistente virtual. ¿En qué te puedo ayudar?',
    knowledgeBase: '',
    primaryColor: '#4F46E5', // Indigo by default
    whatsapp: ''
  });
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const fileInputRef = useRef(null);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);

  useEffect(() => {
    if (client) setFormData(client);
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") return alert("Solo archivos PDF.");
    setIsExtractingPdf(true);
    try {
      if (!window.pdfjsLib) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve();
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let extractedText = `\n--- Info Extraída de ${file.name} ---\n`;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        extractedText += textContent.items.map(item => item.str).join(" ") + "\n";
      }
      setFormData(prev => ({
        ...prev,
        knowledgeBase: prev.knowledgeBase ? prev.knowledgeBase + "\n" + extractedText : extractedText.trim()
      }));
    } catch (error) {
      alert("Error al extraer PDF.");
    } finally {
      setIsExtractingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#F3F4F6] relative z-10">
      {/* Topbar flotante premium */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-10 py-5 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"><X className="w-5 h-5" /></button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{client ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</h2>
            <p className="text-xs text-slate-500 font-medium">Configura la identidad y conocimiento de la IA</p>
          </div>
        </div>
        <div className="flex gap-3">
          {client && (
            <button onClick={() => setShowEmbedCode(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 rounded-xl font-bold text-sm transition-all shadow-sm">
              <Code className="w-4 h-4" /> Instalar Bot
            </button>
          )}
          <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/25">
            Guardar Configuración
          </button>
        </div>
      </div>

      <div className="p-10 max-w-5xl mx-auto space-y-8">
        
        {/* Card 1: Perfil */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/20">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Users className="w-4 h-4" /></span>
            Perfil de la Empresa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Empresa</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej: Zapatería Premium" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Sitio Web (Opcional)</label>
              <input type="url" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" 
                value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Card 2: Apariencia */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/20">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><Bot className="w-4 h-4" /></span>
            Apariencia y Comportamiento
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
             <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mensaje de Bienvenida</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" 
                value={formData.greeting} onChange={e => setFormData({...formData, greeting: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Color Corporativo (Widget)</label>
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <input type="color" className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" 
                  value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} />
                <span className="text-sm font-mono text-slate-600 uppercase font-medium">{formData.primaryColor}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Desvío a Asesor Humano (WhatsApp)</label>
            <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
              value={formData.whatsapp || ''} onChange={e => setFormData({...formData, whatsapp: e.target.value})} placeholder="Ej: 573001234567 (Solo números)" />
            <p className="text-xs text-slate-500 mt-2 font-medium">Al configurar esto, aparecerá un botón en el chat para enviar el historial al asesor.</p>
          </div>
        </div>

        {/* Card 3: Base de Conocimiento */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                Cerebro de la IA
              </h3>
              <p className="text-sm text-indigo-200/70 mt-1 max-w-xl">
                Alimenta al asistente con el catálogo, reglas, políticas o FAQs. La IA responderá exclusivamente usando esta información.
              </p>
            </div>
            <div>
              <input type="file" accept=".pdf" ref={fileInputRef} onChange={handlePdfUpload} className="hidden" />
              <button 
                type="button" onClick={() => fileInputRef.current?.click()} disabled={isExtractingPdf}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/10"
              >
                {isExtractingPdf ? <Loader className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                {isExtractingPdf ? 'Leyendo PDF...' : 'Entrenar con PDF'}
              </button>
            </div>
          </div>
          
          <textarea 
            className="w-full h-80 px-5 py-4 bg-black/40 border border-white/10 text-indigo-50 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none font-mono text-sm leading-relaxed relative z-10 custom-scrollbar" 
            value={formData.knowledgeBase} 
            onChange={e => setFormData({...formData, knowledgeBase: e.target.value})} 
            placeholder="- Escribe o pega aquí la información de tu empresa..."
          />
        </div>
      </div>

      {showEmbedCode && client && (
        <EmbedModal client={client} userUid={userUid} onClose={() => setShowEmbedCode(false)} />
      )}
    </div>
  );
}

function EmbedModal({ client, userUid, onClose }) {
  const [copied, setCopied] = useState(false);

  const waButtonHTML = client.whatsapp ? 
    `<button id="mi-chatbot-wa" style="background:#25D366; color:white; border:none; padding:6px 12px; border-radius:20px; cursor:pointer; font-size:12px; margin-right:8px; font-weight:bold; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display:flex; align-items:center; gap:5px;">💬 Asesor Humano</button>` : '';

  const embedCode = `
<!-- Widget Inteligente de ${client.name} -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
  
  const firebaseConfig = ${USER_FIREBASE_CONFIG};
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // CLAVE API GEMINI (AI STUDIO)
  const GEMINI_API_KEY = "TU_API_KEY_AQUI"; 

  const style = document.createElement('style');
  style.innerHTML = \`
    #mi-chatbot-btn { position: fixed; bottom: 25px; right: 25px; width: 65px; height: 65px; border-radius: 50%; background: linear-gradient(135deg, ${client.primaryColor}, #000); color: white; border: none; box-shadow: 0 8px 24px rgba(0,0,0,0.2); cursor: pointer; z-index: 9999; display: flex; align-items: center; justify-content: center; font-size: 28px; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);}
    #mi-chatbot-btn:hover { transform: scale(1.1); }
    #mi-chatbot-window { position: fixed; bottom: 100px; right: 25px; width: 380px; height: 550px; background: #fff; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); z-index: 9999; display: none; flex-direction: column; overflow: hidden; font-family: 'Segoe UI', system-ui, sans-serif; border: 1px solid #f0f0f0;}
    #mi-chatbot-header { background: ${client.primaryColor}; color: white; padding: 18px 20px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
    #mi-chatbot-messages { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #f8fafc; }
    #mi-chatbot-input-container { display: flex; padding: 15px; border-top: 1px solid #f1f5f9; background: white; gap:10px; }
    #mi-chatbot-input { flex: 1; padding: 12px 18px; border: 1px solid #e2e8f0; border-radius: 25px; outline: none; font-size:14px; background:#f8fafc; transition: all 0.2s; }
    #mi-chatbot-input:focus { border-color: ${client.primaryColor}; background:white; }
    #mi-chatbot-send { background: ${client.primaryColor}; border: none; color: white; cursor: pointer; font-weight: bold; padding:0 20px; border-radius:25px; transition: opacity 0.2s; }
    #mi-chatbot-send:hover { opacity: 0.9; }
    .msg { max-width: 85%; padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.5; box-shadow: 0 2px 5px rgba(0,0,0,0.02);}
    .msg-bot { background: white; border: 1px solid #e2e8f0; align-self: flex-start; border-bottom-left-radius: 4px; color:#334155; }
    .msg-user { background: ${client.primaryColor}; color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
  \`;
  document.head.appendChild(style);

  const widgetContainer = document.createElement('div');
  widgetContainer.innerHTML = \`
    <button id="mi-chatbot-btn">✨</button>
    <div id="mi-chatbot-window">
      <div id="mi-chatbot-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:10px; height:10px; background:#4ade80; border-radius:50%;"></div>
          ${client.name}
        </div>
        <div style="display:flex; align-items:center;">
          ${waButtonHTML}
          <button id="mi-chatbot-close" style="background:none;border:none;color:white;cursor:pointer;font-size:20px;opacity:0.8;padding:0 5px;">&times;</button>
        </div>
      </div>
      <div id="mi-chatbot-messages">
        <div class="msg msg-bot">${client.greeting}</div>
      </div>
      <div id="mi-chatbot-input-container">
        <input type="text" id="mi-chatbot-input" placeholder="Escribe aquí..." autocomplete="off" />
        <button id="mi-chatbot-send">Enviar</button>
      </div>
    </div>
  \`;
  document.body.appendChild(widgetContainer);

  const btn = document.getElementById('mi-chatbot-btn');
  const win = document.getElementById('mi-chatbot-window');
  const close = document.getElementById('mi-chatbot-close');
  const sendBtn = document.getElementById('mi-chatbot-send');
  const input = document.getElementById('mi-chatbot-input');
  const messagesDiv = document.getElementById('mi-chatbot-messages');
  const waBtn = document.getElementById('mi-chatbot-wa');

  btn.onclick = () => { win.style.display = 'flex'; setTimeout(()=> input.focus(), 100); };
  close.onclick = () => win.style.display = 'none';

  let chatHistory = [];

  if (waBtn) {
    waBtn.onclick = () => {
      let text = "Hola, necesito hablar con un asesor.\\n\\n*--- Historial de IA ---*\\n";
      if (chatHistory.length > 0) {
        chatHistory.forEach(msg => {
          const roleName = msg.role === 'user' ? 'Cliente' : 'Bot';
          const cleanText = msg.text.split('*').join('');
          text += \`*\${roleName}:* \${cleanText}\\n\`;
        });
      } else {
        text += "(Sin mensajes previos)\\n";
      }
      window.open("https://wa.me/${client.whatsapp}?text=" + encodeURIComponent(text), "_blank");
    };
  }

  const knowledgeBase = \`${client.knowledgeBase.replace(/`/g, "'")}\`;

  async function callGemini(userText) {
    messagesDiv.innerHTML += \`<div class="msg msg-user">\${userText}</div>\`;
    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    const typingId = 'typing-' + Date.now();
    messagesDiv.innerHTML += \`<div id="\${typingId}" class="msg msg-bot" style="opacity:0.6; display:flex; gap:4px; align-items:center; padding:15px;">Escribiendo<span style="animation:pulse 1s infinite">...</span></div>\`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
      const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;
      const contents = chatHistory.map(msg => ({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }));
      contents.push({ role: 'user', parts: [{ text: userText }] });

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: { parts: [{ text: "Asistente de atención al cliente amable y directo. Responde SOLO con la información provista. Si no sabes, pide contactar a un asesor.\\n\\nINFO:\\n" + knowledgeBase }] }
        })
      });

      const data = await response.json();
      const botReply = data.candidates[0].content.parts[0].text;
      
      chatHistory.push({ role: 'user', text: userText }, { role: 'bot', text: botReply });
      document.getElementById(typingId).remove();
      messagesDiv.innerHTML += \`<div class="msg msg-bot">\${botReply.replace(/\\n/g, '<br>')}</div>\`;
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (err) {
      document.getElementById(typingId).innerHTML = "⚠️ Error de conexión con IA.";
    }
  }

  sendBtn.onclick = () => { if(input.value.trim()) callGemini(input.value.trim()); };
  input.onkeypress = (e) => { if(e.key === 'Enter' && input.value.trim()) callGemini(input.value.trim()); };
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600 shadow-sm"><Code className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Integración Web</h2>
              <p className="text-sm text-slate-500 font-medium">Copia y pega este código en la web de {client.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-8 overflow-y-auto flex-1 bg-white">
          <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl mb-6 flex gap-4 text-indigo-900 shadow-inner">
            <AlertCircle className="w-6 h-6 flex-shrink-0 text-indigo-600 mt-0.5" />
            <div className="text-sm leading-relaxed">
              <strong className="block mb-1 text-base">Último paso antes de lanzar 🚀</strong>
              Recuerda generar tu API Key gratuita en Google AI Studio y reemplazar <code className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-mono font-bold">TU_API_KEY_AQUI</code> en el código. ¡El diseño premium del widget ya viene incluido!
            </div>
          </div>

          <div className="relative group">
            <pre className="bg-[#0B1120] text-slate-300 p-6 rounded-2xl overflow-x-auto text-xs font-mono border border-slate-800 h-72 custom-scrollbar shadow-inner leading-relaxed">
              {embedCode}
            </pre>
            <button 
              onClick={handleCopy}
              className="absolute top-4 right-4 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-xl transition-all flex items-center gap-2 font-bold shadow-lg"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar Código'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SIMULADOR DE CHAT PREMIUM ---
function Simulator({ clients }) {
  const [selectedClient, setSelectedClient] = useState(clients[0] || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedClient) setMessages([{ role: 'bot', text: selectedClient.greeting }]);
  }, [selectedClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callGeminiAPI = async (userMsgText) => {
    const apiKey = ""; // Canvas provee dinamicamente
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const systemInstruction = `Eres un asistente virtual de atención al cliente para la empresa ${selectedClient.name}.
    Tu objetivo es responder de manera amable, profesional y concisa.
    
    REGLA DE ORO: Utiliza ÚNICAMENTE la siguiente información. Si preguntan algo fuera de este contexto, di que no tienes la info o pide contactar asesor. NO inventes.
    
    BASE DE CONOCIMIENTOS:
    ${selectedClient.knowledgeBase}`;

    const contents = messages.filter(m => m.role !== 'bot' || m.text !== selectedClient.greeting).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: userMsgText }] });

    let retries = 5, delayMs = 1000;
    while (retries > 0) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents, systemInstruction: { parts: [{ text: systemInstruction }] } })
        });
        if (!response.ok) throw new Error('API Error');
        const result = await response.json();
        return result.candidates[0].content.parts[0].text;
      } catch (err) {
        retries--;
        if (retries === 0) return "Lo siento, error de conexión. Intenta de nuevo.";
        await new Promise(r => setTimeout(r, delayMs)); delayMs *= 2;
      }
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedClient || isLoading) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsLoading(true);

    const botReply = await callGeminiAPI(userText);
    setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    setIsLoading(false);
  };

  if (clients.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F3F4F6]">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6">
          <Bot className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Simulador Inactivo</h2>
        <p className="text-slate-500 mt-3 max-w-md font-medium">Añade al menos un cliente en el panel para poder probar cómo interactúa la IA.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-10 bg-[#F3F4F6] relative z-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Entorno de Pruebas</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Simula la experiencia que tendrán los usuarios finales.</p>
        </div>
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 flex items-center">
          <select 
            className="bg-transparent border-none text-slate-700 font-bold px-4 py-2 outline-none focus:ring-0 cursor-pointer"
            value={selectedClient?.id || ''}
            onChange={(e) => setSelectedClient(clients.find(c => c.id === e.target.value))}
          >
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {selectedClient && (
        <div className="flex-1 bg-white border border-slate-200/80 rounded-[2rem] shadow-2xl flex flex-col max-w-sm mx-auto w-full overflow-hidden relative">
          
          {/* Header Chat */}
          <div className="p-5 flex items-center justify-between shadow-sm z-10" style={{ backgroundColor: selectedClient.primaryColor, color: 'white' }}>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm"><Bot className="w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-lg leading-tight tracking-wide">{selectedClient.name}</h3>
                <div className="text-xs opacity-90 flex items-center gap-1.5 mt-0.5 font-medium"><div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div> En línea</div>
              </div>
            </div>
            {selectedClient.whatsapp && (
              <button 
                onClick={() => {
                  let text = "Hola, necesito hablar con un asesor.\n\n*--- Historial del Asistente ---*\n";
                  messages.forEach(msg => {
                    const roleName = msg.role === 'user' ? 'Cliente' : 'Bot';
                    text += `*${roleName}:* ${msg.text.split('*').join('')}\n`;
                  });
                  window.open(`https://wa.me/${selectedClient.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
                }}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold py-2 px-3.5 rounded-xl transition flex items-center gap-1"
              >
                Asesor
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto bg-slate-50/50 flex flex-col gap-5 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'text-white rounded-br-sm' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'}
                `}
                style={msg.role === 'user' ? { backgroundColor: selectedClient.primaryColor } : {}}
                >
                  {msg.text.split('\n').map((line, idx) => <span key={idx}>{line}<br/></span>)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-3 z-10">
            <input 
              type="text"
              className="flex-1 bg-slate-100 border border-transparent focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 rounded-full px-5 py-3 outline-none transition-all text-sm"
              placeholder="Escribe un mensaje..." 
              value={input} onChange={e => setInput(e.target.value)} disabled={isLoading}
            />
            <button 
              type="submit" disabled={!input.trim() || isLoading}
              className="text-white w-12 h-12 rounded-full transition-all flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100"
              style={{ backgroundColor: selectedClient.primaryColor }}
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}