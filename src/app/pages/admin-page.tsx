import { FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/app/components/ui/dialog";
import { normalizeCategory, CANONICAL_CATEGORIES } from "@/app/lib/category-utils";
import { saveLocalProjects, loadLocalProjects } from "@/app/lib/local-projects";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";
import { useSupabaseProjects, ProjectType, Project } from "@/lib/useSupabaseProjects";
import { useSupabaseStorage } from "@/lib/useSupabaseStorage";

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  const { session, user, loading: authLoading, signIn, signOut } = useSupabaseAuth();
  const { loading, error: fetchError, fetchProjects, createProject, updateProject, deleteProject } = useSupabaseProjects();
  const { uploadImage, uploadVideo } = useSupabaseStorage();

  const [loginError, setLoginError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectType, setProjectType] = useState<ProjectType>("videos");
  const [isLocalUploading, setIsLocalUploading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    category: "",
    description: "",
    video_url: "",
    image_url: "",
    type: "videos",
  });
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [filter, setFilter] = useState<ProjectType>("videos");

  useEffect(() => {
    if (session?.user) {
      loadProjects("videos");
    }
  }, [session]);

  const loadProjects = async (type: ProjectType) => {
    try {
      const data = await fetchProjects(type);
      const normalized = data.map((p) => ({
        ...p,
        category: normalizeCategory(p.category),
      }));
      setProjects(normalized);
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Não foi possível conectar ao servidor.");
      const local = loadLocalProjects();
      if (Array.isArray(local)) {
        setProjects(local.filter((p: any) => p.type === type));
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      category: "",
      description: "",
      video_url: "",
      image_url: "",
      type: "videos",
    });
  };

  const uploadFile = async (file: File, type: ProjectType): Promise<string | null> => {
    if (!file) return null;
    try {
      if (type === "videos") {
        return await uploadVideo(file);
      } else {
        return await uploadImage(file);
      }
    } catch (e) {
      console.error("Upload error:", e);
      return null;
    }
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");

    const form = e.currentTarget as HTMLFormElement;
    const formDataObj = new FormData(form);
    const email = String(formDataObj.get("email") || "").trim();
    const password = String(formDataObj.get("password") || "").trim();

    try {
      const { session: newSession, error } = await signIn(email, password);
      if (error) throw error;
      if (newSession) {
        await loadProjects("videos");
      }
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Erro ao fazer login. Tente novamente."
      );
    }
  };

  const handleCreateOrUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.description || !formData.image_url) {
      setErrorMsg("Preencha título, categoria, descrição e imagem.");
      return;
    }

    setErrorMsg("");

    const normalizedCategory = normalizeCategory(formData.category);
    if (!CANONICAL_CATEGORIES.includes(normalizedCategory)) {
      setErrorMsg("Escolha uma categoria válida entre: " + CANONICAL_CATEGORIES.join(", "));
      return;
    }

    const projectData = {
      type: projectType,
      title: formData.title,
      category: normalizedCategory,
      description: formData.description,
      video_url: formData.video_url || undefined,
      image_url: formData.image_url,
    };

    try {
      if (editingId) {
        const updated = await updateProject(editingId, projectData);
        setProjects((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await createProject(projectData as any);
        setProjects((prev) => [created, ...prev]);
      }
      resetForm();
      setIsCreateEditModalOpen(false);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Erro ao salvar projeto");
    }
  };

  const handleDelete = async (id: string) => {
    setErrorMsg("");
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      setErrorMsg("Erro ao excluir projeto");
    }
  };

  const handleLogout = async () => {
    await signOut();
    setProjects([]);
    resetForm();
  };

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const openCreateModal = () => {
    resetForm();
    setProjectType('videos');
    setEditingId(null);
    setIsCreateEditModalOpen(true);
  };

  const handleEdit = (project: Project, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingId(project.id);
    setProjectType(project.type);
    setFormData(project);
    setIsCreateEditModalOpen(true);
  };

  const handleDeleteClick = (project: Project, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProject) {
      await handleDelete(selectedProject.id);
      setIsDeleteDialogOpen(false);
      setIsDetailsModalOpen(false);
      setSelectedProject(null);
    }
  };

  // --- COMPONENTES DE UI REUTILIZÁVEIS ---
  const inputClassName = "w-full rounded-lg px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all";

  if (authLoading) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-b from-[#2d085e] to-[#1b0b43] text-white px-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-white/80">Carregando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2d085e] to-[#1b0b43] text-white px-6">
        <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-2">Painel Admin</h1>
          <p className="mb-6 text-yellow-200/80">Gerencie seu portfólio de projetos</p>
          
          {loginError && (
            <div className="p-3 mb-4 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-200">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                name="email"
                type="email"
                placeholder="Seu e-mail"
                className={inputClassName}
                required
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                placeholder="Sua senha"
                className={inputClassName}
                required
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-yellow-400 text-[#1d0d38] rounded-lg py-3 font-bold hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)] disabled:opacity-50 mt-2"
            >
              {authLoading ? "Entrando..." : "Acessar Painel"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              ← Voltar para o site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 pt-24 bg-[#1d0d38] text-white px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-white/60 text-sm mt-1">Gerencie os projetos do seu portfólio</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate("home")}
              className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Ver Site
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 md:flex-none bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Sair
            </button>
          </div>
        </header>

        {errorMsg && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg("")} className="text-red-300 hover:text-white">✕</button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-sm font-medium text-white/60 whitespace-nowrap">Filtrar por:</label>
            <select
              value={filter}
              onChange={(e) => {
                const type = e.target.value as ProjectType;
                setFilter(type);
                loadProjects(type);
              }}
              className="bg-[#2d085e] border border-white/10 text-white text-sm rounded-lg focus:ring-yellow-400 focus:border-yellow-400 block w-full p-2.5"
            >
              <option value="videos">Vídeos</option>
              <option value="leds">LEDs</option>
              <option value="flyers">Flyers</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => loadProjects(filter)}
              className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
            >
              Atualizar Lista
            </button>
            <button
              onClick={openCreateModal}
              className="flex-1 md:flex-none bg-yellow-400 hover:bg-yellow-300 text-[#1d0d38] px-5 py-2.5 rounded-lg font-bold transition-colors shadow-lg shadow-yellow-400/20 text-sm"
            >
              + Novo Projeto
            </button>
          </div>
        </div>

        {/* Grid de Projetos */}
        <section>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5 border-dashed">
              <p className="text-white/60 mb-4">Nenhum projeto encontrado nesta categoria.</p>
              <button onClick={openCreateModal} className="text-yellow-400 hover:underline font-medium">
                Criar o primeiro projeto
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer flex flex-col h-full"
                  onClick={() => openProjectDetails(project)}
                >
                  {/* Thumbnail Cover */}
                  <div className="relative h-40 bg-[#15072b] w-full overflow-hidden">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">Sem imagem</div>
                    )}
                    <div className="absolute top-2 left-2 bg-[#1d0d38]/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold uppercase border border-white/10 text-yellow-300">
                      {project.type}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{project.title}</h3>
                    <span className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded-full self-start mb-3">
                      {project.category}
                    </span>
                    <p className="text-sm text-white/70 line-clamp-2 mb-4 flex-grow">{project.description}</p>
                    
                    {/* Quick Actions (Visíveis no hover ou sempre em mobile) */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                      <span className="text-xs text-yellow-200/80">
                        {project.video_url ? "▶ Possui Vídeo" : "Visualizar"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleEdit(project, e)}
                          className="p-1.5 text-white/60 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(project, e)}
                          className="p-1.5 text-white/60 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          title="Excluir"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal de Detalhes */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-2xl bg-[#1d0d38] border-white/10 text-white p-0 overflow-hidden">
            {selectedProject && (
              <>
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="text-2xl font-bold">{selectedProject.title}</DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6">
                  {selectedProject.image_url && (
                    <img
                      src={selectedProject.image_url}
                      alt={selectedProject.title}
                      className="w-full h-64 object-cover rounded-xl border border-white/10"
                    />
                  )}
                  
                  <div>
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                        {selectedProject.type}
                      </span>
                      <span className="text-xs bg-white/10 text-white/80 px-3 py-1 rounded-full">
                        {selectedProject.category}
                      </span>
                    </div>
                    <p className="text-white/80 leading-relaxed text-base">
                      {selectedProject.description}
                    </p>
                  </div>

                  {selectedProject.video_url && (
                    <div className="mt-6 rounded-xl overflow-hidden border border-white/10 bg-black/50 p-2">
                      <p className="text-xs text-white/50 mb-2 uppercase font-semibold">Mídia em Vídeo</p>
                      <video
                        src={selectedProject.video_url}
                        controls
                        className="w-full max-h-72 object-contain rounded-lg bg-black"
                      />
                    </div>
                  )}
                </div>

                <DialogFooter className="p-6 pt-0 flex gap-3 border-t border-white/10 mt-4 bg-white/5">
                  <button
                    onClick={() => { setIsDetailsModalOpen(false); handleEdit(selectedProject); }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Excluir
                  </button>
                  <DialogClose asChild>
                    <button className="flex-1 bg-transparent hover:bg-white/5 text-white/60 px-4 py-2.5 rounded-lg transition-colors">
                      Fechar
                    </button>
                  </DialogClose>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md bg-[#1d0d38] border-red-500/30 text-white p-6">
            <DialogHeader>
              <DialogTitle className="text-red-400 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                Confirmar Exclusão
              </DialogTitle>
            </DialogHeader>
            <p className="mt-4 text-white/80 leading-relaxed">
              Você está prestes a excluir o projeto <strong className="text-white">"{selectedProject?.title}"</strong>. Esta ação é irreversível.
            </p>
            <DialogFooter className="mt-6 flex gap-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-bold transition-colors shadow-lg shadow-red-500/20"
              >
                Sim, Excluir
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Criação / Edição */}
        <Dialog open={isCreateEditModalOpen} onOpenChange={setIsCreateEditModalOpen}>
          <DialogContent className="max-w-3xl bg-[#1d0d38] border-white/10 text-white p-6 md:p-8 overflow-y-auto max-h-[90vh]">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-yellow-300">
                {editingId ? 'Editar Projeto' : 'Novo Projeto'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateOrUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Lado Esquerdo - Info Básica */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Título do Projeto *</label>
                    <input
                      value={formData.title || ''}
                      onChange={(e) => setFormData((s) => ({ ...s, title: e.target.value }))}
                      placeholder="Ex: Identidade Visual XYZ"
                      className={inputClassName}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Tipo *</label>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value as ProjectType)}
                        disabled={!!editingId}
                        className={`${inputClassName} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="videos">Vídeos</option>
                        <option value="leds">LEDs</option>
                        <option value="flyers">Flyers</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Categoria *</label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => setFormData((s) => ({ ...s, category: e.target.value }))}
                        className={inputClassName}
                        required
                      >
                        <option value="" disabled>Selecione...</option>
                        {CANONICAL_CATEGORIES.map((c) => (
                          <option key={c} value={c} className="text-black">{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1.5">Descrição *</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData((s) => ({ ...s, description: e.target.value }))}
                      placeholder="Conte sobre o processo de criação..."
                      className={`${inputClassName} min-h-[120px] resize-y`}
                      required
                    />
                  </div>
                </div>

                {/* Lado Direito - Mídias */}
                <div className="space-y-6 bg-white/5 p-5 rounded-xl border border-white/5">
                  
                  {/* Imagem */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Imagem de Capa (Obrigatório) *
                    </label>
                    <div className="flex flex-col gap-3">
                      {formData.image_url ? (
                        <div className="relative group rounded-lg overflow-hidden border border-white/10">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-full h-40 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-sm font-medium">Trocar Imagem</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const f = e.currentTarget.files?.[0];
                              if (!f) return;
                              const preview = URL.createObjectURL(f);
                              setFormData((s) => ({ ...s, image_url: preview }));
                              setIsLocalUploading(true);
                              const uploaded = await uploadFile(f, projectType);
                              setIsLocalUploading(false);
                              if (uploaded) setFormData((s) => ({ ...s, image_url: uploaded }));
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-40 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center hover:border-yellow-400/50 hover:bg-white/5 transition-colors cursor-pointer text-white/50">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                          <span className="text-sm">Clique para upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const f = e.currentTarget.files?.[0];
                              if (!f) return;
                              const preview = URL.createObjectURL(f);
                              setFormData((s) => ({ ...s, image_url: preview }));
                              setIsLocalUploading(true);
                              const uploaded = await uploadFile(f, projectType);
                              setIsLocalUploading(false);
                              if (uploaded) setFormData((s) => ({ ...s, image_url: uploaded }));
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vídeo */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Vídeo (Opcional)
                    </label>
                    <div className="flex flex-col gap-3">
                      {formData.video_url ? (
                        <div className="relative group rounded-lg overflow-hidden border border-white/10 bg-black">
                          <video
                            src={formData.video_url}
                            className="w-full h-32 object-contain"
                            muted
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                            <span className="text-sm font-medium mb-2">Trocar Vídeo</span>
                            <button
                               type="button"
                               onClick={(e) => {
                                 e.preventDefault();
                                 setFormData(s => ({ ...s, video_url: "" }));
                               }}
                               className="text-xs bg-red-500/80 px-2 py-1 rounded"
                            >
                              Remover Atual
                            </button>
                          </div>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={async (e) => {
                              const f = e.currentTarget.files?.[0];
                              if (!f) return;
                              const preview = URL.createObjectURL(f);
                              setFormData((s) => ({ ...s, video_url: preview }));
                              setIsLocalUploading(true);
                              const uploaded = await uploadFile(f, projectType);
                              setIsLocalUploading(false);
                              if (uploaded) setFormData((s) => ({ ...s, video_url: uploaded }));
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-24 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center hover:border-yellow-400/50 hover:bg-white/5 transition-colors cursor-pointer text-white/50">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                          <span className="text-sm">Upload de vídeo MP4/WebM</span>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={async (e) => {
                              const f = e.currentTarget.files?.[0];
                              if (!f) return;
                              const preview = URL.createObjectURL(f);
                              setFormData((s) => ({ ...s, video_url: preview }));
                              setIsLocalUploading(true);
                              const uploaded = await uploadFile(f, projectType);
                              setIsLocalUploading(false);
                              if (uploaded) setFormData((s) => ({ ...s, video_url: uploaded }));
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                      
                      {isLocalUploading && (
                        <div className="flex items-center gap-2 text-sm text-yellow-300">
                          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Enviando arquivo para o servidor...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Ações do Formulário */}
              <div className="flex items-center gap-3 pt-6 border-t border-white/10 mt-6">
                <button
                  type="button"
                  onClick={() => { resetForm(); setIsCreateEditModalOpen(false); }}
                  className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLocalUploading}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-[#1d0d38] px-6 py-3 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(250,204,21,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLocalUploading ? "Aguarde o Upload..." : editingId ? "Salvar Alterações" : "Publicar Projeto"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}

export default AdminPage;
