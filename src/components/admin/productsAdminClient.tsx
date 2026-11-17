"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RegionFields, { emptyRegion, type RegionValue } from "./regionFields";
import { regionLabel } from "@/src/config/regions";

type AdminProduct = {
  id: string;
  name: string;
  image: string;
  platform: string;
  price: number;
  status: string;
  stock: number;
};

interface Props {
  products: AdminProduct[];
}

const genres = [
  "Action",
  "Adventure",
  "RPG",
  "Racing",
  "Simulation",
  "Sports",
  "Strategy",
  "Other",
];

const emptyForm = {
  name: "",
  description: "",
  platform: "Steam",
  genre: "Action",
  salePrice: "",
  originalPrice: "",
  image: "",
  gallery: "",
  steamAppId: "",
  keys: "",
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-neon-white outline-none transition-colors focus:border-neon-pink/70";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-neon-gray";

function lines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function euro(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export default function ProductsAdminClient({ products }: Props) {
  const router = useRouter();

  const [mode, setMode] = useState<"create" | "restock">("create");
  const [form, setForm] = useState(emptyForm);
  const [region, setRegion] = useState<RegionValue>(emptyRegion);

  const [selectedId, setSelectedId] = useState(products[0]?.id ?? "");

  const [restockKeys, setRestockKeys] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);

  const activeProducts = products.filter(
    (product) => product.status === "active",
  ).length;

  const newKeysCount = lines(form.keys).length;

  const restockCount = lines(restockKeys).length;

  const currentSelectedId = products.some(
    (product) => product.id === selectedId,
  )
    ? selectedId
    : (products[0]?.id ?? "");

  function updateForm(field: keyof typeof emptyForm, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError(false);

    const payload = {
      name: form.name,
      description: form.description,
      platform: form.platform,
      genre: form.genre,
      ...region,

      salePrice: Number(form.salePrice.replace(",", ".")),

      originalPrice: form.originalPrice
        ? Number(form.originalPrice.replace(",", "."))
        : null,

      image: form.image.trim(),
      gallery: lines(form.gallery),

      steamAppId: form.steamAppId ? Number(form.steamAppId) : null,

      keys: lines(form.keys),
    };

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Erro ao cadastrar produto");
      }

      setMessage(
        `Produto cadastrado! ${result.keysSaved} chave(s) adicionada(s).`,
      );

      setForm(emptyForm);
      setRegion(emptyRegion);
      router.refresh();
    } catch (err) {
      setError(true);

      setMessage(err instanceof Error ? err.message : "Erro inesperado");

      // Atualiza também em caso de cadastro parcial.
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleRestock(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!currentSelectedId) return;

    setLoading(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch(
        `/api/admin/products/${currentSelectedId}/keys`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keys: lines(restockKeys),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Erro ao adicionar chaves");
      }

      setMessage(`${result.added} chave(s) adicionada(s) ao estoque!`);

      setRestockKeys("");
      router.refresh();
    } catch (err) {
      setError(true);
      setMessage(err instanceof Error ? err.message : "Erro inesperado");

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-8 lg:flex-row lg:py-12">
      {/* Sidebar */}
      <aside className="w-full shrink-0 lg:w-52">
        <div className="mb-10">
          <Link
            href="/"
            className="font-gabarito text-2xl font-bold tracking-tight"
          >
            NEON{" "}
            <span className="bg-neon-gradient bg-clip-text text-transparent">
              KEYS
            </span>
          </Link>

          <p className="mt-1 text-xs tracking-widest text-neon-gray uppercase">
            Administration
          </p>
        </div>

        <nav className="flex flex-wrap gap-2 lg:flex-col">
          <Link
            href="/admin/products"
            className="rounded-xl bg-neon-gradient p-[1.5px]"
          >
            <span className="block rounded-[11px] bg-black px-4 py-3 text-sm font-semibold text-neon-white">
              Products & Inventory
            </span>
          </Link>

          <Link
            href="/shop"
            className="rounded-xl border border-white/10 px-4 py-3 text-sm text-neon-gray transition hover:border-neon-pink/40 hover:text-white"
          >
            Back to Shop
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <section className="min-w-0 flex-1">
        <header className="mb-8">
          <p className="mb-2 text-xs font-bold tracking-[0.2em] text-neon-pink uppercase">
            Inventory Management
          </p>

          <h1 className="font-gabarito text-3xl font-bold text-white sm:text-4xl">
            Product Dashboard
          </h1>

          <p className="mt-2 text-sm text-neon-gray">
            Manage your games, prices, images and activation keys.
          </p>
        </header>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { label: "Total games", value: products.length },
            { label: "Active games", value: activeProducts },
            { label: "Available keys", value: totalStock },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-neon-gradient p-px">
              <div className="h-full rounded-2xl bg-zinc-950 p-4 sm:p-5">
                <p className="text-xs text-neon-gray">{stat.label}</p>

                <p className="mt-2 font-gabarito text-3xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_270px]">
          {/* Form */}
          <div className="min-w-0 rounded-2xl bg-neon-gradient p-[1.5px]">
            <div className="h-full rounded-2xl bg-zinc-950 p-5 sm:p-7">
              {/* Tabs */}
              <div className="mb-7 flex gap-2 border-b border-white/10 pb-4">
                <button
                  type="button"
                  onClick={() => {
                    setMode("create");
                    setMessage("");
                  }}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    mode === "create"
                      ? "bg-neon-gradient text-white"
                      : "bg-black text-neon-gray hover:text-white"
                  }`}
                >
                  New Product
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("restock");
                    setMessage("");
                  }}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    mode === "restock"
                      ? "bg-neon-gradient text-white"
                      : "bg-black text-neon-gray hover:text-white"
                  }`}
                >
                  Add Keys
                </button>
              </div>

              {mode === "create" ? (
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <h2 className="font-gabarito text-xl font-semibold text-white">
                      Game Information
                    </h2>

                    <p className="mt-1 text-xs text-neon-gray">
                      General information about your game.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Game Name *</label>

                    <input
                      required
                      className={inputClass}
                      placeholder="Elden Ring"
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Platform *</label>

                      <input
                        required
                        className={inputClass}
                        placeholder="Steam"
                        value={form.platform}
                        onChange={(e) => updateForm("platform", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Genre *</label>

                      <select
                        className={inputClass}
                        value={form.genre}
                        onChange={(e) => updateForm("genre", e.target.value)}
                      >
                        {genres.map((genre) => (
                          <option key={genre} value={genre}>
                            {genre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Steam AppID</label>

                      <input
                        type="number"
                        min="1"
                        className={inputClass}
                        placeholder="1245620"
                        value={form.steamAppId}
                        onChange={(e) =>
                          updateForm("steamAppId", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Description</label>

                    <textarea
                      rows={4}
                      className={inputClass}
                      placeholder="Describe the game..."
                      value={form.description}
                      onChange={(e) =>
                        updateForm("description", e.target.value)
                      }
                    />
                  </div>

                  {/* Pricing */}
                  <div className="border-t border-white/10 pt-6">
                    <h2 className="mb-5 font-gabarito text-xl font-semibold">
                      Pricing
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Sale Price (€) *</label>

                        <input
                          required
                          type="number"
                          step="0.01"
                          min="0.01"
                          className={inputClass}
                          placeholder="39.99"
                          value={form.salePrice}
                          onChange={(e) =>
                            updateForm("salePrice", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Original Price (€)</label>

                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          className={inputClass}
                          placeholder="59.99"
                          value={form.originalPrice}
                          onChange={(e) =>
                            updateForm("originalPrice", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="border-t border-white/10 pt-6">
                    <h2 className="mb-5 font-gabarito text-xl font-semibold">
                      Game Images
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Cover Image URL</label>

                        <input
                          type="url"
                          className={inputClass}
                          placeholder="https://..."
                          value={form.image}
                          onChange={(e) => updateForm("image", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Gallery URLs</label>

                        <textarea
                          rows={4}
                          className={inputClass}
                          placeholder={
                            "https://.../screenshot1.jpg\nhttps://.../screenshot2.jpg"
                          }
                          value={form.gallery}
                          onChange={(e) =>
                            updateForm("gallery", e.target.value)
                          }
                        />

                        <p className="mt-2 text-xs text-neon-gray">
                          One image URL per line. Maximum 8 images.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Region restrictions */}
                  <div className="border-t border-white/10 pt-6">
                    <h2 className="mb-5 font-gabarito text-xl font-semibold">
                      Region Restrictions
                    </h2>

                    <RegionFields
                      value={region}
                      onChange={setRegion}
                      inputClass={inputClass}
                      labelClass={labelClass}
                    />
                  </div>

                  {/* Keys */}
                  <div className="border-t border-white/10 pt-6">
                    <div className="mb-5 flex items-center justify-between gap-2">
                      <h2 className="font-gabarito text-xl font-semibold">
                        Activation Keys
                      </h2>

                      <span className="rounded-lg bg-neon-green/10 px-3 py-1 text-xs font-semibold text-neon-green">
                        {newKeysCount} keys
                      </span>
                    </div>

                    <textarea
                      rows={6}
                      className={`${inputClass} font-mono`}
                      placeholder={"XXXXX-XXXXX-XXXXX\nYYYYY-YYYYY-YYYYY"}
                      value={form.keys}
                      onChange={(e) => updateForm("keys", e.target.value)}
                    />

                    <p className="mt-2 text-xs leading-relaxed text-neon-gray">
                      Enter one activation key per line. Keys are encrypted
                      before being stored. Without keys, the product will remain
                      inactive.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-neon-gradient px-5 py-3.5 font-gabarito font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Create Product"}
                  </button>
                </form>
              ) : (
                /* Restock */
                <form onSubmit={handleRestock} className="space-y-6">
                  <div>
                    <h2 className="font-gabarito text-xl font-semibold">
                      Restock Product
                    </h2>

                    <p className="mt-1 text-sm text-neon-gray">
                      Add new activation keys to an existing game.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Select Product</label>

                    <select
                      className={inputClass}
                      value={currentSelectedId}
                      onChange={(e) => setSelectedId(e.target.value)}
                    >
                      {products.length === 0 && (
                        <option value="">No products registered</option>
                      )}

                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} — {product.stock} available
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className={labelClass}>New Activation Keys</label>

                      <span className="text-xs text-neon-green">
                        {restockCount} keys
                      </span>
                    </div>

                    <textarea
                      required
                      rows={9}
                      className={`${inputClass} font-mono`}
                      placeholder={"XXXXX-XXXXX-XXXXX\nYYYYY-YYYYY-YYYYY"}
                      value={restockKeys}
                      onChange={(e) => setRestockKeys(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      loading || !currentSelectedId || restockCount === 0
                    }
                    className="w-full rounded-xl bg-neon-gradient px-5 py-3.5 font-gabarito font-bold text-white transition hover:brightness-110 disabled:opacity-50"
                  >
                    {loading ? "Adding keys..." : "Add to Inventory"}
                  </button>
                </form>
              )}

              {/* Feedback */}
              {message && (
                <div
                  role="status"
                  className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                    error
                      ? "border-red-500/30 bg-red-500/10 text-red-300"
                      : "border-neon-green/30 bg-neon-green/10 text-neon-green"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <aside className="space-y-5">
            {mode === "create" && (
              <div className="rounded-2xl bg-neon-gradient p-px">
                <div className="rounded-2xl bg-zinc-950 p-4">
                  <h3 className="mb-4 font-gabarito text-lg font-semibold">
                    Live Preview
                  </h3>

                  <div className="mx-auto max-w-[180px]">
                    <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-black">
                      {form.image.startsWith("https://") ? (
                        // Pré-visualização externa sem proxy de imagens.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={form.image}
                          src={form.image}
                          alt="Game cover preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-4 text-center text-xs text-neon-gray">
                          Cover Preview
                        </div>
                      )}
                    </div>

                    <h4 className="mt-3 line-clamp-2 text-sm font-semibold text-white">
                      {form.name || "Game title"}
                    </h4>

                    <p className="mt-1 text-xs text-neon-gray">
                      {form.platform} • {regionLabel(region)}
                    </p>

                    <p className="mt-2 font-gabarito text-xl font-bold text-neon-green">
                      {Number(form.salePrice) > 0
                        ? euro(Number(form.salePrice))
                        : "€0.00"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-gabarito text-lg font-semibold">
                  Your Games
                </h3>

                <span className="text-xs text-neon-gray">
                  {products.length} total
                </span>
              </div>

              {products.length === 0 ? (
                <p className="text-sm text-neon-gray">
                  No games registered yet.
                </p>
              ) : (
                <div className="max-h-[500px] space-y-3 overflow-y-auto">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-xl border border-white/10 bg-black p-3"
                    >
                      <p className="line-clamp-2 text-sm font-semibold text-white">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-neon-gray">
                        {product.platform} · {euro(product.price)}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-medium ${
                            product.stock > 0
                              ? "text-neon-green"
                              : "text-red-400"
                          }`}
                        >
                          {product.stock} available
                        </span>

                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-xs font-semibold text-neon-green hover:underline"
                          >
                            Edit
                          </Link>

                          <Link
                            href={`/product/${product.id}`}
                            className="text-xs text-neon-pink hover:underline"
                          >
                            View
                          </Link>
                        </div>
                      </div>

                      {product.status !== "active" && (
                        <p className="mt-2 text-xs text-amber-400">Inactive</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
