import React from 'react';
import { useAtomValue } from 'jotai';
import { activePageAtom } from '../../state/pageAtoms.js';
// --- CHANGE START ---
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaTiktok, FaYoutube } from 'react-icons/fa';
import { HiOutlineCalendar, HiOutlineMail } from 'react-icons/hi';
import { HiOutlineCash, HiOutlineClock, HiOutlineLockClosed } from 'react-icons/hi';
// --- CHANGE END ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const BlockPreview = ({ section }) => {
    const activePage = useAtomValue(activePageAtom);
    
    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        let videoId;
        if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
        else if (url.includes('watch?v=')) videoId = url.split('watch?v=')[1].split('&')[0];
        else return null;
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const renderContent = () => {
        const content = section.content || {};
        switch (section.section_type) {
            
            case 'header':
                const hasSocials = Object.values(content.social_links || {}).some(link => link);
                return (
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full">
                           {content.profileImageUrl && <img src={content.profileImageUrl} alt="profile" className="w-full h-full object-cover rounded-full" />}
                        </div>
                        <div>
                            <h4 className="font-semibold text-prym-dark-green">{activePage?.brand_name}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">{content.description || "No description yet."}</p>
                            {hasSocials && <div className="flex items-center space-x-3 mt-2 text-gray-400"><FaTwitter/><FaInstagram/><FaFacebook/></div>}
                        </div>
                    </div>
                );
            case 'links':
                const links = content.links || [];
                if (links.length === 0) return <p className="text-sm text-gray-500">No links added yet.</p>;
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {links.slice(0, 4).map((link, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-2 rounded-md truncate">
                                {link.imageUrl && <div className="w-8 h-8 bg-gray-200 rounded-md flex-shrink-0"><img src={link.imageUrl} alt={link.title} className="w-full h-full object-cover rounded-md" /></div>}
                                <span className="flex-grow truncate">{link.title || link.url}</span>
                            </div>
                        ))}
                        {links.length > 4 && <div className="text-xs text-gray-500 text-center sm:col-span-2">...and {links.length - 4} more</div>}
                    </div>
                );
            case 'carousel':
            case 'video_carousel':
                 const items = content.slides || content.videos || [];
                 if (items.length === 0) return <p className="text-sm text-gray-500">No items in this carousel yet.</p>;
                 return (
                    <div>
                        {content.title && <h4 className="font-semibold text-gray-800 mb-2">{content.title}</h4>}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {items.slice(0, 4).map((item, index) => (
                                <div key={index} className="aspect-square bg-gray-200 rounded-md">
                                    {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-md" />}
                                    {item.videoUrl && <div className="w-full h-full flex items-center justify-center text-prym-pink text-3xl bg-gray-800 rounded-md"><FaYoutube/></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                 );
            // --- CHANGE START ---
            case 'digital_product':
                return (
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-md">
                           {content.cover_image_url && <img src={content.cover_image_url} alt="product" className="w-full h-full object-cover rounded-md" />}
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-semibold text-prym-dark-green truncate">{content.title || 'Untitled Product'}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <HiOutlineCash />
                                <span>{parseFloat(content.price) > 0 ? `₦${content.price}` : 'Free'}</span>
                            </div>
                        </div>
                    </div>
                );
            case 'appointments':
                return (
                     <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-prym-green/10 rounded-md flex items-center justify-center">
                           <HiOutlineClock className="h-6 w-6 text-prym-green"/>
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-semibold text-prym-dark-green truncate">{content.title || 'Untitled Session'}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <HiOutlineCash />
                                <span>{parseFloat(content.price) > 0 ? `₦${content.price}` : 'Free'}</span>
                                <span className="text-gray-300">|</span>
                                <span>{content.duration || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                );
            case 'paywall':
                return (
                     <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-prym-pink/10 rounded-md flex items-center justify-center">
                           <HiOutlineLockClosed className="h-6 w-6 text-prym-pink"/>
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-semibold text-prym-dark-green truncate">{content.title || 'Untitled Gated Content'}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <HiOutlineCash />
                                <span>{parseFloat(content.price) > 0 ? `₦${content.price}` : 'Free'}</span>
                            </div>
                        </div>
                    </div>
                );
            case 'events':
                return (
                     <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-prym-green/10 rounded-md flex items-center justify-center">
                           <HiOutlineCalendar className="h-6 w-6 text-prym-green"/>
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-semibold text-prym-dark-green truncate">{content.title || 'Untitled Event'}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <HiOutlineCash />
                                <span>{parseFloat(content.price) > 0 ? `₦${content.price}` : 'Free'}</span>
                            </div>
                        </div>
                    </div>
                );
            case 'lead_capture':
                 return (
                     <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-prym-pink/10 rounded-md flex items-center justify-center">
                           <HiOutlineMail className="h-6 w-6 text-prym-pink"/>
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-semibold text-prym-dark-green truncate">{content.title || 'Untitled Lead Capture'}</h4>
                            <p className="text-sm text-gray-500">Button: "{content.button_text || 'Subscribe'}"</p>
                        </div>
                    </div>
                );
            default:
                return <p className="text-sm text-gray-500">No preview available for the <span className="font-semibold">{section.section_type.replace('_', ' ')}</span> block.</p>;
            // --- CHANGE END ---
        }
    };

    return <div className="py-4">{renderContent()}</div>;
};

export default BlockPreview;