import { FormEvent, useEffect, useMemo, useState } from "react";
import { videoProjects } from "./portfolio-videos";

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

type VideoItem = {
  id: number;
  title: string;
  category: string;
  description: string;
  video?: string;
  image: string;
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

export function AdminPage({ onNavigate }: AdminPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<VideoItem>>({
    title: "",
    category: "",
    description: "",
    video: "",
    image: "",
  });

  const initialVideos = useMemo(() => videoProjects, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch(`${API_BASE}/videos`);
      if (!response.ok) throw new Error("Falha ao carregar dados do servidor");
      const data = (await response.json()) as VideoItem[];
      setVideos(data);
    } catch {
      setVideos(initialVideos);
      setErrorMsg("Não foi possível conectar ao servidor. Usando dados locais.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchVideos();
    }
  }, [isAuthenticated]);

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", category: "", description: "", video: "", image: "" });
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (email === "admin@admin.com" && password === "admin123") {
      setIsAuthenticated(true);
      return;
    }

    setLoginError("Credenciais inválidas. Tente novamente.");
  };

  const handleCreateOrUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.description || !formData.image) {
      setErrorMsg("Preencha pelo menos título, categoria, descrição e imagem.");
      return;
    }

    setErrorMsg("");

    const newVideo: VideoItem = {
      id: editingId ?? Date.now(),
      title: formData.title,
      category: formData.category,
      description: formData.description,
      video: formData.video || "",
      image: formData.image,
    };

    try {
      if (editingId) {
        const response = await fetch(`${API_BASE}/videos/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newVideo),
        });
        if (!response.ok) throw new Error("Falha ao atualizar no servidor");
        const updated = videos.map((v) => (v.id === editingId ? newVideo : v));
        setVideos(updated);
      } else {
        const response = await fetch(`${API_BASE}/videos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newVideo),
        });
        if (!response.ok) throw new Error("Falha ao criar no servidor");
        const created = await response.json();
        setVideos((prev) => [...prev, (created as VideoItem) || newVideo]);
      }
    } catch {
      setErrorMsg("Erro de conexão com servidor: operação executada localmente.");
      if (editingId) {
        setVideos((prev) => prev.map((v) => (v.id === editingId ? newVideo : v)));
      } else {
        setVideos((prev) => [...prev, newVideo]);
      }
    } finally {
      resetForm();
    }
  };

  const handleDelete = async (id: number) => {
    setErrorMsg("");
    try {
      const response = await fetch(`${API_BASE}/videos/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao excluir no servidor");
      setVideos((prev) => prev.filter((video) => video.id !== id));
    } catch {
      setErrorMsg("Erro ao excluir no servidor. Excluído localmente.");
      setVideos((prev) => prev.filter((video) => video.id !== id));
    }
  };

  const handleEdit = (video: VideoItem) => {
    setEditingId(video.id);
    setFormData({ ...video });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-b from-[#2d085e] to-[#1b0b43] text-white px-6">
        <div className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold mb-4">Área Administrativa</h1>
          <p className="mb-4 text-yellow-200">Faça login com admin@admin.com / admin123</p>
          {loginError && <p className="text-sm text-red-300 mb-3">{loginError}</p>}
          <form onSubmit={handleLogin} className="space-y-3">
            <input name="email" type="email" placeholder="Email" className="w-full rounded px-3 py-2 text-black" required />
            <input name="password" type="password" placeholder="Senha" className="w-full rounded px-3 py-2 text-black" required />
            <button type="submit" className="w-full bg-yellow-300 text-black rounded py-2 font-semibold hover:bg-yellow-400 transition">Entrar</button>
          </form>
          <button type="button" onClick={() => onNavigate("home")} className="mt-4 underline text-sm text-white/80">Voltar para Início</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-[#1d0d38] text-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="space-x-2">
            <button onClick={() => setIsAuthenticated(false)} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Sair</button>
            <button onClick={() => onNavigate("home")} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">Voltar</button>
          </div>
        </div>

        {errorMsg && <p className="mb-4 text-red-300">{errorMsg}</p>}
        {isLoading && <p className="mb-4 text-yellow-200">Carregando vídeos...</p>}

        <section className="mb-8 p-6 bg-white/10 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Criar / Editar vídeo</h2>
          <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={formData.title} onChange={(e) => setFormData((s) => ({ ...s, title: e.target.value }))} placeholder="Título" className="rounded px-3 py-2 text-black" required />
            <input value={formData.category} onChange={(e) => setFormData((s) => ({ ...s, category: e.target.value }))} placeholder="Categoria" className="rounded px-3 py-2 text-black" required />
            <input value={formData.image} onChange={(e) => setFormData((s) => ({ ...s, image: e.target.value }))} placeholder="URL da imagem" className="rounded px-3 py-2 text-black" required />
            <input value={formData.video} onChange={(e) => setFormData((s) => ({ ...s, video: e.target.value }))} placeholder="URL do vídeo (opcional)" className="rounded px-3 py-2 text-black" />
            <textarea value={formData.description} onChange={(e) => setFormData((s) => ({ ...s, description: e.target.value }))} placeholder="Descrição" className="md:col-span-2 rounded px-3 py-2 text-black" required />
            <div className="md:col-span-2 flex items-center gap-2">
              <button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">{editingId ? "Salvar edição" : "Criar novo"}</button>
              {editingId && <button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded">Cancelar</button>}
            </div>
          </form>
        </section>

        <section className="p-6 bg-white/10 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Vídeos cadastrados</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div key={video.id} className="bg-white/10 p-4 rounded-xl border border-white/10">
                <p className="font-semibold">{video.title}</p>
                <p className="text-sm text-gray-300">{video.category}</p>
                <p className="text-sm mt-1">{video.description}</p>
                <p className="text-xs text-yellow-200 mt-2">{video.video ? "Com vídeo" : "Somente imagem"}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleEdit(video)} className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">Editar</button>
                  <button onClick={() => handleDelete(video.id)} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded">Excluir</button>
                </div>
              </div>
            ))}
            {videos.length === 0 && <p className="text-gray-300">Nenhum vídeo encontrado.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminPage;
