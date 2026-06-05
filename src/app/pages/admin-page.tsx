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
  const { uploading: isUploading, uploadImage, uploadVideo } = useSupabaseStorage();

  const [loginError, setLoginError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectType, setProjectType] = useState<ProjectType>("videos");
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

    if (
      !formData.title ||
      !formData.category ||
      !formData.description ||
      !formData.image_url
    ) {
      setErrorMsg("Preencha título, categoria, descrição e imagem.");
      return;
    }

    setErrorMsg("");

    const normalizedCategory = normalizeCategory(formData.category);
    if (!CANONICAL_CATEGORIES.includes(normalizedCategory)) {
      setErrorMsg(
        "Escolha uma categoria válida entre: " + CANONICAL_CATEGORIES.join(", ")
      );
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
        setProjects((prev) =>
          prev.map((p) => (p.id === editingId ? updated : p))
        );
      } else {
        const created = await createProject(projectData as any);
        setProjects((prev) => [created, ...prev]);
      }
      resetForm();
      setIsCreateEditModalOpen(false);
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : "Erro ao salvar projeto"
      );
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

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setProjectType(project.type);
    setFormData(project);
    setIsCreateEditModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProject) {
      await handleDelete(selectedProject.id);
      setIsDeleteDialogOpen(false);
      setIsDetailsModalOpen(false);
      setSelectedProject(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-b from-[#2d085e] to-[#1b0b43] text-white px-6 flex items-center justify-center">
        <p className="text-xl">Carregando autenticação...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-b from-[#2d085e] to-[#1b0b43] text-white px-6">
        <div className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-xl">
          <h1 className="text-3xl font-bold mb-4">Área Administrativa</h1>
          <p className="mb-4 text-yellow-200">Faça login com seu e-mail e senha Supabase</p>
          {loginError && (
            <p className="text-sm text-red-300 mb-3">{loginError}</p>
          )}
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="w-full rounded px-3 py-2 text-black"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Senha"
              className="w-full rounded px-3 py-2 text-black"
              required
            />
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-yellow-300 text-black rounded py-2 font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {authLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="mt-4 underline text-sm text-white/80"
          >
            Voltar para Início
          </button>
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
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Sair
            </button>
            <button
              onClick={() => onNavigate("home")}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              Voltar
            </button>
          </div>
        </div>

        {errorMsg && <p className="mb-4 text-red-300">{errorMsg}</p>}
        {loading && <p className="mb-4 text-yellow-200">Carregando projetos...</p>}

        <section className="mb-8 p-6 bg-white/10 rounded-xl shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-2xl font-semibold">Gerenciar Projetos</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={openCreateModal}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
              >
                Criar novo
              </button>
              <button
                onClick={() => loadProjects(filter)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Atualizar
              </button>
            </div>
          </div>
        </section>

        <section className="p-6 bg-white/10 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Projetos cadastrados</h2>
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm">Filtrar por tipo:</label>
            <select
              value={filter}
              onChange={(e) => {
                const type = e.target.value as ProjectType;
                setFilter(type);
                loadProjects(type);
              }}
              className="rounded px-3 py-2 text-black"
            >
              <option value="videos">Vídeos</option>
              <option value="leds">LEDs</option>
              <option value="flyers">Flyers</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white/10 p-4 rounded-xl border border-white/10 cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => openProjectDetails(project)}
              >
                <div className="flex gap-3 items-start">
                  {project.image_url && (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-20 h-12 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{project.title}</p>
                    <p className="text-xs text-purple-300 mb-1 uppercase">
                      {project.type}
                    </p>
                    <p className="text-sm text-gray-300">{project.category}</p>
                    <p className="text-sm mt-1 line-clamp-2">{project.description}</p>
                    {project.video_url && (
                      <p className="text-xs text-yellow-200 mt-2">✓ Com vídeo</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-gray-300 col-span-full">
                Nenhum projeto encontrado.
              </p>
            )}
          </div>
        </section>

        {/* Project Details Modal */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-2xl p-6">
            {selectedProject && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedProject.title}</DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                  <div className="flex gap-4 items-start">
                    {selectedProject.image_url && (
                      <img
                        src={selectedProject.image_url}
                        alt={selectedProject.title}
                        className="w-32 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-purple-300 mb-2 uppercase font-semibold">
                        {selectedProject.type}
                      </p>
                      <p className="text-sm text-gray-300 mb-1">
                        Categoria: {selectedProject.category}
                      </p>
                      <p className="text-sm">{selectedProject.description}</p>
                      {selectedProject.video_url && (
                        <div className="mt-4">
                          <video
                            src={selectedProject.video_url}
                            controls
                            className="w-full max-h-48 object-contain rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleEdit(selectedProject);
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
                      <button className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded">
                        Fechar
                      </button>
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
            <p className="mt-2 text-sm">
              Deseja realmente excluir "{selectedProject?.title}"? Esta ação não pode
              ser desfeita.
            </p>
            <DialogFooter>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Excluir
                </button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create/Edit Modal */}
        <Dialog open={isCreateEditModalOpen} onOpenChange={setIsCreateEditModalOpen}>
          <DialogContent className="max-w-2xl p-6">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar projeto' : 'Criar novo projeto'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1">
                  Tipo de Projeto
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as ProjectType)}
                  disabled={!!editingId}
                  className="rounded px-3 py-2 text-black w-full disabled:opacity-50"
                >
                  <option value="videos">Vídeos</option>
                  <option value="leds">LEDs</option>
                  <option value="flyers">Flyers</option>
                </select>
              </div>

              <input
                value={formData.title || ''}
                onChange={(e) => setFormData((s) => ({ ...s, title: e.target.value }))}
                placeholder="Título"
                className="rounded px-3 py-2 text-black"
                required
              />
              <label className="sr-only">Categoria</label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData((s) => ({ ...s, category: e.target.value }))}
                className="rounded px-3 py-2 text-black"
                required
              >
                <option value="">Selecione a categoria</option>
                {CANONICAL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1">
                  Imagem (arquivo)
                </label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    {formData.image_url && (
                      <img
                        src={formData.image_url}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded mb-2"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const f = e.currentTarget.files?.[0];
                        if (!f) return;
                        const preview = URL.createObjectURL(f);
                        setFormData((s) => ({ ...s, image_url: preview }));
                        const uploaded = await uploadFile(f, projectType);
                        if (uploaded)
                          setFormData((s) => ({ ...s, image_url: uploaded }));
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1">
                  Vídeo (arquivo - opcional)
                </label>
                {formData.video_url && (
                  <video
                    src={formData.video_url}
                    className="w-full max-h-32 object-contain rounded mb-2"
                    muted
                  />
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={async (e) => {
                    const f = e.currentTarget.files?.[0];
                    if (!f) return;
                    const preview = URL.createObjectURL(f);
                    setFormData((s) => ({ ...s, video_url: preview }));
                    setIsUploading(true);
                    const uploaded = await uploadFile(f, projectType);
                    setIsUploading(false);
                    if (uploaded)
                      setFormData((s) => ({ ...s, video_url: uploaded }));
                  }}
                  className="text-sm"
                />
                {isUploading && (
                  <p className="text-sm text-yellow-200 mt-2">Enviando arquivo...</p>
                )}
              </div>

              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData((s) => ({ ...s, description: e.target.value }))}
                placeholder="Descrição"
                className="md:col-span-2 rounded px-3 py-2 text-black"
                required
              />
              <div className="md:col-span-2 flex items-center gap-2 justify-end">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded disabled:opacity-50"
                  disabled={isUploading}
                >
                  {editingId ? "Salvar edição" : "Criar novo"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsCreateEditModalOpen(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
                >
                  Cancelar
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
