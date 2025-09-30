import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

const categories = [
    "Astronomía General",
    "Sistema Solar",
    "Estrellas",
    "Evolución Estelar",
    "Galaxias",
    "Estructura Cósmica",
    "Cosmología",
    "Astrobiología",
    "Exploración Espacial",
    "Astronomía Observacional",
    "Astrofísica"
];

const AsterForm = () => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [status, setStatus] = useState('draft');

    useEffect(() => {
        // Generar previsualización: prioridad archivo sobre URL
        if (coverImageFile) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(coverImageFile);
        } else if (coverImageUrl) {
            setPreviewImage(coverImageUrl);
        } else {
            setPreviewImage('');
        }
    }, [coverImageFile, coverImageUrl]);

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setCoverImageFile(e.target.files[0]);
            setCoverImageUrl('');
        }
    };

    const handleUrlChange = (e) => {
        setCoverImageUrl(e.target.value);
        setCoverImageFile(null);
    };

    const handleSubmit = (publishStatus) => (e) => {
        e.preventDefault();
        setStatus(publishStatus);
        console.log({ title, slug, content, category, coverImageFile, coverImageUrl, status: publishStatus });
        // Aquí enviarías los datos al backend
    };

    return (
        <div>
        <form style={{ backgroundColor: '#02060D' }} className="m-6 text-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Columna 1 */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Titulo</label>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Post title"
                        className="mt-1 block w-full rounded-md bg-gray-800 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Slug (auto)</label>
                    <input
                        type="text"
                        value={slug}
                        readOnly
                        className="mt-1 block w-full rounded-md bg-gray-800 p-2 text-gray-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Categoria</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full rounded-md bg-gray-800 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Cover Imagen</label>
                    <div className="mt-1 flex items-center gap-3">
                        <PhotoIcon className="h-10 w-10 text-gray-400" />
                        <label className="cursor-pointer bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700">
                            Subir Archivo
                            <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                        </label>
                    </div>
                    <div className="mt-2">
                        <input
                            type="url"
                            placeholder="O copia una URL aquí"
                            value={coverImageUrl}
                            onChange={handleUrlChange}
                            className="mt-1 block w-full rounded-md bg-gray-800 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="mt-4 w-full rounded-md object-cover max-h-64 border border-gray-700"
                        />
                    )}
                </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-4">
                <div className="col-span-full">
                    <label className="block text-sm font-medium">Contenido</label>
                    <textarea
                        rows={12}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content here..."
                        className="mt-1 block w-full rounded-md bg-gray-800 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="flex justify-end mt-4 col-span-full gap-3">
                    <button
                        type="button"
                        onClick={handleSubmit('draft')}
                        className="bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-500"
                    >
                        Borrador
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit('published')}
                        className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500"
                    >
                        Publicar
                    </button>
                </div>
            </div>
        </form>
        </div>
    );
}

export default AsterForm;