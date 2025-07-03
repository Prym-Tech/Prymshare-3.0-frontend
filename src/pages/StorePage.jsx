import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { activePageAtom } from '../state/pageAtoms.js';
import { useProducts } from '../hooks/useProducts.js';
import Spinner from '../components/ui/Spinner.jsx';
// --- CHANGE START ---
import { HiPlus, HiOutlineShoppingBag, HiPencil, HiTrash } from 'react-icons/hi';
import AddProductModal from '../components/dashboard/store/AddProductModal.jsx';
import EditProductModal from '../components/dashboard/store/EditProductModal.jsx';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal.jsx';
import { deleteProduct } from '../services/storefrontService.js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const StorePage = () => {
    const activePage = useAtomValue(activePageAtom);
    const { products, loading, setProducts } = useProducts(activePage?.id);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // --- CHANGE START ---
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const navigate = useNavigate();

    const handleAddProductClick = () => {
        if (!activePage.subaccount_code) {
            toast.error("Please set up your payment details first to add products.");
            navigate('/me/payments');
            return;
        }
        setIsAddModalOpen(true);
    };

    // --- CHANGE START ---
    const handleProductUpdated = (updatedProduct) => {
        setProducts(currentProducts => 
            currentProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        );
    };

    const handleConfirmDelete = async () => {
        if (!deletingProductId) return;

        setIsDeleteLoading(true);
        try {
            await deleteProduct(activePage.id, deletingProductId);
            setProducts(prev => prev.filter(p => p.id !== deletingProductId));
            toast.success("Product deleted!");
        } catch (error) {
            toast.error("Failed to delete product.");
        } finally {
            setIsDeleteLoading(false);
            setDeletingProductId(null);
        }
    };
    // --- CHANGE END ---

    return (
        <div className="animate-faderrout">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-prym-dark-green">My Store</h1>
                <button 
                    onClick={handleAddProductClick}
                    className="flex items-center gap-2 bg-prym-green text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
                    disabled={!activePage}
                >
                    <HiPlus className="h-5 w-5" />
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                    <h3 className="font-semibold text-prym-dark-green">Products</h3>
                </div>
                {loading ? (
                    <div className="p-8 text-center"><Spinner /></div>
                ) : products.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {products.map(product => (
                            <li key={product.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0">
                                        <img 
                                            src={product.image || `https://placehold.co/128x128/00D37F/FFFFFF?text=${product.name.charAt(0)}`} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover rounded-md" 
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-prym-dark-green">{product.name}</p>
                                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                                    </div>
                                </div>
                                {/* --- CHANGE START --- */}
                                <div className="flex items-center gap-4">
                                    <p className="font-semibold text-right w-20">₦{product.price}</p>
                                    <button onClick={() => setEditingProduct(product)} className="text-gray-400 hover:text-prym-pink"><HiPencil/></button>
                                    <button onClick={() => setDeletingProductId(product.id)} className="text-gray-400 hover:text-red-500"><HiTrash/></button>
                                </div>
                                {/* --- CHANGE END --- */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center p-12">
                        <div className="mx-auto bg-prym-green/10 rounded-full h-16 w-16 flex items-center justify-center">
                            <HiOutlineShoppingBag className="h-8 w-8 text-prym-green" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-prym-dark-green">Add your first product</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Start building your store by adding physical or digital products.
                        </p>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="mt-6 flex items-center gap-2 mx-auto bg-prym-green text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
                            disabled={!activePage}
                        >
                            <HiPlus className="h-5 w-5" />
                            Add Product
                        </button>
                    </div>
                )}
            </div>
            
            <AddProductModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                onProductAdded={(newProduct) => setProducts(current => [newProduct, ...current])}
            />

            {/* --- CHANGE START --- */}
            {editingProduct && (
                <EditProductModal
                    isOpen={editingProduct !== null}
                    onClose={() => setEditingProduct(null)}
                    product={editingProduct}
                    onProductUpdated={handleProductUpdated}
                />
            )}

            <ConfirmDeleteModal
                isOpen={deletingProductId !== null}
                onClose={() => setDeletingProductId(null)}
                onConfirm={handleConfirmDelete}
                loading={isDeleteLoading}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
            />
            {/* --- CHANGE END --- */}
        </div>
    );
};

export default StorePage;
