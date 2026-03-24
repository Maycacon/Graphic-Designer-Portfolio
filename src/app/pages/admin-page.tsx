import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/app/components/ui/dialog";
import { videoProjects as fallbackVideos } from "@/app/lib/fallback-projects";
import { normalizeCategory, CANONICAL_CATEGORIES } from "@/app/lib/category-utils";
import { saveLocalProjects, loadLocalProjects } from "@/app/lib/local-projects";

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [filter, setFilter] = useState<string>('Todos');

  const initialVideos = useMemo(() => fallbackVideos, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch(`${API_BASE}/videos`);
      if (!response.ok) throw new Error("Falha ao carregar dados do servidor");
      const data = (await response.json()) as VideoItem[];
      // normalize and merge with local
      const normalized = data.map((p) => ({ ...p, category: normalizeCategory(p.category) }));
      const local = loadLocalProjects();
      const merged = [...normalized, ...local.filter((lp: any) => !normalized.some((n) => n.id === lp.id))];
      setVideos(merged);
    } catch {
      const local = loadLocalProjects();
      const merged = [...initialVideos, ...local.filter((lp: any) => !initialVideos.some((i) => i.id === lp.id))];
      setVideos(merged);
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

  // Upload helper: tries POST to API_BASE/upload and falls back to object URL
  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file) return null;
    setIsUploading(true);
    setUploadProgress(null);
    try {
      const fd = new FormData();
      fd.append('file', file);

      const resp = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: fd,
      });

      if (resp.ok) {
        const json = await resp.json();
        // expect { url: 'https://...' } or similar
        const url = (json && (json.url || json.path || json.file)) || null;
        setIsUploading(false);
        return url;
      }
    } catch (e) {
      // ignore and fallback
    }

    // Fallback: create blob URL for immediate preview (not persistent)
    const fallback = URL.createObjectURL(file);
    setIsUploading(false);
    return fallback;
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    const ADMIN_EMAIL = (import.meta as any).env?.VITE_ADMIN_EMAIL || '';
    const ADMIN_PASSWORD = (import.meta as any).env?.VITE_ADMIN_PASSWORD || '';

    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        return;
      }
      setLoginError("Credenciais inválidas. Tente novamente.");
      return;
    }

    // If admin env not set, refuse login and instruct to set env vars
    setLoginError('Variáveis de ambiente de admin não definidas. Configure VITE_ADMIN_EMAIL e VITE_ADMIN_PASSWORD.');
  };

  const handleCreateOrUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.description || !formData.image) {
      setErrorMsg("Preencha pelo menos título, categoria, descrição e imagem.");
      return;
    }

    setErrorMsg("");

    const normalizedCategory = normalizeCategory(formData.category);
    if (!CANONICAL_CATEGORIES.includes(normalizedCategory)) {
      setErrorMsg('Escolha uma categoria válida entre: ' + CANONICAL_CATEGORIES.join(', '));
      return;
    }
    const newVideo: VideoItem = {
      id: editingId ?? Date.now(),
      title: formData.title,
      category: normalizedCategory,
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
        try { saveLocalProjects(updated); } catch {};
      } else {
        const response = await fetch(`${API_BASE}/videos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newVideo),
        });
        if (!response.ok) throw new Error("Falha ao criar no servidor");
        const created = await response.json();
        const toAdd = (created as VideoItem) || newVideo;
        setVideos((prev) => {
          const next = [...prev, toAdd];
          try { saveLocalProjects(next); } catch {}
          return next;
        });
      }
    } catch {
      setErrorMsg("Erro de conexão com servidor: operação executada localmente.");
      if (editingId) {
        setVideos((prev) => {
          const next = prev.map((v) => (v.id === editingId ? newVideo : v));
          try { saveLocalProjects(next); } catch {}
          return next;
        });
      } else {
        setVideos((prev) => {
          const next = [...prev, newVideo];
          try { saveLocalProjects(next); } catch {}
          return next;
        });
      }
    } finally {
      resetForm();
      setIsCreateEditModalOpen(false);
    }
  };

  const handleDelete = async (id: number) => {
    setErrorMsg("");
    try {
      const response = await fetch(`${API_BASE}/videos/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Falha ao excluir no servidor");
      setVideos((prev) => prev.filter((video) => video.id !== id));
      try { saveLocalProjects(videos.filter((video) => video.id !== id)); } catch {}
    } catch {
      setErrorMsg("Erro ao excluir no servidor. Excluído localmente.");
      setVideos((prev) => {
        const next = prev.filter((video) => video.id !== id);
        try { saveLocalProjects(next); } catch {}
        return next;
      });
    }
  };

  const openVideoDetails = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsDetailsModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setEditingId(null);
    setIsCreateEditModalOpen(true);
  };

  const handleEdit = (video: VideoItem) => {
    setEditingId(video.id);
    setFormData({ ...video });
    setIsCreateEditModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedVideo) {
      await handleDelete(selectedVideo.id);
      setIsDeleteDialogOpen(false);
      setIsDetailsModalOpen(false);
      setSelectedVideo(null);
    }
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

        <section className="mb-8 p-6 bg-white/10 rounded-xl shadow-sm flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Gerenciar vídeos</h2>
          <div className="flex items-center gap-2">
            <button onClick={openCreateModal} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">Criar novo</button>
            <button onClick={fetchVideos} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">Atualizar lista</button>
          </div>
        </section>

        <section className="p-6 bg-white/10 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Vídeos cadastrados</h2>
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm">Filtrar por:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded px-3 py-2 text-black">
              <option value="Todos">Todos</option>
              <option value="Geral">Geral</option>
              <option value="Vídeos">Vídeos</option>
              <option value="Flyers">Flyers</option>
              <option value="Leds">Leds</option>
            </select>
            <button onClick={() => setFilter('Todos')} className="ml-2 text-sm underline">Limpar</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videos.filter(v => filter === 'Todos' || v.category === filter).map((video) => (
              <div
                key={video.id}
                className="bg-white/10 p-4 rounded-xl border border-white/10 cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => openVideoDetails(video)}
              >
                <div className="flex gap-3 items-start">
                  {video.image && (
                    <img src={video.image} alt={video.title} className="w-20 h-12 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{video.title}</p>
                    <p className="text-sm text-gray-300">{video.category}</p>
                    <p className="text-sm mt-1">{video.description}</p>
                    <p className="text-xs text-yellow-200 mt-2">{video.video ? "Com vídeo" : "Somente imagem"}</p>
                    {video.video && (
                      <div className="mt-2">
                        <video src={video.video} className="w-full max-h-28 object-contain rounded" muted />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {videos.length === 0 && <p className="text-gray-300">Nenhum vídeo encontrado.</p>}
          </div>
        </section>

        {/* Video Details Modal */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-2xl p-6">
            {selectedVideo && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedVideo.title}</DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                  <div className="flex gap-4 items-start">
                    {selectedVideo.image && (
                      <img src={selectedVideo.image} alt={selectedVideo.title} className="w-32 h-24 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 mb-1">Categoria: {selectedVideo.category}</p>
                      <p className="text-sm">{selectedVideo.description}</p>
                      {selectedVideo.video && (
                        <div className="mt-4">
                          <video src={selectedVideo.video} controls className="w-full max-h-48 object-contain rounded" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleEdit(selectedVideo);
                        setIsDetailsModalOpen(false);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setIsDeleteDialogOpen(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                    >
                      Excluir
                    </button>
                    <DialogClose>
                      <button className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded">Fechar</button>
                    </DialogClose>
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md p-6">
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
            </DialogHeader>
            <p className="mt-2 text-sm">Deseja realmente excluir "{selectedVideo?.title}"? Esta ação não pode ser desfeita.</p>
            <DialogFooter>
              <div className="flex gap-2">
                <button onClick={() => setIsDeleteDialogOpen(false)} className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded">Cancelar</button>
                <button onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">Excluir</button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create/Edit Modal */}
        <Dialog open={isCreateEditModalOpen} onOpenChange={setIsCreateEditModalOpen}>
          <DialogContent className="max-w-2xl p-6">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Editar vídeo' : 'Criar vídeo'}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input value={formData.title} onChange={(e) => setFormData((s) => ({ ...s, title: e.target.value }))} placeholder="Título" className="rounded px-3 py-2 text-black" required />
              <label className="sr-only">Categoria</label>
              <select value={formData.category || ''} onChange={(e) => setFormData((s) => ({ ...s, category: e.target.value }))} className="rounded px-3 py-2 text-black" required>
                <option value="">Selecione a categoria</option>
                {CANONICAL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div>
                <label className="block text-sm font-medium text-white mb-1">Imagem (URL ou arquivo)</label>
                <input value={formData.image || ''} onChange={(e) => setFormData((s) => ({ ...s, image: e.target.value }))} placeholder="URL da imagem" className="rounded px-3 py-2 text-black w-full mb-2" />
                <input type="file" accept="image/*" onChange={async (e) => {
                  const f = e.currentTarget.files?.[0];
                  if (!f) return;
                  const preview = URL.createObjectURL(f);
                  setFormData((s) => ({ ...s, image: preview }));
                  const uploaded = await uploadFile(f);
                  if (uploaded) setFormData((s) => ({ ...s, image: uploaded }));
                }} className="text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Vídeo (URL ou arquivo)</label>
                <input value={formData.video || ''} onChange={(e) => setFormData((s) => ({ ...s, video: e.target.value }))} placeholder="URL do vídeo (opcional)" className="rounded px-3 py-2 text-black w-full mb-2" />
                <input type="file" accept="video/*" onChange={async (e) => {
                  const f = e.currentTarget.files?.[0];
                  if (!f) return;
                  const preview = URL.createObjectURL(f);
                  setFormData((s) => ({ ...s, video: preview }));
                  const uploaded = await uploadFile(f);
                  if (uploaded) setFormData((s) => ({ ...s, video: uploaded }));
                }} className="text-sm" />
                {isUploading && <p className="text-sm text-yellow-200">Enviando arquivo...</p>}
              </div>

              <textarea value={formData.description} onChange={(e) => setFormData((s) => ({ ...s, description: e.target.value }))} placeholder="Descrição" className="md:col-span-2 rounded px-3 py-2 text-black" required />
              <div className="md:col-span-2 flex items-center gap-2 justify-end">
                <button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">{editingId ? "Salvar edição" : "Criar novo"}</button>
                <button type="button" onClick={() => { resetForm(); setIsCreateEditModalOpen(false); }} className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded">Cancelar</button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}

export default AdminPage;
