"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RegionFields, { type RegionValue } from "./regionFields";
import type { RegionKey } from "@/src/config/regions";

interface EditableProduct {
  id: string;
  name: string;
  description: string;
  platform: string;
  genre: string;
  regionPreset: RegionKey;
  includedCountries: string[];
  salePrice: number;
  originalPrice: number | null;
  image: string;
  gallery: string[];
  steamAppId: number | null;
  excludedCountries: string[];
  status: string;
  publishedOnEneba: boolean;
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

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-neon-pink";

const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-neon-gray";

export default function EditProductForm({
  product,
}: {
  product: EditableProduct;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    platform: product.platform,
    genre: product.genre,
    salePrice: String(product.salePrice),
    originalPrice: String(product.originalPrice ?? ""),
    image: product.image,
    gallery: product.gallery.join("\n"),
    steamAppId: String(product.steamAppId ?? ""),
    status: product.status,
  });

  const [region, setRegion] = useState<RegionValue>({
    regionPreset: product.regionPreset,
    includedCountries: product.includedCountries,
    excludedCountries: product.excludedCountries,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

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
      gallery: form.gallery
        .split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean),
      steamAppId: form.steamAppId ? Number(form.steamAppId) : null,
      status: form.status,
    };

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(`Invalid server response (HTTP ${response.status})`);
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not save product");
      }

      setSuccess("Product updated successfully!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-neon-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/products"
          className="mb-6 inline-block text-sm text-neon-gray transition hover:text-neon-pink"
        >
          ← Back to Products
        </Link>

        <header className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neon-pink">
            Inventory Management
          </p>

          <h1 className="font-gabarito text-3xl font-bold sm:text-4xl">
            Edit Product
          </h1>

          <p className="mt-2 text-sm text-neon-gray">
            Update game information, images and pricing.
          </p>
        </header>

        <form
          onSubmit={handleSave}
          className="rounded-2xl bg-neon-gradient p-[1.5px]"
        >
          <div className="space-y-7 rounded-2xl bg-zinc-950 p-5 sm:p-8">
            {product.publishedOnEneba && (
              <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
                This product is already published on Eneba. Editing is disabled
                until synchronization is implemented.
              </p>
            )}

            <section className="space-y-4">
              <h2 className="font-gabarito text-xl font-semibold">
                Game Information
              </h2>

              <div>
                <label className={labelClass}>Game Name</label>
                <input
                  required
                  className={fieldClass}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Platform</label>
                  <input
                    required
                    className={fieldClass}
                    value={form.platform}
                    onChange={(e) => update("platform", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Genre</label>
                  <select
                    className={fieldClass}
                    value={form.genre}
                    onChange={(e) => update("genre", e.target.value)}
                  >
                    {genres.map((genre) => (
                      <option key={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Steam AppID</label>
                  <input
                    type="number"
                    min="1"
                    className={fieldClass}
                    value={form.steamAppId}
                    onChange={(e) => update("steamAppId", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  rows={5}
                  className={fieldClass}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </div>
            </section>

            <section className="space-y-4 border-t border-white/10 pt-6">
              <h2 className="font-gabarito text-xl font-semibold">Pricing</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Sale Price (€)</label>
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    className={fieldClass}
                    value={form.salePrice}
                    onChange={(e) => update("salePrice", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Original Price (€)</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className={fieldClass}
                    value={form.originalPrice}
                    onChange={(e) => update("originalPrice", e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4 border-t border-white/10 pt-6">
              <h2 className="font-gabarito text-xl font-semibold">Images</h2>

              <div>
                <label className={labelClass}>Cover Image URL</label>
                <input
                  className={fieldClass}
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Gallery URLs (one per line)
                </label>
                <textarea
                  rows={5}
                  className={fieldClass}
                  value={form.gallery}
                  onChange={(e) => update("gallery", e.target.value)}
                />
              </div>

              {form.image.startsWith("https://") && (
                <div className="w-32 overflow-hidden rounded-xl border border-white/10">
                  {/* Preview de URL externa fornecida pelo admin */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.image}
                    alt="Game cover"
                    className="aspect-[2/3] w-full object-cover"
                  />
                </div>
              )}
            </section>

            <section className="space-y-4 border-t border-white/10 pt-6">
              <h2 className="font-gabarito text-xl font-semibold">
                Availability
              </h2>

              <RegionFields
                value={region}
                onChange={setRegion}
                inputClass={fieldClass}
                labelClass={labelClass}
              />

              <div>
                <label className={labelClass}>Product Status</label>
                <select
                  className={fieldClass}
                  value={form.status}
                  onChange={(e) => update("status", e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </section>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-500/10 p-4 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="rounded-xl bg-neon-green/10 p-4 text-sm text-neon-green"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || product.publishedOnEneba}
              className="w-full rounded-xl bg-neon-gradient px-5 py-3.5 font-gabarito font-bold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
