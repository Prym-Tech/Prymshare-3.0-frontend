import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { pageSectionsAtom, activePageAtom } from '../../state/pageAtoms.js';
import { useProducts } from '../../hooks/useProducts.js';
import { templates } from '../../lib/templates.js';
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaTiktok, FaYoutube } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const MobilePreview = () => {
    const sections = useAtomValue(pageSectionsAtom);
    const activePage = useAtomValue(activePageAtom);
    const [activePreviewTab, setActivePreviewTab] = useState('page');
    const { products } = useProducts(activePage?.id);

    const theme = activePage ? { ...templates.default.styles, ...(templates[activePage.theme_settings.template]?.styles || {}), ...activePage.theme_settings } : templates.default.styles;

    useEffect(() => {
        if (activePage?.display_mode === 'store_only') {
            setActivePreviewTab('store');
        } else {
            setActivePreviewTab('page');
        }
    }, [activePage?.display_mode]);

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        let videoId;
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else {
            return null;
        }
        return `https://www.youtube.com/embed/${videoId}`;
    };
    
    const renderHeader = (section) => {
        const { style = 'photo_top', profileImageUrl, bannerImageUrl, description, social_links = {} } = section.content || {};
        const socialIcons = {
            twitter: <FaTwitter />, instagram: <FaInstagram />, facebook: <FaFacebook />,
            linkedin: <FaLinkedin />, tiktok: <FaTiktok />, youtube: <FaYoutube />
        };
        const hasSocials = Object.values(social_links || {}).some(link => link);

        const ProfileImage = ({ sizeClass = 'w-24 h-24' }) => (
            <div className={`${sizeClass} rounded-full bg-gray-200`}>
                <img src={profileImageUrl || 'https://placehold.co/128x128/00D37F/FFFFFF?text=P'} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
        );

        const BannerImage = () => (
             <div className="h-32 bg-gray-300 bg-cover bg-center" style={{ backgroundImage: `url(${bannerImageUrl || 'https://placehold.co/600x200/121B00/FFFFFF?text=Banner'})` }}></div>
        );

        const ProfileInfo = () => (
            <div className="p-4 text-center">
                <h1 className="font-bold text-lg" style={{ color: theme.textColor }}>{activePage?.brand_name}</h1>
                {activePage?.title && (
                    <span className="inline-block bg-prym-green/10 text-prym-dark-green text-xs font-semibold my-2 px-3 py-1 rounded-full">
                        {activePage.title}
                    </span>
                )}
                <p className="text-sm mt-1" style={{ color: theme.textColor }}>{description}</p>
                 {hasSocials && (
                    <div className="flex justify-center items-center space-x-4 mt-3 text-gray-400">
                        {Object.entries(social_links).map(([key, value]) => value && <a key={key} href={`https://www.${key}.com/${value}`} target="_blank" rel="noopener noreferrer" className="hover:text-prym-pink text-xl">{socialIcons[key]}</a>)}
                    </div>
                 )}
            </div>
        );

        switch(style) {
            case 'banner_only': return <div className="relative text-white text-center"><BannerImage /><div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center p-4"><h1 className="font-bold text-lg">{activePage?.brand_name}</h1><p className="text-sm">{activePage?.title}</p></div></div>
            case 'photo_banner': return <div style={{backgroundColor: theme.blockBgColor}} className="rounded-xl shadow-sm overflow-hidden"><div className="relative"><BannerImage/><div className="absolute -bottom-12 left-1/2 -translate-x-1/2 border-4 border-white rounded-full"><ProfileImage/></div></div><div className="pt-14"><ProfileInfo/></div></div>
            case 'minimal': return <div style={{backgroundColor: theme.blockBgColor}} className="rounded-xl shadow-sm p-4"><ProfileInfo/></div>
            case 'photo_top': default: return <div style={{backgroundColor: theme.blockBgColor}} className="rounded-xl shadow-sm pt-6 flex flex-col items-center"><ProfileImage/><ProfileInfo/></div>
        }
    };

    const renderSectionPreview = (section) => {
        const blockStyle = theme.template === 'shadow' ? { backgroundColor: theme.blockBgColor, border: '1px solid #E5E7EB' } : { backgroundColor: theme.blockBgColor };
        const linkStyle = { backgroundColor: theme.linkColor, color: theme.linkTextColor };
        const shadowLinkStyle = { ...linkStyle, boxShadow: `4px 4px 0px ${theme.buttonShadowColor}` };
        switch (section.section_type) {
            case 'links':
                return (
                    <div className="p-2 space-y-2">
                        {(section.content.links || []).map((link, index) => (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" 
                            className="flex items-center w-full p-2 rounded-lg text-left font-semibold truncate shadow-md hover:scale-[1.03] transition-transform"
                            style={theme.template === 'shadow' ? shadowLinkStyle : linkStyle}
                         >
                                {link.imageUrl ? (
                                    <>
                                        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-md mr-3">
                                            <img src={link.imageUrl} alt={link.title} className="w-full h-full object-cover rounded-md" />
                                        </div>
                                        <span className="text-sm">{link.title || 'Your Link Title'}</span>
                                    </>
                                ) : (
                                    <span className="text-sm text-center w-full">{link.title || 'Your Link Title'}</span>
                                )}
                            </a>
                        ))}
                    </div>
                );
            case 'video_carousel':
                const videos = section.content.videos || [];
                if (videos.length === 0) return null;
                return (
                    <div className="p-2">
                        {section.content.title && <h3 className="font-bold mb-2 px-1" style={{color: theme.textColor}}>{section.content.title}</h3>}
                        <div className="p-3 rounded-lg" style={blockStyle}>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={10}
                            slidesPerView={1}
                            navigation={true}
                            pagination={{ clickable: true }}
                            className="w-full styled-swiper"
                        >
                            {videos.map((video, index) => {
                                const embedUrl = getYoutubeEmbedUrl(video.videoUrl);
                                return (
                                    <SwiperSlide key={index}>
                                        <div className="bg-white p-3 rounded-lg shadow-md ">
                                            <h3 className="font-semibold text-prym-dark-green mb-2 text-sm">{video.title}</h3>
                                            {embedUrl ? <iframe src={embedUrl} title={video.title} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope" allowFullScreen className="w-full aspect-video rounded-md"></iframe> : <div className="w-full aspect-video rounded-md bg-gray-200 flex items-center justify-center text-sm text-gray-500">Invalid URL</div>}
                                            <p className="text-xs text-gray-500 mt-2">{video.description}</p>
                                        </div>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                        </div>
                    </div>
                );
            case 'carousel':
                 const slides = section.content.slides || [];
                 if (slides.length === 0) return null;
                 return (
                    <div className="p-2">
                        {section.content.title && <h3 className="font-bold mb-2 px-1" style={{color: theme.textColor}}>{section.content.title}</h3>}
                        <div className="p-3 rounded-lg" style={blockStyle}>
                        <Swiper modules={[Navigation, Pagination]} spaceBetween={10} slidesPerView={1} navigation pagination={{ clickable: true }} className="w-full styled-swiper">
                            {slides.map((slide, index) => (
                                <SwiperSlide key={index}>
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden" >
                                        <div className="w-full aspect-square bg-gray-200"><img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover"/></div>
                                        <div className="p-3">
                                            <h4 className="font-semibold text-prym-dark-green text-sm">{slide.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{slide.description}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        </div>
                    </div>
                 );
            default:
                return <div className="p-2"><div className="w-full h-16 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center text-sm text-gray-400 capitalize">{section.section_type} Preview</div></div>;
        }
    };

    const StorePreview = () => (
        <div className="p-2 grid grid-cols-2 gap-2">
            {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="w-full aspect-square bg-gray-200">
                        <img 
                            src={product.image || `https://placehold.co/128x128/00D37F/FFFFFF?text=${product.name.charAt(0)}`} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-2">
                        {/* --- CHANGE START --- */}
                        {/* Added specific text color to ensure visibility on all themes */}
                        <p className="font-semibold text-xs truncate text-prym-dark-green">{product.name}</p>
                        <p className="text-xs text-gray-600">₦{product.price}</p>
                        {/* --- CHANGE END --- */}
                    </div>
                </div>
            ))}
        </div>
    );
    
    const headerSection = sections.find(s => s.section_type === 'header');

    const pageStyle = {
        backgroundColor: theme.bgColor,
        backgroundImage: theme.template === 'image_bg' && theme.backgroundImageUrl ? `url(${theme.backgroundImageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div className="w-full max-w-[280px] h-[580px] bg-white rounded-[34px] shadow-2xl p-3 border-8 border-gray-800">
            <style>
                {`
                    .styled-swiper .swiper-button-next, .styled-swiper .swiper-button-prev {
                        color: ${theme.textColor};
                        background-color: ${theme.blockBgColor === 'transparent' ? 'rgba(255, 255, 255, 0.7)' : theme.blockBgColor};
                        border-radius: 9999px;
                        width: 28px;
                        height: 28px;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                    .styled-swiper .swiper-button-next::after, .styled-swiper .swiper-button-prev::after {
                        font-size: 12px;
                        font-weight: bold;
                    }
                    .styled-swiper .swiper-pagination-bullet-active {
                        background-color: ${theme.actionButtonColor};
                    }
                `}
            </style>
            <div className="w-full h-full rounded-[22px] overflow-y-auto" style={pageStyle}>
                {headerSection && renderHeader(headerSection)}
                
                {activePage?.display_mode === 'both' && (
                    <div className="sticky top-0 z-10 p-2" style={{backgroundColor: theme.bgColor}}>
                        <div className="flex w-full bg-gray-500/10 p-1 rounded-lg">
                            <button 
                                onClick={() => setActivePreviewTab('page')} 
                                className={`w-1/2 rounded-md py-1 text-sm font-semibold transition-colors ${activePreviewTab === 'page' ? 'bg-white shadow' : ''}`} 
                                style={{color: activePreviewTab === 'page' ? theme.linkTextColor : theme.textColor, backgroundColor: activePreviewTab === 'page' ? theme.linkColor : 'transparent'}}>
                                Page
                            </button>
                            <button 
                                onClick={() => setActivePreviewTab('store')} 
                                className={`w-1/2 rounded-md py-1 text-sm font-semibold transition-colors ${activePreviewTab === 'store' ? 'bg-white shadow' : ''}`} 
                                style={{color: activePreviewTab === 'store' ? theme.linkTextColor : theme.textColor, backgroundColor: activePreviewTab === 'store' ? theme.linkColor : 'transparent'}}>
                                Store
                            </button>
                        </div>
                    </div>
                )}

                {activePreviewTab === 'page' && activePage?.display_mode !== 'store_only' && (
                    sections.filter(s => s.section_type !== 'header').map(section => (
                        <div key={section.id}>{renderSectionPreview(section)}</div>
                    ))
                )}
                
                {activePreviewTab === 'store' && activePage?.display_mode !== 'page_only' && (
                    <StorePreview />
                )}
            </div>
        </div>
    );
};
export default MobilePreview;