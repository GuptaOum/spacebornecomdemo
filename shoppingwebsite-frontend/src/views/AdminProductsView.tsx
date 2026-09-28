'use client';
import React, { useEffect, useState } from 'react';
import { AlertCircle, Boxes, CheckCircle2, ImagePlus, Loader2, Pencil, Plus, RefreshCw, Save, X } from 'lucide-react';
import { apiRequest } from '../lib/api';
import { AppView } from '../types';

type CatalogProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
  images: string[];
  isAvailable: boolean;
};

type ProductForm = {
  name: string;
  sku: string;
  category: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  isAvailable: boolean;
};

const emptyForm: ProductForm = {
  name: '', sku: '', category: 'Motors', description: '', price: '', stock: '', imageUrl: '', isAvailable: true,
};

const categories = ['Motors', 'Sensors', 'Controllers', 'Batteries', 'Structural', 'Accessories'];

interface AdminProductsViewProps {
  onNavigate: (view: AppView) => void;
  onCatalogChanged: () => Promise<void>;
}

export const AdminProductsView: React.FC<AdminProductsViewProps> = ({ onNavigate, onCatalogChanged }) => {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<{ products: CatalogProduct[] }>('/products/manage');
      setProducts(result.products);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadProducts(); }, []);

  const startEdit = (product: CatalogProduct) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.images?.[0] || '',
      isAvailable: product.isAvailable,
    });
    setMessage(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    const slug = form.name.trim().toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const payload = {
      name: form.name.trim(),
      slug,
      sku: form.sku.trim().toUpperCase(),
      category: form.category,
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.imageUrl.trim() ? [form.imageUrl.trim()] : [],
      specs: {},
      isAvailable: form.isAvailable,
    };

    try {
      await apiRequest<CatalogProduct>(editingId ? `/products/${editingId}` : '/products', {
        method: editingId ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      });
      setMessage(editingId ? 'Product updated.' : 'Product added to the catalog.');
      resetForm();
      setMessage(editingId ? 'Product updated.' : 'Product added to the catalog.');
      await Promise.all([loadProducts(), onCatalogChanged()]);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-2xl bg-[#192737] p-6 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">Store administration</p>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">Product management</h1>
            <p className="mt-1 text-sm text-slate-300">Add products and keep prices and stock current.</p>
          </div>
          <button onClick={() => onNavigate('catalog')} className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10">
            View storefront
          </button>
        </header>

        {(error || message) && (
          <div role={error ? 'alert' : 'status'} className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
            {error ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
            <span>{error || message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.5fr)]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                {editingId ? <Pencil className="h-5 w-5 text-orange-600" /> : <Plus className="h-5 w-5 text-orange-600" />}
                {editingId ? 'Edit product' : 'Add a product'}
              </h2>
              {editingId && <button type="button" onClick={resetForm} aria-label="Cancel editing" className="rounded-md p-1 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Product name
                <input required maxLength={160} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15" placeholder="12V DC gear motor" />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">SKU
                  <input required maxLength={40} value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value.toUpperCase() })} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm uppercase outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15" placeholder="MOT-12V-001" />
                </label>
                <label className="block text-sm font-medium text-slate-700">Category
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500">
                    {categories.map(category => <option key={category}>{category}</option>)}
                  </select>
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-700">Description
                <textarea required maxLength={3000} rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15" placeholder="Product details and key features" />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-medium text-slate-700">Price (INR)
                  <input type="number" required min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500" placeholder="365.00" />
                </label>
                <label className="block text-sm font-medium text-slate-700">Stock quantity
                  <input type="number" required min="0" step="1" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500" placeholder="25" />
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-700">Image URL <span className="font-normal text-slate-400">(optional)</span>
                <span className="relative mt-1.5 block">
                  <ImagePlus className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input type="url" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-orange-500" placeholder="https://example.com/product.jpg" />
                </span>
              </label>

              {editingId && (
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} className="h-4 w-4 accent-orange-600" />
                  Show this product in the storefront
                </label>
              )}

              <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#EF4F12] px-4 py-3 text-sm font-bold text-white hover:bg-[#d4430e] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}
              </button>
            </form>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 sm:px-6">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900"><Boxes className="h-5 w-5 text-orange-600" />Catalog</h2>
                <p className="mt-1 text-xs text-slate-500">{products.length} products</p>
              </div>
              <button onClick={() => void loadProducts()} disabled={loading} aria-label="Refresh products" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading products...</div>
            ) : products.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">No products yet. Add the first one with the form.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {products.map(product => (
                  <article key={product._id} className="flex items-center gap-3 p-4 sm:gap-4 sm:px-6">
                    {product.images?.[0] ? <img src={product.images[0]} alt="" className="h-14 w-14 shrink-0 rounded-lg border border-slate-100 bg-slate-50 object-contain p-1" /> : <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400"><Boxes className="h-6 w-6" /></div>}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-slate-900">{product.name}</h3>
                      <p className="mt-0.5 text-xs text-slate-500">{product.sku} Â· {product.category}</p>
                      <p className="mt-1 text-xs font-medium text-slate-700">₹{product.price.toLocaleString('en-IN')} Â· {product.stock} in stock Â· {product.isAvailable ? 'Active' : 'Hidden'}</p>
                    </div>
                    <button onClick={() => startEdit(product)} className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-orange-300 hover:text-orange-700"><Pencil className="h-3.5 w-3.5" /><span className="hidden sm:inline">Edit</span></button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
