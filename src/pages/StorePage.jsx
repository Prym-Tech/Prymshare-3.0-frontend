import { useState } from 'react';
import { useProducts } from '../hooks/useProducts.js';
import Spinner from '../components/ui/Spinner.jsx';
import { HiPlus } from 'react-icons/hi';
import AddProductModal from '../components/dashboard/store/AddProductModal.jsx';

const StorePage = () => {
    const { products, loading, setProducts } = useProducts();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="animate-faderrout">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-prym-dark-green">My Store</h1>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-prym-green text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-opacity-90 transition-colors"
                >
                    <HiPlus className="h-5 w-5" />
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                    <h3 className="font-semibold">Products</h3>
                </div>
                {loading ? (
                    <div className="p-8 text-center"><Spinner /></div>
                ) : products.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {products.map(product => (
                            <li key={product.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0">
                                        {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-md" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-prym-dark-green">{product.name}</p>
                                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">${product.price}</p>
                                    {/* Add Edit/Delete buttons here */}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="p-8 text-center text-gray-500">You haven't added any products yet.</p>
                )}
            </div>
            
            <AddProductModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                onProductAdded={(newProduct) => setProducts(current => [newProduct, ...current])}
            />
        </div>
    );
};

export default StorePage;
